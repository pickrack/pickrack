/**
 * POST /api/ai/img2img
 * Body: { imageB64, prompt, negativePrompt?, strength?, steps?, guidanceScale?, model?, maxSide? }
 * Returns: { imageUrl, durationMs, genSeconds, model, modelSwapSeconds, input/output dims }
 *
 * Forwards to the self-hosted GPU worker's /img2img (SD Img2Img Pipeline shared with QR-art weights).
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 120;

const LOCAL_WORKER_URL = process.env.QR_ART_LOCAL_URL || "";
const LOCAL_TIMEOUT_MS = 90_000;
const LOCAL_HEALTH_TIMEOUT_MS = 2500;
const MAX_INPUT_BYTES = 8 * 1024 * 1024;
const MAX_PROMPT_CHARS = 500;
const ALLOWED_MODELS = [
  // SD 1.5 family
  "default", "dreamshaper", "realistic", "anime",
  // SDXL family — higher quality, slower
  "juggernaut-xl", "realvis-xl", "dreamshaper-xl", "dreamshaper-xl-lightning",
];

type WorkerResponse = {
  image_b64?: string;
  format?: string;
  gen_seconds?: number;
  model?: string;
  model_swap_seconds?: number | null;
  input_width?: number;
  input_height?: number;
  output_width?: number;
  output_height?: number;
  detail?: string;
};

function fetchWithTimeout(url: string, init: RequestInit & { timeoutMs: number }) {
  const { timeoutMs, ...rest } = init;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  return fetch(url, { ...rest, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

function clampNum(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  return Math.round(clampNum(v, min, max, fallback));
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const imageB64 = typeof body.imageB64 === "string" ? body.imageB64 : "";
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const negativePrompt = typeof body.negativePrompt === "string" ? body.negativePrompt.trim() : "";
  const strength = clampNum(body.strength, 0.1, 0.95, 0.65);
  const steps = clampInt(body.steps, 10, 50, 30);
  const guidanceScale = clampNum(body.guidanceScale, 1, 20, 7.5);
  const maxSide = clampInt(body.maxSide, 512, 1024, 768);
  const requestedModel = typeof body.model === "string" ? body.model.trim() : "";
  const model = ALLOWED_MODELS.includes(requestedModel) ? requestedModel : undefined;

  if (!imageB64) {
    return NextResponse.json({ error: "imageB64 is required." }, { status: 400 });
  }
  if (imageB64.length > MAX_INPUT_BYTES) {
    return NextResponse.json({ error: "Image too large. Max ~6MB. Resize first." }, { status: 413 });
  }
  if (!prompt) {
    return NextResponse.json({ error: "prompt is required (style description)." }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return NextResponse.json({ error: `prompt too long (max ${MAX_PROMPT_CHARS} chars).` }, { status: 413 });
  }
  if (!LOCAL_WORKER_URL) {
    return NextResponse.json(
      { error: "AI img2img is offline — no GPU worker configured. Contact the operator." },
      { status: 503 },
    );
  }

  const limited = checkRateLimit(req, "ai-img2img", 20, 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const healthRes = await fetchWithTimeout(`${LOCAL_WORKER_URL}/health`, { timeoutMs: LOCAL_HEALTH_TIMEOUT_MS });
    if (!healthRes.ok) throw new Error(`health ${healthRes.status}`);
    const health = (await healthRes.json()) as { ready?: boolean; img2img_ready?: boolean };
    if (!health.ready) {
      return NextResponse.json({ error: "GPU worker not ready (model still loading)." }, { status: 503 });
    }
    if (health.img2img_ready === false) {
      return NextResponse.json({ error: "Img2img pipeline not loaded on worker." }, { status: 503 });
    }
  } catch {
    return NextResponse.json(
      { error: "GPU worker is offline (PC asleep or down). Try again in a few minutes — auto-status reloads every minute." },
      { status: 503 },
    );
  }

  const startedAt = Date.now();
  try {
    const res = await fetchWithTimeout(`${LOCAL_WORKER_URL}/img2img`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_b64: imageB64,
        prompt,
        negative_prompt: negativePrompt || undefined,
        strength,
        num_inference_steps: steps,
        guidance_scale: guidanceScale,
        max_side: maxSide,
        model,
      }),
      timeoutMs: LOCAL_TIMEOUT_MS,
    });

    if (!res.ok) {
      let detail = `Worker returned ${res.status}`;
      try {
        const errBody = (await res.json()) as WorkerResponse;
        if (errBody.detail) detail = errBody.detail;
      } catch { /* not JSON */ }
      const status = res.status === 503 || res.status === 507 || res.status === 429 || res.status === 413 ? res.status : 502;
      return NextResponse.json({ error: detail }, { status });
    }

    const data = (await res.json()) as WorkerResponse;
    if (!data.image_b64) {
      return NextResponse.json({ error: "Worker returned no image." }, { status: 502 });
    }

    return NextResponse.json({
      imageUrl: `data:image/${data.format || "png"};base64,${data.image_b64}`,
      durationMs: Date.now() - startedAt,
      genSeconds: data.gen_seconds,
      model: data.model,
      modelSwapSeconds: data.model_swap_seconds,
      inputWidth: data.input_width,
      inputHeight: data.input_height,
      outputWidth: data.output_width,
      outputHeight: data.output_height,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[ai/img2img] Worker call failed:", msg);
    return NextResponse.json(
      { error: "GPU worker did not respond in time. Try again, or wait for it to wake up." },
      { status: 504 },
    );
  }
}
