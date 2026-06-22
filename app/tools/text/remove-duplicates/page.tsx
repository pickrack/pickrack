"use client";

import { useState, useMemo } from "react";
import { Filter, Copy, Check, ArrowDownUp } from "lucide-react";

function dedupe(input: string, caseInsensitive: boolean, trimWhitespace: boolean, keepFirst: boolean, ignoreBlanks: boolean): {
  out: string; inputCount: number; outputCount: number; duplicates: number;
} {
  const lines = input.split(/\r?\n/);
  const seen = new Set<string>();
  const out: string[] = [];

  // If !keepFirst, we want to keep LAST occurrence. Traverse in reverse, then re-reverse the kept lines.
  const iterator = keepFirst ? lines.entries() : Array.from(lines.entries()).reverse();
  const kept: Array<{ idx: number; value: string }> = [];

  for (const [idx, original] of iterator) {
    const cleaned = trimWhitespace ? original.trim() : original;
    if (ignoreBlanks && cleaned.length === 0) continue;
    const key = caseInsensitive ? cleaned.toLowerCase() : cleaned;
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push({ idx, value: original });
  }

  // Restore original order if we processed in reverse
  if (!keepFirst) kept.reverse();
  for (const k of kept) out.push(k.value);

  return {
    out: out.join("\n"),
    inputCount: lines.length,
    outputCount: out.length,
    duplicates: lines.length - out.length - (ignoreBlanks ? lines.filter((l) => l.trim().length === 0).length - 0 : 0),
  };
}

export default function RemoveDuplicatesPage() {
  const [input, setInput] = useState("");
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [keepFirst, setKeepFirst] = useState(true);
  const [ignoreBlanks, setIgnoreBlanks] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => dedupe(input, caseInsensitive, trimWhitespace, keepFirst, ignoreBlanks),
    [input, caseInsensitive, trimWhitespace, keepFirst, ignoreBlanks],
  );

  const copy = async () => {
    if (!result.out) return;
    await navigator.clipboard.writeText(result.out);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Filter className="w-7 h-7 text-indigo-600" /> Remove Duplicate Lines
        </h1>
        <p className="mt-3 text-gray-600">
          Dedupe lines while preserving order. Configurable case-sensitivity, whitespace trimming, keep-first vs keep-last.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex flex-wrap items-center gap-4">
          <Checkbox checked={caseInsensitive} onChange={setCaseInsensitive} label="Case-insensitive" hint="'apple' = 'Apple' = 'APPLE'" />
          <Checkbox checked={trimWhitespace} onChange={setTrimWhitespace} label="Trim whitespace" hint="ignore leading/trailing spaces" />
          <Checkbox checked={ignoreBlanks} onChange={setIgnoreBlanks} label="Drop blank lines" />
          <div className="inline-flex rounded-lg border p-1 bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
            <button
              onClick={() => setKeepFirst(true)}
              className={`px-3 py-1 text-xs font-medium rounded ${keepFirst ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
            >
              Keep first
            </button>
            <button
              onClick={() => setKeepFirst(false)}
              className={`px-3 py-1 text-xs font-medium rounded ${!keepFirst ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
            >
              Keep last
            </button>
          </div>
        </div>
        {input && (
          <div className="mt-3 pt-3 border-t flex flex-wrap items-center gap-4 text-xs text-gray-600" style={{ borderColor: "var(--color-border)" }}>
            <span><strong className="text-gray-900">{result.inputCount.toLocaleString()}</strong> input lines</span>
            <span><strong className="text-emerald-700">{result.outputCount.toLocaleString()}</strong> unique</span>
            <span><strong className="text-amber-700">{(result.inputCount - result.outputCount).toLocaleString()}</strong> removed</span>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="One item per line — emails, URLs, names, anything..."
            className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)" }}
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Deduplicated</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setInput(result.out)} className="inline-flex items-center gap-1 text-xs text-indigo-700">
                <ArrowDownUp className="w-3 h-3" /> Swap in
              </button>
              <button onClick={copy} disabled={!result.out} className="inline-flex items-center gap-1 text-xs text-indigo-700 disabled:opacity-50">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <textarea
            value={result.out}
            readOnly
            className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-sm bg-gray-50 resize-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer" title={hint}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-indigo-600" />
      {label}
    </label>
  );
}
