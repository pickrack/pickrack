/**
 * GET /api/currency/rates?base=USD
 *
 * Server-side proxy to exchangerate-api.com.
 * The API key (EXCHANGERATE_API_KEY) lives in server env, never reaches the browser.
 *
 * Falls back to the public open.er-api.com endpoint if no key is configured.
 * Server caches responses in-memory for 60 minutes per base currency.
 *
 * Rate limit: 60 requests/hour/IP (generous — browser caches client-side too).
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

type Rates = { base: string; date: string; rates: Record<string, number> };
const cache = new Map<string, { data: Rates; ts: number }>();
const TTL_MS = 60 * 60 * 1000;

const VALID_BASES = new Set([
  "USD","EUR","GBP","JPY","CNY","VND","AUD","CAD","CHF","HKD","SGD","INR","KRW",
  "THB","MYR","IDR","PHP","TWD","BRL","MXN","NZD","SEK","NOK","DKK","PLN","TRY",
  "ZAR","AED",
]);

export async function GET(req: NextRequest) {
  const limited = checkRateLimit(req, "currency-rates", 60, 60 * 60 * 1000);
  if (limited) return limited;

  const base = (req.nextUrl.searchParams.get("base") ?? "USD").toUpperCase();
  if (!VALID_BASES.has(base)) {
    return NextResponse.json({ error: "Unsupported base currency." }, { status: 400 });
  }

  const cached = cache.get(base);
  if (cached && Date.now() - cached.ts < TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  }

  const apiKey = process.env.EXCHANGERATE_API_KEY;
  const url = apiKey
    ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`
    : `https://open.er-api.com/v6/latest/${base}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) {
      // Serve stale cache on upstream failure
      if (cached) return NextResponse.json(cached.data);
      return NextResponse.json(
        { error: `Rate provider returned HTTP ${res.status}.` },
        { status: 502 }
      );
    }
    const data = await res.json();

    // exchangerate-api.com (keyed) returns { result: "success", conversion_rates, time_last_update_utc, base_code }
    // open.er-api.com (free) returns { result: "success", rates, time_last_update_utc, base_code }
    const rates = (data.conversion_rates ?? data.rates) as Record<string, number> | undefined;
    if (data.result !== "success" || !rates) {
      if (cached) return NextResponse.json(cached.data);
      return NextResponse.json({ error: "Rate provider returned an error." }, { status: 502 });
    }

    const payload: Rates = {
      base: data.base_code ?? base,
      date: data.time_last_update_utc ?? new Date().toISOString(),
      rates,
    };
    cache.set(base, { data: payload, ts: Date.now() });
    return NextResponse.json(payload, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch (e) {
    if (cached) return NextResponse.json(cached.data);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Could not fetch rates: ${msg.slice(0, 150)}` }, { status: 502 });
  }
}
