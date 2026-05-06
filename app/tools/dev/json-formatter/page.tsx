"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Trash2 } from "lucide-react";

type IndentMode = "2" | "4" | "tab" | "minify";

const SAMPLE = `{"name":"Pickrack","tools":["pdf","image","ai"],"created":2026,"meta":{"free":true,"signup":false}}`;

export default function JSONFormatterPage() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<IndentMode>("2");
  const [sortKeys, setSortKeys] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) {
      return { ok: true as const, output: "", error: null as string | null };
    }
    try {
      const parsed = JSON.parse(input);
      const sortedParsed = sortKeys ? sortObject(parsed) : parsed;
      let output = "";
      if (indent === "minify") {
        output = JSON.stringify(sortedParsed);
      } else if (indent === "tab") {
        output = JSON.stringify(sortedParsed, null, "\t");
      } else {
        output = JSON.stringify(sortedParsed, null, parseInt(indent, 10));
      }
      return { ok: true as const, output, error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false as const, output: "", error: msg };
    }
  }, [input, indent, sortKeys]);

  const copy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">JSON Formatter</h1>
        <p className="mt-3 text-gray-600">
          Format, validate, minify JSON instantly. Browser-side, your data never leaves your tab.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Input JSON</label>
            <div className="flex gap-2">
              <button
                onClick={() => setInput(SAMPLE)}
                className="text-xs text-gray-500 hover:text-emerald-600"
              >
                Sample
              </button>
              <button
                onClick={() => setInput("")}
                className="text-xs text-gray-500 hover:text-red-600 inline-flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here…"
            spellCheck={false}
            className="w-full rounded-xl border p-4 font-mono text-xs h-[500px] focus:border-emerald-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <label className="text-sm font-semibold text-gray-900">Output</label>
            {result.ok && result.output && (
              <button
                onClick={copy}
                className="text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-emerald-400 inline-flex items-center gap-1.5"
                style={{ borderColor: "var(--color-border)" }}
              >
                {copied ? <><Check className="w-3 h-3 text-emerald-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            )}
          </div>
          {result.ok ? (
            <pre className="w-full rounded-xl border p-4 font-mono text-xs h-[500px] overflow-auto bg-gray-50 text-gray-800" style={{ borderColor: "var(--color-border)" }}>
              {result.output || <span className="text-gray-400 italic">Output will appear here…</span>}
            </pre>
          ) : (
            <div className="w-full rounded-xl border border-red-200 bg-red-50 p-4 h-[500px] overflow-auto">
              <p className="text-xs font-semibold text-red-900 mb-1">Invalid JSON</p>
              <p className="text-xs font-mono text-red-700">{result.error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Indentation</label>
          <div className="flex gap-2 flex-wrap">
            {(["2", "4", "tab", "minify"] as IndentMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setIndent(m)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                  indent === m ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "bg-white"
                }`}
                style={{ borderColor: indent === m ? undefined : "var(--color-border)" }}
              >
                {m === "2" ? "2 spaces" : m === "4" ? "4 spaces" : m === "tab" ? "Tab" : "Minify"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="accent-emerald-600"
            />
            <span className="font-semibold text-gray-900">Sort keys alphabetically</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">Useful for diffing two JSON objects.</p>
        </div>
      </div>
    </div>
  );
}

function sortObject(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObject);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((out, k) => {
        out[k] = sortObject((obj as Record<string, unknown>)[k]);
        return out;
      }, {});
  }
  return obj;
}
