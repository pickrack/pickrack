"use client";

import { useState } from "react";
import { Loader2, Copy, Check, Youtube, AlertTriangle } from "lucide-react";

type Length = "short" | "medium" | "long";

const LENGTH_LABEL: Record<Length, { label: string; desc: string }> = {
  short: { label: "Short", desc: "3-4 sentences" },
  medium: { label: "Medium", desc: "6-10 sentences" },
  long: { label: "Long", desc: "Bullet structure" },
};

type Result = { summary: string; videoId: string; title: string | null; transcriptChars: number };

export default function YoutubeSummarizerPage() {
  const [url, setUrl] = useState("");
  const [length, setLength] = useState<Length>("medium");
  const [result, setResult] = useState<Result | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const summarize = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Paste a YouTube URL.");
      return;
    }
    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai/youtube-summarize/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed, length }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Summarization failed.");
    } finally {
      setProcessing(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">YouTube Video Summarizer</h1>
        <p className="mt-3 text-gray-600">
          Paste a YouTube URL and get a Claude Haiku 4.5 summary of the transcript. Free, no signup, daily quota of 10.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 flex items-start gap-3 text-sm text-violet-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-violet-600" />
        <div>
          <p className="font-medium">Requires a video with captions</p>
          <p className="mt-1 text-violet-800">
            The summarizer reads YouTube&apos;s public caption track. If a video has no captions (auto-generated or manual), you&apos;ll see a clear error. Most popular videos have them; the few that don&apos;t are usually short uploads or live streams.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-1 block flex items-center gap-1.5">
            <Youtube className="w-4 h-4 text-violet-600" /> YouTube URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="w-full rounded-xl border px-4 py-3 text-sm focus:border-violet-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Summary length</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(LENGTH_LABEL) as Length[]).map((id) => (
              <button
                key={id}
                onClick={() => setLength(id)}
                className={`p-3 rounded-xl border text-left transition ${
                  length === id ? "border-violet-500 bg-violet-50" : "bg-white"
                }`}
                style={{ borderColor: length === id ? undefined : "var(--color-border)" }}
              >
                <p className={`text-sm font-semibold ${length === id ? "text-violet-700" : "text-gray-900"}`}>
                  {LENGTH_LABEL[id].label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{LENGTH_LABEL[id].desc}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={summarize}
          disabled={processing || !url.trim()}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 transition disabled:opacity-50"
        >
          {processing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Fetching transcript &amp; summarizing…</>
          ) : (
            <><Youtube className="w-4 h-4" /> Summarize video</>
          )}
        </button>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
        )}

        {result && (
          <div className="rounded-2xl border border-violet-200 bg-white p-5">
            <div className="flex items-start justify-between mb-3 gap-2 flex-wrap">
              <div className="flex-1 min-w-0">
                {result.title && (
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">{result.title}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Transcript: {result.transcriptChars.toLocaleString()} chars · Video ID: {result.videoId}
                </p>
              </div>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-violet-400"
                style={{ borderColor: "var(--color-border)" }}
              >
                {copied ? <><Check className="w-3.5 h-3.5 text-violet-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 mt-3 border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
              {result.summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
