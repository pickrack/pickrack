/**
 * In-memory sliding window rate limit. Single PM2 instance only.
 * For multi-instance scale, replace with Redis/Upstash Ratelimit.
 */

import { NextRequest, NextResponse } from "next/server";

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, e] of buckets.entries()) {
    if (e.resetAt < now) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

function getClientIp(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

export function checkRateLimit(
  req: NextRequest,
  bucket: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const ip = getClientIp(req);
  const key = `${bucket}:${ip}`;
  const now = Date.now();

  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (existing.count >= limit) {
    const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
    return NextResponse.json(
      { error: `Too many requests. Try again in ${retryAfter}s.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(existing.resetAt / 1000)),
        },
      }
    );
  }

  existing.count += 1;
  return null;
}
