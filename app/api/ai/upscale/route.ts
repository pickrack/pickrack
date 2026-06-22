/**
 * POST /api/ai/upscale
 * Body: { imageB64: string, scale?: 2 | 4 }
 * Returns: { imageUrl, durationMs, inputWidth, inputHeight, outputWidth, outputHeight, upscaleSeconds }
 *
 * Forwards to the self-hosted GPU worker's /upscale (Swin2SR via transformers).
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 120;

const LOCAL_WORKER_URL = process.env.QR_ART_LOCAL_URL || "";
const LOCAL_TIMEOUT_MS = 90_000;
const LOCAL_HEALTH_TIMEOUT_MS = 2500;
const MAX_INPUT_BYTES = 8 * 1024 * 1024; // 8MB base64 ≈ 6MB binary

type WorkerResponse = {
  image_b64?: string;
  format?: string;
  input_width?: number;
  input_height?: number;
  output_width?: number;
  output_height?: number;
  upscale_seconds?: number;
  detail?: string;
};

function fetchWithTimeout(url: string, init: RequestInit & { timeoutMs: number }) {
  const { timeoutMs, ...rest } = init;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  return fetch(url, { ...rest, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

export async function POST(req: NextRequest) {
  let body: { imageB64?: unknown; scale?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const imageB64 = typeof body.imageB64 === "string" ? body.imageB64 : "";
  const scale = body.scale === 2 ? 2 : 4;

  if (!imageB64) {
    return NextResponse.json({ error: "imageB64 is required." }, { status: 400 });
  }
  if (imageB64.length > MAX_INPUT_BYTES) {
    return NextResponse.json({ error: `Image too large. Max ~6MB. Resize first.` }, { status: 413 });
  }
  if (!LOCAL_WORKER_URL) {
    return NextResponse.json(
      { error: "AI upscaler is offline — no GPU worker configured. Contact the operator." },
      { status: 503 },
    );
  }

  const limited = checkRateLimit(req, "ai-upscale", 20, 60 * 60 * 1000);
  if (limited) return limited;

  // Quick health check
  try {
    const healthRes = await fetchWithTimeout(`${LOCAL_WORKER_URL}/health`, { timeoutMs: LOCAL_HEALTH_TIMEOUT_MS });
    if (!healthRes.ok) throw new Error(`health ${healthRes.status}`);
    const health = (await healthRes.json()) as { ready?: boolean; upscaler_ready?: boolean };
    if (!health.ready) {
      return NextResponse.json({ error: "GPU worker not ready (model still loading)." }, { status: 503 });
    }
    if (health.upscaler_ready === false) {
      return NextResponse.json({ error: "Upscaler model not loaded on worker — server log shows the cause." }, { status: 503 });
    }
  } catch {
    return NextResponse.json(
      { error: "GPU worker is offline (PC asleep or down). Try again in a few minutes — auto-status reloads every minute." },
      { status: 503 },
    );
  }

  const startedAt = Date.now();
  try {
    const res = await fetchWithTimeout(`${LOCAL_WORKER_URL}/upscale`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_b64: imageB64, target_scale: scale }),
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
      inputWidth: data.input_width,
      inputHeight: data.input_height,
      outputWidth: data.output_width,
      outputHeight: data.output_height,
      upscaleSeconds: data.upscale_seconds,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[ai/upscale] Worker call failed:", msg);
    return NextResponse.json(
      { error: "GPU worker did not respond in time. Try again, or wait for it to wake up." },
      { status: 504 },
    );
  }
}
