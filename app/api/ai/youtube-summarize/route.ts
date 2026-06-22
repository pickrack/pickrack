/**
 * POST /api/ai/youtube-summarize
 * Body: { url: string, length?: "short" | "medium" | "long" }
 *
 * Fetches the YouTube transcript by parsing the public timedtext endpoint,
 * then runs Claude Haiku 4.5 to summarize.
 *
 * Free tier: 10 requests/day/IP. Same as other AI tools.
 *
 * Note: relies on the public timedtext XML feed Google exposes for caption-bearing videos.
 * Videos without captions (auto or manual) cannot be summarized and return a clear error.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { anthropicMessage, AnthropicError } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_TRANSCRIPT_CHARS = 50_000;

const LENGTH_PROMPTS: Record<"short" | "medium" | "long", string> = {
  short: "Summarize the video in 3-4 sentences. Capture the core thesis and one supporting point.",
  medium: "Summarize the video in 6-10 sentences. Cover the thesis, 2-3 main points, and any actionable takeaway.",
  long: "Provide a structured summary: a 2-sentence thesis at the top, then 5-10 bullet points covering main arguments, examples, and conclusions, then a 1-sentence takeaway at the bottom.",
};

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1) || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const shorts = u.pathname.match(/^\/shorts\/([\w-]+)/);
      if (shorts) return shorts[1];
      const embed = u.pathname.match(/^\/embed\/([\w-]+)/);
      if (embed) return embed[1];
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchTranscript(videoId: string): Promise<{ text: string; title: string | null }> {
  // Step 1: fetch the watch page to discover available caption tracks
  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
  const watchRes = await fetch(watchUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!watchRes.ok) {
    throw new Error(`YouTube returned HTTP ${watchRes.status} for video page.`);
  }
  const html = await watchRes.text();

  // Title (best-effort)
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(/\s*-\s*YouTube\s*$/, "").trim() : null;

  // Pull captionTracks JSON blob
  const captionMatch = html.match(/"captionTracks":\s*(\[[^\]]+\])/);
  if (!captionMatch) {
    throw new Error("This video has no captions. Try a different video with subtitles enabled.");
  }
  let tracks: Array<{ baseUrl?: string; languageCode?: string; kind?: string }> = [];
  try {
    tracks = JSON.parse(captionMatch[1].replace(/\\u0026/g, "&"));
  } catch {
    throw new Error("Could not parse YouTube caption tracks.");
  }
  if (tracks.length === 0) {
    throw new Error("This video has no captions.");
  }

  // Prefer English, then any non-auto, then first available
  const preferred =
    tracks.find((t) => t.languageCode === "en" && t.kind !== "asr") ||
    tracks.find((t) => t.languageCode === "en") ||
    tracks.find((t) => t.kind !== "asr") ||
    tracks[0];
  if (!preferred?.baseUrl) {
    throw new Error("Could not locate a usable caption track.");
  }

  const xmlRes = await fetch(preferred.baseUrl);
  if (!xmlRes.ok) {
    throw new Error(`Caption fetch failed (HTTP ${xmlRes.status}).`);
  }
  const xml = await xmlRes.text();

  // Parse <text start="..." dur="...">content</text>
  const lines: string[] = [];
  const lineRegex = /<text[^>]*>([\s\S]*?)<\/text>/g;
  let m: RegExpExecArray | null;
  while ((m = lineRegex.exec(xml)) !== null) {
    const raw = m[1]
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (raw) lines.push(raw);
  }
  if (lines.length === 0) {
    throw new Error("Caption track is empty.");
  }

  return { text: lines.join(" "), title };
}

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "ai-youtube-summarize", 10, 24 * 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = (await req.json()) as { url?: unknown; length?: unknown };
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const length =
      typeof body.length === "string" && body.length in LENGTH_PROMPTS
        ? (body.length as keyof typeof LENGTH_PROMPTS)
        : "medium";

    if (!url) {
      return NextResponse.json({ error: "YouTube URL is required." }, { status: 400 });
    }
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL. Paste a youtube.com/watch or youtu.be link." }, { status: 400 });
    }

    let transcript: { text: string; title: string | null };
    try {
      transcript = await fetchTranscript(videoId);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Could not fetch transcript." },
        { status: 400 }
      );
    }

    if (transcript.text.length > MAX_TRANSCRIPT_CHARS) {
      transcript.text = transcript.text.slice(0, MAX_TRANSCRIPT_CHARS) + " […truncated]";
    }

    const system = `You are a precise YouTube video summarizer. ${LENGTH_PROMPTS[length]}

Rules:
- Output only the summary itself. No preamble like "Here's a summary".
- Preserve the language of the transcript: if it's Vietnamese, summarize in Vietnamese; if English, English.
- Stay factual to the transcript content. Do not add interpretations the speaker did not make.
- For bullet points (long mode), use - prefix.`;

    const userContent = transcript.title
      ? `Title: ${transcript.title}\n\nTranscript:\n${transcript.text}`
      : `Transcript:\n${transcript.text}`;

    const summary = await anthropicMessage([{ role: "user", content: userContent }], {
      system,
      maxTokens: length === "long" ? 1200 : length === "medium" ? 600 : 300,
      temperature: 0.2,
    });

    return NextResponse.json({
      summary: summary.trim(),
      videoId,
      title: transcript.title,
      transcriptChars: transcript.text.length,
    });
  } catch (e) {
    if (e instanceof AnthropicError) {
      const status = e.status >= 400 && e.status < 600 ? e.status : 500;
      return NextResponse.json({ error: e.message.slice(0, 200) }, { status });
    }
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[ai/youtube-summarize] Error:", msg);
    return NextResponse.json({ error: `Server error: ${msg.slice(0, 150)}` }, { status: 500 });
  }
}
