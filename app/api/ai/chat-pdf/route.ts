/**
 * POST /api/ai/chat-pdf
 * Body: {
 *   documentText: string,   // PDF extracted in browser, sent as text
 *   question: string,       // current user question
 *   history?: { role: "user" | "assistant"; content: string }[]  // prior turns (excluding current)
 * }
 *
 * Returns: { answer: string }
 *
 * Free tier: 30 requests/day/IP (chat is per-turn, more generous than one-shot tools).
 * Claude Haiku 4.5 backend, stateless.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { anthropicMessage, AnthropicError, type AnthropicMessage } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_DOC_CHARS = 80_000;
const MAX_QUESTION_CHARS = 2_000;
const MAX_HISTORY_TURNS = 12;

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "ai-chat-pdf", 30, 24 * 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = (await req.json()) as {
      documentText?: unknown;
      question?: unknown;
      history?: unknown;
    };

    const documentText = typeof body.documentText === "string" ? body.documentText : "";
    const question = typeof body.question === "string" ? body.question.trim() : "";

    if (!documentText) {
      return NextResponse.json({ error: "Document text is required." }, { status: 400 });
    }
    if (documentText.length > MAX_DOC_CHARS) {
      return NextResponse.json(
        { error: `Document too long. Max ${MAX_DOC_CHARS.toLocaleString()} characters (approx 30-50 pages).` },
        { status: 413 }
      );
    }
    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }
    if (question.length > MAX_QUESTION_CHARS) {
      return NextResponse.json(
        { error: `Question too long. Max ${MAX_QUESTION_CHARS} characters.` },
        { status: 413 }
      );
    }

    // Sanitize history
    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const history: AnthropicMessage[] = [];
    for (const turn of rawHistory.slice(-MAX_HISTORY_TURNS)) {
      if (
        typeof turn === "object" &&
        turn !== null &&
        (("role" in turn && (turn.role === "user" || turn.role === "assistant"))) &&
        "content" in turn &&
        typeof turn.content === "string"
      ) {
        history.push({ role: turn.role as "user" | "assistant", content: turn.content.slice(0, 4000) });
      }
    }

    const system = `You are a precise document Q&A assistant. The user has shared a PDF (text extracted below). Answer questions only using information from the document. If the answer is not in the document, say so plainly — do not guess.

Rules:
- Quote short passages from the document when helpful (use "quotation marks").
- For numeric or factual claims, cite the relevant section heading or paragraph context if possible.
- Preserve the document's language: if it's Vietnamese, answer in Vietnamese; if English, English.
- Keep answers concise — 2-6 sentences unless the question explicitly asks for more.
- If the document is truncated or unclear, mention it.

=== DOCUMENT START ===
${documentText}
=== DOCUMENT END ===`;

    const messages: AnthropicMessage[] = [...history, { role: "user", content: question }];

    const answer = await anthropicMessage(messages, {
      system,
      maxTokens: 1024,
      temperature: 0.1,
    });

    return NextResponse.json({ answer: answer.trim() });
  } catch (e) {
    if (e instanceof AnthropicError) {
      const status = e.status >= 400 && e.status < 600 ? e.status : 500;
      return NextResponse.json({ error: e.message.slice(0, 200) }, { status });
    }
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[ai/chat-pdf] Error:", msg);
    return NextResponse.json({ error: `Server error: ${msg.slice(0, 150)}` }, { status: 500 });
  }
}
