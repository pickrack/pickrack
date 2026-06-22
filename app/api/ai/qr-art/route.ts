/**
 * POST /api/ai/qr-art
 * Body: { qrContent, prompt, negativePrompt?, qrcodeWeight?, steps?, guidanceScale? }
 *
 * Returns: { imageUrl: string, source: "local", durationMs: number, genSeconds?: number, queueWaitSeconds?: number }
 *
 * Calls the self-hosted GPU worker at QR_ART_LOCAL_URL. If the worker is unreachable,
 * returns 503 with an explanation. (No Replicate fallback — Pickrack runs this entirely
 * on the operator's local GPU.)
 *
 * GET returns worker status for the frontend badge.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 120;

const LOCAL_WORKER_URL = process.env.QR_ART_LOCAL_URL || "";
const LOCAL_TIMEOUT_MS = 90_000;
const LOCAL_HEALTH_TIMEOUT_MS = 2500;

const MAX_PROMPT_CHARS = 500;
const MAX_QR_CONTENT_CHARS = 1500;

type WorkerHealth = {
  ready?: boolean;
  device?: string;
  current_model?: string;
  vram_total_gb?: number;
  vram_used_gb?: number;
  in_flight?: number;
  max_in_flight?: number;
  gen_count?: number;
  avg_gen_seconds?: number | null;
  last_gen_seconds?: number | null;
  gpu_temp_c?: number;
  gpu_power_w?: number;
  gpu_util_pct?: number;
  gpu_fan_pct?: number;
};

type WorkerGenerateResponse = {
  image_b64?: string;
  format?: string;
  gen_seconds?: number;
  queue_wait_seconds?: number;
  model?: string;
  model_swap_seconds?: number | null;
};

const ALLOWED_MODELS = ["default", "dreamshaper", "realistic", "anime"];

function fetchWithTimeout(url: string, init: RequestInit & { timeoutMs: number }) {
  const { timeoutMs, ...rest } = init;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  return fetch(url, { ...rest, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

async function workerHealth(): Promise<WorkerHealth | null> {
  if (!LOCAL_WORKER_URL) return null;
  try {
    const res = await fetchWithTimeout(`${LOCAL_WORKER_URL}/health`, { timeoutMs: LOCAL_HEALTH_TIMEOUT_MS });
    if (!res.ok) return null;
    return (await res.json()) as WorkerHealth;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const qrContent = typeof body.qrContent === "string" ? body.qrContent.trim() : "";
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const negativePrompt = typeof body.negativePrompt === "string" ? body.negativePrompt.trim() : "";
  const qrcodeWeight = clampNum(body.qrcodeWeight, 0.5, 3, 1.4);
  const steps = clampInt(body.steps, 10, 50, 30);
  const guidanceScale = clampNum(body.guidanceScale, 1, 20, 7.5);
  const requestedModel = typeof body.model === "string" ? body.model.trim() : "";
  const model = ALLOWED_MODELS.includes(requestedModel) ? requestedModel : undefined;

  if (!qrContent) {
    return NextResponse.json({ error: "qrContent is required." }, { status: 400 });
  }
  if (qrContent.length > MAX_QR_CONTENT_CHARS) {
    return NextResponse.json({ error: `qrContent too long (max ${MAX_QR_CONTENT_CHARS} chars).` }, { status: 413 });
  }
  if (!prompt) {
    return NextResponse.json({ error: "prompt is required." }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return NextResponse.json({ error: `prompt too long (max ${MAX_PROMPT_CHARS} chars).` }, { status: 413 });
  }

  if (!LOCAL_WORKER_URL) {
    return NextResponse.json(
      { error: "AI-art QR is offline — no GPU worker is configured. Contact the operator." },
      { status: 503 },
    );
  }

  // Light per-IP rate limit — protects the single-GPU worker from being slammed
  const limited = checkRateLimit(req, "ai-qr-art", 20, 60 * 60 * 1000);
  if (limited) return limited;

  // Check worker readiness — fail fast if PC is asleep/off
  const health = await workerHealth();
  if (!health || health.ready !== true) {
    return NextResponse.json(
      { error: "GPU worker is offline (PC asleep or not running). Try again in a few minutes — auto-status reloads every minute." },
      { status: 503 },
    );
  }

  const startedAt = Date.now();
  try {
    const res = await fetchWithTimeout(`${LOCAL_WORKER_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        qr_content: qrContent,
        prompt,
        negative_prompt: negativePrompt || undefined,
        num_inference_steps: steps,
        guidance_scale: guidanceScale,
        controlnet_conditioning_scale: qrcodeWeight,
        model,
      }),
      timeoutMs: LOCAL_TIMEOUT_MS,
    });

    if (!res.ok) {
      let detail = "Generation failed.";
      try {
        const errBody = (await res.json()) as { detail?: string };
        if (errBody.detail) detail = errBody.detail;
      } catch { /* not JSON */ }
      // Forward 4xx/5xx with a friendlier message; map 503/507 carefully so CF passes through
      const status = res.status === 503 || res.status === 507 || res.status === 429 ? res.status : 502;
      return NextResponse.json({ error: detail }, { status });
    }

    const data = (await res.json()) as WorkerGenerateResponse;
    if (!data.image_b64) {
      return NextResponse.json({ error: "Worker returned no image." }, { status: 502 });
    }

    return NextResponse.json({
      imageUrl: `data:image/${data.format || "png"};base64,${data.image_b64}`,
      source: "local",
      durationMs: Date.now() - startedAt,
      genSeconds: data.gen_seconds,
      queueWaitSeconds: data.queue_wait_seconds,
      model: data.model,
      modelSwapSeconds: data.model_swap_seconds,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[ai/qr-art] Worker call failed:", msg);
    return NextResponse.json(
      { error: "GPU worker did not respond in time. Try again, or wait for the worker to wake up." },
      { status: 504 },
    );
  }
}

export async function GET() {
  if (!LOCAL_WORKER_URL) {
    return NextResponse.json({ local: { configured: false } });
  }
  const health = await workerHealth();
  if (!health) {
    return NextResponse.json({ local: { configured: true, ready: false } });
  }
  return NextResponse.json({
    local: {
      configured: true,
      ready: health.ready === true,
      device: health.device || "unknown",
      currentModel: health.current_model,
      vramTotalGb: health.vram_total_gb,
      vramUsedGb: health.vram_used_gb,
      inFlight: health.in_flight,
      maxInFlight: health.max_in_flight,
      genCount: health.gen_count,
      avgGenSeconds: health.avg_gen_seconds,
      gpuTempC: health.gpu_temp_c,
      gpuPowerW: health.gpu_power_w,
      gpuUtilPct: health.gpu_util_pct,
    },
  });
}

function clampNum(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  return Math.round(clampNum(v, min, max, fallback));
}
