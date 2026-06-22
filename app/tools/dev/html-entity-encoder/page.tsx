"use client";

import { useState, useMemo } from "react";
import { Copy, Check, ArrowDownUp } from "lucide-react";

type Mode = "encode" | "decode";
type Style = "named" | "numeric" | "all";

const NAMED_TO_CHAR: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  copy: "©", reg: "®", trade: "™", hellip: "…", mdash: "—", ndash: "–",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", laquo: "«", raquo: "»",
  iexcl: "¡", iquest: "¿", deg: "°", plusmn: "±", para: "¶", sect: "§",
  cent: "¢", pound: "£", yen: "¥", euro: "€", times: "×", divide: "÷",
  bull: "•", middot: "·", larr: "←", rarr: "→", uarr: "↑", darr: "↓",
};

const CHAR_TO_NAMED: Record<string, string> = Object.fromEntries(
  Object.entries(NAMED_TO_CHAR).map(([k, v]) => [v, k]),
);

const BASIC_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function encodeEntities(input: string, style: Style): string {
  if (!input) return "";
  return Array.from(input).map((ch) => {
    if (BASIC_ESCAPE[ch] && style === "named") return BASIC_ESCAPE[ch];
    if (BASIC_ESCAPE[ch] && style === "all") return BASIC_ESCAPE[ch];
    const code = ch.codePointAt(0);
    if (code === undefined) return ch;
    if (style === "numeric") {
      if (code < 32 || code === 60 || code === 62 || code === 38 || code === 34 || code === 39 || code > 126) {
        return `&#${code};`;
      }
      return ch;
    }
    if (style === "all") {
      if (code > 127) {
        return CHAR_TO_NAMED[ch] ? `&${CHAR_TO_NAMED[ch]};` : `&#${code};`;
      }
      return ch;
    }
    // named
    if (code > 127) {
      return CHAR_TO_NAMED[ch] ? `&${CHAR_TO_NAMED[ch]};` : `&#${code};`;
    }
    return ch;
  }).join("");
}

function decodeEntities(input: string): string {
  if (!input) return "";
  return input.replace(/&(#x?)?([0-9a-fA-F]+|[a-zA-Z]+);/g, (match, prefix, value) => {
    if (prefix === "#") {
      const n = parseInt(value, 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    if (prefix === "#x") {
      const n = parseInt(value, 16);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    const named = NAMED_TO_CHAR[value];
    return named ?? match;
  });
}

export default function HtmlEntityPage() {
  const [mode, setMode] = useState<Mode>("encode");
  const [style, setStyle] = useState<Style>("named");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(
    () => (mode === "encode" ? encodeEntities(input, style) : decodeEntities(input)),
    [input, mode, style],
  );

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    setInput(output);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">HTML Entity Encoder / Decoder</h1>
        <p className="mt-3 text-gray-600">
          Escape HTML special chars (<code>&lt;</code>, <code>&gt;</code>, <code>&amp;</code>...) or decode back. Named, numeric, or all-non-ASCII modes.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border p-1 bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
            <button
              onClick={() => setMode("encode")}
              className={`px-3 py-1.5 text-sm font-medium rounded ${mode === "encode" ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-3 py-1.5 text-sm font-medium rounded ${mode === "decode" ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
            >
              Decode
            </button>
          </div>

          {mode === "encode" && (
            <div className="inline-flex rounded-lg border p-1 bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
              {(["named", "numeric", "all"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded capitalize ${style === s ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
                  title={s === "named" ? "Named entities where possible (&amp;)" : s === "numeric" ? "Numeric entities only (&#38;)" : "Force non-ASCII to entities, named where possible"}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={swap}
            className="ml-auto inline-flex items-center gap-1.5 text-sm border rounded-lg px-3 py-1.5 hover:bg-gray-50"
            style={{ borderColor: "var(--color-border)" }}
          >
            <ArrowDownUp className="w-4 h-4" /> Swap
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Input</label>
            <span className="text-xs text-gray-500">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "<script>alert('hi')</script>" : "&lt;script&gt;alert('hi')&lt;/script&gt;"}
            className="w-full h-64 rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Output</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{output.length} chars</span>
              <button
                onClick={copy}
                disabled={!output}
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Output will appear here"
            className="w-full h-64 rounded-lg border px-3 py-2 font-mono text-sm bg-gray-50 resize-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>
      </div>
    </div>
  );
}
