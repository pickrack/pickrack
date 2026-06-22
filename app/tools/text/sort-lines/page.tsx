"use client";

import { useState, useMemo } from "react";
import { ArrowDownAZ, Copy, Check, ArrowDownUp } from "lucide-react";

type SortMode = "alpha-asc" | "alpha-desc" | "numeric-asc" | "numeric-desc" | "length-asc" | "length-desc" | "reverse" | "shuffle" | "natural";

const MODES: { id: SortMode; label: string; desc: string }[] = [
  { id: "alpha-asc",  label: "A → Z",         desc: "Alphabetical ascending" },
  { id: "alpha-desc", label: "Z → A",         desc: "Alphabetical descending" },
  { id: "natural",    label: "Natural",       desc: "file1, file2, file10 (not file1, file10, file2)" },
  { id: "numeric-asc",  label: "0 → 9",       desc: "Numeric ascending" },
  { id: "numeric-desc", label: "9 → 0",       desc: "Numeric descending" },
  { id: "length-asc",  label: "Short → long", desc: "By line length ascending" },
  { id: "length-desc", label: "Long → short", desc: "By line length descending" },
  { id: "reverse",     label: "Reverse",      desc: "Flip order (no sort)" },
  { id: "shuffle",     label: "Shuffle",      desc: "Random order" },
];

function sortLines(input: string, mode: SortMode, caseInsensitive: boolean, dedupAfter: boolean, ignoreBlanks: boolean): string {
  let lines = input.split(/\r?\n/);
  if (ignoreBlanks) lines = lines.filter((l) => l.trim().length > 0);

  switch (mode) {
    case "alpha-asc":
      lines.sort((a, b) => (caseInsensitive ? a.toLowerCase().localeCompare(b.toLowerCase()) : a.localeCompare(b)));
      break;
    case "alpha-desc":
      lines.sort((a, b) => (caseInsensitive ? b.toLowerCase().localeCompare(a.toLowerCase()) : b.localeCompare(a)));
      break;
    case "natural":
      lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: caseInsensitive ? "base" : "variant" }));
      break;
    case "numeric-asc":
      lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
      break;
    case "numeric-desc":
      lines.sort((a, b) => (parseFloat(b) || 0) - (parseFloat(a) || 0));
      break;
    case "length-asc":
      lines.sort((a, b) => a.length - b.length);
      break;
    case "length-desc":
      lines.sort((a, b) => b.length - a.length);
      break;
    case "reverse":
      lines.reverse();
      break;
    case "shuffle":
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      break;
  }

  if (dedupAfter) {
    const seen = new Set<string>();
    lines = lines.filter((l) => {
      const key = caseInsensitive ? l.toLowerCase() : l;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return lines.join("\n");
}

export default function SortLinesPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<SortMode>("alpha-asc");
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [dedupAfter, setDedupAfter] = useState(false);
  const [ignoreBlanks, setIgnoreBlanks] = useState(false);
  const [copied, setCopied] = useState(false);

  const out = useMemo(
    () => sortLines(input, mode, caseInsensitive, dedupAfter, ignoreBlanks),
    [input, mode, caseInsensitive, dedupAfter, ignoreBlanks],
  );
  const inputLines = input.split(/\r?\n/).length;
  const outLines = out.split(/\r?\n/).length;
  const removedCount = inputLines - outLines;

  const copy = async () => {
    if (!out) return;
    await navigator.clipboard.writeText(out);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <ArrowDownAZ className="w-7 h-7 text-indigo-600" /> Sort Lines
        </h1>
        <p className="mt-3 text-gray-600">
          Sort text lines alphabetically, numerically, by length, naturally, or shuffle. Optional dedup + blank-line filter.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4 space-y-3" style={{ borderColor: "var(--color-border)" }}>
        <label className="text-xs font-medium text-gray-700 mb-1 block">Sort mode</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              title={m.desc}
              className={`p-2 rounded-lg border text-xs font-medium transition ${
                mode === m.id ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-white"
              }`}
              style={{ borderColor: mode === m.id ? undefined : "var(--color-border)" }}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Checkbox checked={caseInsensitive} onChange={setCaseInsensitive} label="Case-insensitive" />
          <Checkbox checked={dedupAfter} onChange={setDedupAfter} label="Remove duplicates" />
          <Checkbox checked={ignoreBlanks} onChange={setIgnoreBlanks} label="Remove blank lines" />
        </div>
        {input && (
          <p className="text-xs text-gray-600">
            Input <strong>{inputLines}</strong> lines → Output <strong>{outLines}</strong> lines
            {removedCount > 0 && <span className="text-amber-700 ml-1">({removedCount} removed)</span>}
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste lines here, one per line..."
            className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)" }}
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Sorted</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setInput(out)} className="inline-flex items-center gap-1 text-xs text-indigo-700">
                <ArrowDownUp className="w-3 h-3" /> Swap in
              </button>
              <button onClick={copy} disabled={!out} className="inline-flex items-center gap-1 text-xs text-indigo-700 disabled:opacity-50">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <textarea
            value={out}
            readOnly
            className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-sm bg-gray-50 resize-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-indigo-600" />
      {label}
    </label>
  );
}
