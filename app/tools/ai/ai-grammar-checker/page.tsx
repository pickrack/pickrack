"use client";

import { useState } from "react";
import { Loader2, Copy, Check, SpellCheck, AlertTriangle } from "lucide-react";

const MAX_INPUT = 6_000;

type Issue = {
  original: string;
  fix: string;
  reason: string;
};

type GrammarResult = {
  corrected: string;
  issues: Issue[];
  warning?: string;
};

export default function AIGrammarCheckerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const check = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please paste some text to check.");
      return;
    }
    if (trimmed.length > MAX_INPUT) {
      setError(`Text too long (max ${MAX_INPUT.toLocaleString()} characters).`);
      return;
    }

    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai/grammar/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Grammar check failed.");
    } finally {
      setProcessing(false);
    }
  };

  const copy = async () => {
    if (!result?.corrected) return;
    await navigator.clipboard.writeText(result.corrected);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const noIssues = result && result.issues.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">AI Grammar Checker</h1>
        <p className="mt-3 text-gray-600">
          Fix grammar, spelling, and punctuation without changing your voice. Powered by Claude Haiku 4.5.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 flex items-start gap-3 text-sm text-violet-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-violet-600" />
        <div>
          <p className="font-medium">Voice-preserving — won&apos;t suggest style changes</p>
          <p className="mt-1 text-violet-800">
            Only fixes objective errors (grammar, spelling, punctuation). Style preferences (Oxford comma, word choice) are left alone. Daily quota: 10/IP.
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
            placeholder="Paste your draft, email, essay, or message…"
            spellCheck={false}
            className="w-full rounded-2xl border p-4 text-sm leading-relaxed h-[300px] focus:border-violet-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <button
          onClick={check}
          disabled={processing || !text.trim() || text.length > MAX_INPUT}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 transition disabled:opacity-50"
        >
          {processing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Checking with Claude…</>
          ) : (
            <><SpellCheck className="w-4 h-4" /> Check grammar</>
          )}
        </button>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
        )}

        {result && (
          <>
            <div className="rounded-2xl border border-violet-200 bg-white p-5">
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <h2 className="text-sm font-semibold flex items-center gap-1.5 text-gray-900">
                  <SpellCheck className="w-4 h-4 text-violet-600" /> Corrected text
                  {noIssues && <span className="text-xs font-normal text-emerald-600 ml-2">No issues found</span>}
                </h2>
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-violet-400"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {copied ? <><Check className="w-3.5 h-3.5 text-violet-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{result.corrected}</div>
            </div>

            {result.warning && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                {result.warning}
              </p>
            )}

            {result.issues.length > 0 && (
              <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {result.issues.length} issue{result.issues.length === 1 ? "" : "s"} found
                </h3>
                <ul className="space-y-3">
                  {result.issues.map((issue, i) => (
                    <li key={i} className="rounded-xl border bg-gray-50 p-3 text-sm" style={{ borderColor: "var(--color-border)" }}>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="line-through text-red-600">{issue.original}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-emerald-700 font-semibold">{issue.fix}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{issue.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
