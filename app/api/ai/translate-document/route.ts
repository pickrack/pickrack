/**
 * POST /api/ai/translate-document
 * Body: {
 *   text: string,           // entire document text (from .txt, .md, .html, .csv, or PDF text extracted client-side)
 *   targetLang: string,     // language code from SUPPORTED_LANGUAGES
 *   preserveFormat?: boolean // keep markdown/HTML structure (default true)
 * }
 *
 * Returns: { translation: string, chunks: number }
 *
 * The document is split into ~3500-char chunks (sentence-boundary) so Claude Haiku can translate
 * a long file in multiple passes without losing context. Each chunk is translated independently
 * with consistent system prompt.
 *
 * Free tier: 5 requests/day/IP (translation is heavier than summarize — uses more tokens).
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { anthropicMessage, AnthropicError } from "@/lib/anthropic";
import { SUPPORTED_LANGUAGES } from "@/lib/translate-languages";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_INPUT_CHARS = 50_000;
const CHUNK_TARGET = 3_500;

function chunkText(text: string, target: number): string[] {
  if (text.length <= target) return [text];
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + target, text.length);
    if (end >= text.length) {
      chunks.push(text.slice(i));
      break;
    }
    // Prefer to break on paragraph (\n\n), then sentence (. ), then space
    const window = text.slice(i, end);
    let breakAt =
      window.lastIndexOf("\n\n") !== -1
        ? window.lastIndexOf("\n\n") + 2
        : window.lastIndexOf(". ") !== -1
        ? window.lastIndexOf(". ") + 2
        : window.lastIndexOf(" ") !== -1
        ? window.lastIndexOf(" ") + 1
        : window.length;
    if (breakAt < target * 0.5) breakAt = window.length;
    chunks.push(text.slice(i, i + breakAt));
    i += breakAt;
  }
  return chunks;
}

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "ai-translate-document", 5, 24 * 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = (await req.json()) as {
      text?: unknown;
      targetLang?: unknown;
      preserveFormat?: unknown;
    };

    const text = typeof body.text === "string" ? body.text : "";
    const targetLang = typeof body.targetLang === "string" ? body.targetLang : "";
    const preserveFormat = body.preserveFormat !== false; // default true

    if (!text.trim()) {
      return NextResponse.json({ error: "Document text is required." }, { status: 400 });
    }
    if (text.length > MAX_INPUT_CHARS) {
      return NextResponse.json(
        { error: `Document too long. Max ${MAX_INPUT_CHARS.toLocaleString()} characters.` },
        { status: 413 }
      );
    }
    const languageName = SUPPORTED_LANGUAGES[targetLang];
    if (!languageName) {
      return NextResponse.json({ error: "Unsupported target language." }, { status: 400 });
    }

    const formatRule = preserveFormat
      ? "Preserve every markdown/HTML/whitespace structure exactly: headings, lists, code blocks, links, tables, blank lines between paragraphs. Only translate visible text content."
      : "Output continuous prose. Strip markdown/HTML markup. Preserve paragraph breaks only.";

    const system = `You are a professional document translator. Translate the user's text into ${languageName}.

Rules:
- Output ONLY the translated text. No preamble, no "Here is the translation".
- ${formatRule}
- If a sentence contains a proper noun, brand name, or technical term that is normally untranslated (e.g., "JavaScript", "Anthropic"), keep it as-is.
- For idiomatic phrases, prefer natural expression in ${languageName} over word-for-word.
- Maintain the original tone (formal, casual, academic, etc.).`;

    const chunks = chunkText(text, CHUNK_TARGET);
    const translations: string[] = [];

    for (const chunk of chunks) {
      const translation = await anthropicMessage([{ role: "user", content: chunk }], {
        system,
        maxTokens: 4000,
        temperature: 0.2,
      });
      translations.push(translation.trim());
    }

    return NextResponse.json({
      translation: translations.join("\n\n"),
      chunks: chunks.length,
    });
  } catch (e) {
    if (e instanceof AnthropicError) {
      const status = e.status >= 400 && e.status < 600 ? e.status : 500;
      return NextResponse.json({ error: e.message.slice(0, 200) }, { status });
    }
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[ai/translate-document] Error:", msg);
    return NextResponse.json({ error: `Server error: ${msg.slice(0, 150)}` }, { status: 500 });
  }
}
