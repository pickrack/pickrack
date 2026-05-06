"use client";

import { useState } from "react";
import { Loader2, Copy, Check, Sparkles, AlertTriangle } from "lucide-react";

type Length = "short" | "medium" | "long";

const LENGTH_LABEL: Record<Length, { label: string; desc: string }> = {
  short: { label: "Short", desc: "2-3 sentences" },
  medium: { label: "Medium", desc: "4-6 sentences" },
  long: { label: "Long", desc: "8-12 bullets" },
};

const MAX_INPUT = 12_000;

export default function AISummarizerPage() {
  const [text, setText] = useState("");
  const [length, setLength] = useState<Length>("medium");
  const [summary, setSummary] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const summarize = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please paste some text to summarize.");
      return;
    }
    if (trimmed.length < 100) {
      setError("Text too short (minimum 100 characters).");
      return;
    }
    if (trimmed.length > MAX_INPUT) {
      setError(`Text too long (max ${MAX_INPUT.toLocaleString()} characters).`);
      return;
    }

    setProcessing(true);
    setError(null);
    setSummary(null);
    try {
      const res = await fetch("/api/ai/summarize/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, length }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }
      setSummary(data.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Summarization failed.");
    } finally {
      setProcessing(false);
    }
  };

  const copy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">AI Summarizer</h1>
        <p className="mt-3 text-gray-600">
          Summarize articles, documents, or notes with Claude Haiku 4.5. Free, no signup, daily quota of 10.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 flex items-start gap-3 text-sm text-violet-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-violet-600" />
        <div>
          <p className="font-medium">AI processing via Anthropic API</p>
          <p className="mt-1 text-violet-800">
            Your text is sent to Anthropic over HTTPS for Claude Haiku 4.5 processing. Anthropic does not use API inputs for training. Pickrack stores nothing.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Your text</label>
            <span className={`text-xs ${text.length > MAX_INPUT ? "text-red-600" : "text-gray-500"}`}>
              {text.length.toLocaleString()} / {MAX_INPUT.toLocaleString()}
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste an article, document, transcript, or notes (minimum 100 characters)…"
            spellCheck={false}
            className="w-full rounded-2xl border p-4 text-sm leading-relaxed h-[300px] focus:border-violet-500 focus:outline-none"
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
          disabled={processing || !text.trim() || text.length > MAX_INPUT}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 transition disabled:opacity-50"
        >
          {processing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Summarizing with Claude…</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Summarize</>
          )}
        </button>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
        )}

        {summary && (
          <div className="rounded-2xl border border-violet-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <h2 className="text-sm font-semibold flex items-center gap-1.5 text-gray-900">
                <Sparkles className="w-4 h-4 text-violet-600" /> Summary
              </h2>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-violet-400"
                style={{ borderColor: "var(--color-border)" }}
              >
                {copied ? <><Check className="w-3.5 h-3.5 text-violet-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{summary}</div>
          </div>
        )}
      </div>
    </div>
  );
}
