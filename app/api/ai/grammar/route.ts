/**
 * POST /api/ai/grammar
 * Body: { text: string }
 *
 * Returns: { corrected: string, issues: Array<{ original: string, fix: string, reason: string }> }
 *
 * Free tier: 10 requests/day/IP. Haiku 4.5 backend.
 * Max input: 6,000 characters (~1,500 tokens).
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { anthropicMessage, AnthropicError } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_INPUT_CHARS = 6_000;

const SYSTEM_PROMPT = `You are a grammar and spelling checker. Your job is to fix grammar, spelling, and punctuation errors in the user's text WITHOUT changing the meaning, voice, style, or word choice unless those words are objectively wrong.

Rules:
- Only fix: spelling, grammar, punctuation, capitalization, subject-verb agreement, article (a/an/the) usage, basic sentence structure errors.
- Do NOT change: tone, register (formal/casual), word choice when alternatives are valid, style preferences (Oxford comma is optional, etc.).
- Preserve the original language. If input is Vietnamese, fix Vietnamese; English → English; etc.
- Preserve formatting: paragraphs, line breaks, bullets, markdown.
- If text has no errors, return it unchanged.

Output format: STRICT JSON, no markdown wrapping, no explanation. Schema:

{
  "corrected": "the full corrected text",
  "issues": [
    { "original": "exact span from input", "fix": "what it should be", "reason": "brief — e.g. 'subject-verb agreement', 'missing article', 'misspelling'" }
  ]
}

If no issues, return { "corrected": "<input verbatim>", "issues": [] }.`;

type GrammarIssue = {
  original: string;
  fix: string;
  reason: string;
};

type GrammarResult = {
  corrected: string;
  issues: GrammarIssue[];
};

function tryParseJson(s: string): GrammarResult | null {
  // Trim first, then strip markdown fences (Claude often wraps with ```json ... ```)
  const trimmed = s.trim();
  const cleaned = trimmed
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?\s*```\s*$/, "")
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.corrected === "string" &&
      Array.isArray(parsed.issues)
    ) {
      return parsed as GrammarResult;
    }
  } catch {
    /* fallthrough */
  }

  // Last resort: try to extract JSON object from anywhere in the text
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (
        parsed &&
        typeof parsed === "object" &&
        typeof parsed.corrected === "string" &&
        Array.isArray(parsed.issues)
      ) {
        return parsed as GrammarResult;
      }
    } catch {
      /* fallthrough */
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "ai-grammar", 10, 24 * 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = (await req.json()) as { text?: unknown };
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }
    if (text.length > MAX_INPUT_CHARS) {
      return NextResponse.json(
        { error: `Text too long. Max ${MAX_INPUT_CHARS.toLocaleString()} characters.` },
        { status: 413 }
      );
    }

    // Minimum 800 tokens — short input still needs space for the JSON envelope + issues array.
    const raw = await anthropicMessage(
      [{ role: "user", content: text }],
      {
        system: SYSTEM_PROMPT,
        maxTokens: Math.max(800, Math.min(4000, Math.ceil(text.length * 3))),
        temperature: 0,
      }
    );

    const parsed = tryParseJson(raw);
    if (!parsed) {
      // Fallback: if model didn't follow JSON instruction, return raw as corrected with no issues
      return NextResponse.json({
        corrected: raw.trim(),
        issues: [],
        warning: "AI did not return structured issues; only corrected text is shown.",
      });
    }

    return NextResponse.json(parsed);
  } catch (e) {
    if (e instanceof AnthropicError) {
      const status = e.status >= 400 && e.status < 600 ? e.status : 500;
      return NextResponse.json({ error: e.message.slice(0, 200) }, { status });
    }
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[ai/grammar] Error:", msg);
    return NextResponse.json({ error: `Server error: ${msg.slice(0, 150)}` }, { status: 500 });
  }
}
