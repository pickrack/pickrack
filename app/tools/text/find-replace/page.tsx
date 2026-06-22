"use client";

import { useState, useMemo } from "react";
import { Search, Copy, Check, RotateCcw, ArrowDownUp } from "lucide-react";

export default function FindReplacePage() {
  const [input, setInput] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [multiline, setMultiline] = useState(false);
  const [global, setGlobal] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo<{ ok: true; out: string; matches: number } | { ok: false; err: string }>(() => {
    if (!find) return { ok: true, out: input, matches: 0 };
    try {
      const pattern = useRegex
        ? find
        : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const flags =
        (global ? "g" : "") +
        (!caseSensitive ? "i" : "") +
        (multiline ? "m" : "");
      const re = new RegExp(pattern, flags);
      const matches = input.match(re);
      const count = matches ? matches.length : 0;
      const out = input.replace(re, replace);
      return { ok: true, out, matches: count };
    } catch (e) {
      return { ok: false, err: e instanceof Error ? e.message : "Invalid pattern" };
    }
  }, [input, find, replace, useRegex, caseSensitive, multiline, global]);

  const copy = async () => {
    if (!result.ok) return;
    await navigator.clipboard.writeText(result.out);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => {
    setInput("");
    setFind("");
    setReplace("");
  };

  const swap = () => {
    if (result.ok) setInput(result.out);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Search className="w-7 h-7 text-indigo-600" /> Find &amp; Replace
        </h1>
        <p className="mt-3 text-gray-600">
          Find and replace text with regex + capture groups. Live preview, match count, browser-side.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4 space-y-3" style={{ borderColor: "var(--color-border)" }}>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Find</label>
            <input
              type="text"
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder={useRegex ? "\\b(error|warning)\\b" : "search for"}
              className="w-full rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Replace {useRegex && <span className="text-gray-500 font-normal">(use $1 $2 for capture groups)</span>}
            </label>
            <input
              type="text"
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder={useRegex ? "[$1]" : "replace with"}
              className="w-full rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Checkbox checked={useRegex} onChange={setUseRegex} label="Regex" hint="treat 'Find' as a regular expression" />
          <Checkbox checked={caseSensitive} onChange={setCaseSensitive} label="Case-sensitive" />
          <Checkbox checked={global} onChange={setGlobal} label="Replace all" hint="otherwise replace only first match" />
          <Checkbox checked={multiline} onChange={setMultiline} label="Multiline" hint="^ and $ match line boundaries" />
        </div>

        {!result.ok && (
          <p className="text-xs text-red-600 font-mono">⚠ {result.err}</p>
        )}
        {result.ok && find && (
          <p className="text-xs text-gray-600">
            {result.matches > 0 ? (
              <><strong className="text-indigo-700">{result.matches}</strong> match{result.matches === 1 ? "" : "es"} replaced</>
            ) : (
              "No matches found"
            )}
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Input</label>
            <span className="text-xs text-gray-500">{input.length.toLocaleString()} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)" }}
            spellCheck={false}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Output</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{result.ok ? result.out.length.toLocaleString() : 0} chars</span>
              <button onClick={swap} disabled={!result.ok} className="inline-flex items-center gap-1 text-xs text-indigo-700 disabled:opacity-50" title="Move output to input">
                <ArrowDownUp className="w-3 h-3" /> Swap in
              </button>
              <button onClick={copy} disabled={!result.ok || !result.out} className="inline-flex items-center gap-1 text-xs text-indigo-700 disabled:opacity-50">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={reset} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
          <textarea
            value={result.ok ? result.out : ""}
            readOnly
            placeholder="Result will appear here"
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
