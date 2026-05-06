/**
 * POST /api/ai/translate
 * Body: { text: string, target: string }
 *
 * Returns: { translation: string, detectedSource?: string }
 *
 * Free tier: 10 requests/day/IP. Haiku 4.5 backend.
 * Max input: 8,000 characters.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { anthropicMessage, AnthropicError } from "@/lib/anthropic";
import { SUPPORTED_LANGUAGES } from "@/lib/translate-languages";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_INPUT_CHARS = 8_000;

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "ai-translate", 10, 24 * 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = (await req.json()) as { text?: unknown; target?: unknown };
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const targetCode = typeof body.target === "string" ? body.target.toLowerCase() : "";

    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }
    if (text.length > MAX_INPUT_CHARS) {
      return NextResponse.json(
        { error: `Text too long. Max ${MAX_INPUT_CHARS.toLocaleString()} characters.` },
        { status: 413 }
      );
    }

    const targetLanguage = SUPPORTED_LANGUAGES[targetCode];
    if (!targetLanguage) {
      return NextResponse.json(
        { error: "Unsupported target language. See supported list." },
        { status: 400 }
      );
    }

    const system = `You are a professional translator. Translate the user's text into ${targetLanguage}.

Rules:
- Preserve formatting exactly: line breaks, paragraph breaks, bullet points (- or *), numbered lists, markdown bold (**) and italic (*), code blocks (\`\`\`).
- Do not add commentary, explanations, or notes. Output only the translation.
- Keep proper nouns (names, brands, technical terms) in original form unless they have a well-established translation.
- For idioms, use a natural ${targetLanguage} equivalent rather than literal word-for-word.
- Maintain the tone (formal/casual/technical) of the source.`;

    const translation = await anthropicMessage(
      [{ role: "user", content: text }],
      { system, maxTokens: Math.min(2048, Math.ceil(text.length * 1.5)), temperature: 0.1 }
    );

    return NextResponse.json({
      translation: translation.trim(),
      target: targetCode,
      targetLanguage,
    });
  } catch (e) {
    if (e instanceof AnthropicError) {
      const status = e.status >= 400 && e.status < 600 ? e.status : 500;
      return NextResponse.json({ error: e.message.slice(0, 200) }, { status });
    }
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[ai/translate] Error:", msg);
    return NextResponse.json({ error: `Server error: ${msg.slice(0, 150)}` }, { status: 500 });
  }
}

