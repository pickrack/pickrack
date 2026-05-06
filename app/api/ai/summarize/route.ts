/**
 * POST /api/ai/summarize
 * Body: { text: string, length?: "short" | "medium" | "long" }
 *
 * Returns: { summary: string }
 *
 * Free tier: 10 requests/day/IP. Haiku 4.5 backend.
 * Max input: 12,000 characters (~3,000 tokens).
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { anthropicMessage, AnthropicError } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_INPUT_CHARS = 12_000;

const LENGTH_PROMPTS: Record<"short" | "medium" | "long", string> = {
  short: "Summarize in 2-3 concise sentences. Capture only the most important point.",
  medium: "Summarize in 4-6 sentences. Cover the main points and any critical details.",
  long: "Summarize in 8-12 sentences with bullet points. Cover all main points, key supporting details, and any important conclusions.",
};

export async function POST(req: NextRequest) {
  // Daily limit per IP: 10 req per 24h
  const limited = checkRateLimit(req, "ai-summarize", 10, 24 * 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = (await req.json()) as { text?: unknown; length?: unknown };
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const length = typeof body.length === "string" && body.length in LENGTH_PROMPTS
      ? (body.length as keyof typeof LENGTH_PROMPTS)
      : "medium";

    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }
    if (text.length > MAX_INPUT_CHARS) {
      return NextResponse.json(
        { error: `Text too long. Max ${MAX_INPUT_CHARS.toLocaleString()} characters.` },
        { status: 413 }
      );
    }
    if (text.length < 100) {
      return NextResponse.json(
        { error: "Text too short to summarize meaningfully (minimum 100 characters)." },
        { status: 400 }
      );
    }

    const system = `You are a precise text summarizer. ${LENGTH_PROMPTS[length]}

Rules:
- Output only the summary itself. No preamble like "Here's a summary" or "This text discusses".
- Preserve the original language: if the input is in Vietnamese, summarize in Vietnamese; if English, English; etc.
- Stay factual to the source. Do not add interpretations or opinions.
- For bullet points (long mode), use - prefix.`;

    const summary = await anthropicMessage(
      [{ role: "user", content: text }],
      { system, maxTokens: length === "long" ? 800 : length === "medium" ? 400 : 200, temperature: 0.2 }
    );

    return NextResponse.json({ summary: summary.trim() });
  } catch (e) {
    if (e instanceof AnthropicError) {
      const status = e.status >= 400 && e.status < 600 ? e.status : 500;
      return NextResponse.json({ error: e.message.slice(0, 200) }, { status });
    }
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[ai/summarize] Error:", msg);
    return NextResponse.json({ error: `Server error: ${msg.slice(0, 150)}` }, { status: 500 });
  }
}
