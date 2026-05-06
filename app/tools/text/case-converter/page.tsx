"use client";

import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

const SHORT_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "if", "in", "nor", "of",
  "on", "or", "so", "the", "to", "up", "yet",
]);

function smartTitleCase(s: string): string {
  return s.toLowerCase().replace(/\b[\p{L}']+\b/gu, (word, offset, full: string) => {
    if (offset === 0) return word.charAt(0).toLocaleUpperCase() + word.slice(1);
    if (SHORT_WORDS.has(word)) return word;
    // Last word should also be capitalized
    const tail = full.slice(offset + word.length);
    if (!/[\p{L}']/u.test(tail)) return word.charAt(0).toLocaleUpperCase() + word.slice(1);
    return word.charAt(0).toLocaleUpperCase() + word.slice(1);
  });
}

function sentenceCase(s: string): string {
  return s.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (m) => m.toLocaleUpperCase());
}

function camelCase(s: string): string {
  const words = s.match(/[\p{L}\p{N}]+/gu) || [];
  if (words.length === 0) return "";
  return words.map((w, i) => {
    const lower = w.toLowerCase();
    if (i === 0) return lower;
    return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
  }).join("");
}

function pascalCase(s: string): string {
  const words = s.match(/[\p{L}\p{N}]+/gu) || [];
  return words.map((w) => {
    const lower = w.toLowerCase();
    return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
  }).join("");
}

function snakeCase(s: string): string {
  return (s.match(/[\p{L}\p{N}]+/gu) || []).map((w) => w.toLowerCase()).join("_");
}

function kebabCase(s: string): string {
  return (s.match(/[\p{L}\p{N}]+/gu) || []).map((w) => w.toLowerCase()).join("-");
}

function constantCase(s: string): string {
  return (s.match(/[\p{L}\p{N}]+/gu) || []).map((w) => w.toUpperCase()).join("_");
}

const VARIANTS: { id: string; label: string; transform: (s: string) => string }[] = [
  { id: "upper", label: "UPPERCASE", transform: (s) => s.toLocaleUpperCase() },
  { id: "lower", label: "lowercase", transform: (s) => s.toLocaleLowerCase() },
  { id: "title", label: "Title Case (smart)", transform: smartTitleCase },
  { id: "sentence", label: "Sentence case", transform: sentenceCase },
  { id: "camel", label: "camelCase", transform: camelCase },
  { id: "pascal", label: "PascalCase", transform: pascalCase },
  { id: "snake", label: "snake_case", transform: snakeCase },
  { id: "kebab", label: "kebab-case", transform: kebabCase },
  { id: "constant", label: "CONSTANT_CASE", transform: constantCase },
];

export default function CaseConverterPage() {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog");
  const [copied, setCopied] = useState<string | null>(null);

  const variants = useMemo(() =>
    VARIANTS.map((v) => ({ ...v, output: text ? v.transform(text) : "" })),
    [text]
  );

  const copy = async (id: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Case Converter</h1>
        <p className="mt-3 text-gray-600">UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case — live.</p>
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-900 mb-2 block">Your text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste any text…"
          spellCheck={false}
          className="w-full rounded-2xl border p-4 text-sm h-[120px] focus:border-emerald-500 focus:outline-none"
          style={{ borderColor: "var(--color-border)" }}
        />
      </div>

      <div className="space-y-2">
        {variants.map((v) => (
          <div
            key={v.id}
            className="rounded-xl border bg-white p-4 flex items-start gap-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span className="font-mono text-xs font-semibold text-emerald-700 w-44 shrink-0 pt-0.5">{v.label}</span>
            <code className="font-mono text-sm text-gray-800 flex-1 break-all whitespace-pre-wrap">
              {v.output || <span className="text-gray-400 italic">…</span>}
            </code>
            <button
              onClick={() => copy(v.id, v.output)}
              disabled={!v.output}
              className="text-xs px-2.5 py-1 rounded-md border bg-white hover:border-emerald-400 inline-flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              style={{ borderColor: "var(--color-border)" }}
            >
              {copied === v.id ? <><Check className="w-3 h-3 text-emerald-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
