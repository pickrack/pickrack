"use client";

import { useState, useCallback, useEffect } from "react";
import { Copy, Check, RefreshCw, Download } from "lucide-react";

type Format = "standard" | "uppercase" | "no-hyphen" | "braced" | "urn";

const FORMAT_LABEL: Record<Format, string> = {
  standard: "Standard",
  uppercase: "UPPERCASE",
  "no-hyphen": "No hyphens",
  braced: "Braced {…}",
  urn: "URN urn:uuid:…",
};

function transformUUID(u: string, format: Format): string {
  switch (format) {
    case "uppercase": return u.toUpperCase();
    case "no-hyphen": return u.replace(/-/g, "");
    case "braced": return `{${u}}`;
    case "urn": return `urn:uuid:${u}`;
    case "standard":
    default:
      return u;
  }
}

export default function UUIDGeneratorPage() {
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState<Format>("standard");
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = useCallback(() => {
    if (typeof crypto.randomUUID !== "function") {
      setUuids(["Browser does not support crypto.randomUUID"]);
      return;
    }
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      out.push(crypto.randomUUID());
    }
    setUuids(out);
    setCopiedAll(false);
    setCopiedIdx(null);
  }, [count]);

  useEffect(() => {
    generate();
  }, [generate]);

  const transformed = uuids.map((u) => transformUUID(u, format));

  const copyOne = async (u: string, i: number) => {
    await navigator.clipboard.writeText(u);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(transformed.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const download = () => {
    const blob = new Blob([transformed.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuids-${count}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">UUID Generator</h1>
        <p className="mt-3 text-gray-600">Generate cryptographic UUID v4 — single or up to 1000 in bulk. crypto.randomUUID native.</p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4 space-y-4" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Count</label>
            <span className="text-sm font-bold text-blue-700">{count}</span>
          </div>
          <input
            type="range"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>100</span>
            <span>500</span>
            <span>1000</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Format</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(FORMAT_LABEL) as Format[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                  format === f ? "border-blue-500 bg-blue-50 text-blue-700" : "bg-white"
                }`}
                style={{ borderColor: format === f ? undefined : "var(--color-border)" }}
              >
                {FORMAT_LABEL[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition"
          >
            <RefreshCw className="w-4 h-4" /> Regenerate
          </button>
          {transformed.length > 1 && (
            <>
              <button
                onClick={copyAll}
                className="inline-flex items-center gap-1.5 rounded-xl border bg-white px-4 py-2 text-sm font-medium hover:border-blue-400"
                style={{ borderColor: "var(--color-border)" }}
              >
                {copiedAll ? <><Check className="w-4 h-4 text-blue-600" /> Copied all</> : <><Copy className="w-4 h-4" /> Copy all</>}
              </button>
              <button
                onClick={download}
                className="inline-flex items-center gap-1.5 rounded-xl border bg-white px-4 py-2 text-sm font-medium hover:border-blue-400"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Download className="w-4 h-4" /> Download .txt
              </button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-3 max-h-[500px] overflow-auto" style={{ borderColor: "var(--color-border)" }}>
        {transformed.map((u, i) => (
          <div key={i} className="flex items-center justify-between gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-md">
            <code className="font-mono text-xs sm:text-sm text-gray-700 break-all">{u}</code>
            <button
              onClick={() => copyOne(u, i)}
              className="text-gray-400 hover:text-blue-600 shrink-0"
              aria-label="Copy"
            >
              {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
