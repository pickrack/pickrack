"use client";

import { useState, useMemo } from "react";
import yaml from "js-yaml";
import { Copy, Check, ArrowLeftRight, Play } from "lucide-react";

type Direction = "yaml-to-json" | "json-to-yaml";

const YAML_SAMPLE = `# Pickrack config example
site:
  name: Pickrack
  url: https://pickrack.com
  tags:
    - free
    - browser-side
    - no-tracker
features:
  pdf: 17
  image: 8
  ai: 6
launch_year: 2026
adsense_enabled: true
`;

const JSON_SAMPLE = JSON.stringify({
  site: { name: "Pickrack", url: "https://pickrack.com", tags: ["free", "browser-side", "no-tracker"] },
  features: { pdf: 17, image: 8, ai: 6 },
  launch_year: 2026,
  adsense_enabled: true,
}, null, 2);

export default function YamlJsonConverterPage() {
  const [direction, setDirection] = useState<Direction>("yaml-to-json");
  const [input, setInput] = useState(YAML_SAMPLE);
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const result = useMemo<{ ok: true; out: string } | { ok: false; err: string }>(() => {
    if (!input.trim()) return { ok: true, out: "" };
    try {
      if (direction === "yaml-to-json") {
        const obj = yaml.load(input);
        return { ok: true, out: JSON.stringify(obj, null, indent) };
      }
      const obj = JSON.parse(input);
      return {
        ok: true,
        out: yaml.dump(obj, { indent, lineWidth: -1, noRefs: true, sortKeys: false }),
      };
    } catch (e) {
      return { ok: false, err: e instanceof Error ? e.message : "Parse failed" };
    }
  }, [input, direction, indent]);

  const copy = async () => {
    if (!result.ok || !result.out) return;
    await navigator.clipboard.writeText(result.out);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swapDirection = () => {
    setDirection(direction === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json");
    if (result.ok && result.out) setInput(result.out);
  };

  const loadSample = () => {
    setInput(direction === "yaml-to-json" ? YAML_SAMPLE : JSON_SAMPLE);
  };

  const inputLabel = direction === "yaml-to-json" ? "YAML" : "JSON";
  const outputLabel = direction === "yaml-to-json" ? "JSON" : "YAML";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">YAML ↔ JSON Converter</h1>
        <p className="mt-3 text-gray-600">
          Convert YAML to JSON or JSON to YAML. Browser-side, instant, with inline error reporting.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border p-1 bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
            <button
              onClick={() => setDirection("yaml-to-json")}
              className={`px-3 py-1.5 text-sm font-medium rounded ${direction === "yaml-to-json" ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
            >
              YAML → JSON
            </button>
            <button
              onClick={() => setDirection("json-to-yaml")}
              className={`px-3 py-1.5 text-sm font-medium rounded ${direction === "json-to-yaml" ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
            >
              JSON → YAML
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-xs font-medium text-gray-700">Indent</span>
            <select
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value, 10))}
              className="rounded-lg border px-2 py-1 text-sm bg-white"
              style={{ borderColor: "var(--color-border)" }}
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>

          <button
            onClick={swapDirection}
            className="ml-auto inline-flex items-center gap-1.5 text-sm border rounded-lg px-3 py-1.5 hover:bg-gray-50"
            style={{ borderColor: "var(--color-border)" }}
          >
            <ArrowLeftRight className="w-4 h-4" /> Swap
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Input {inputLabel}</label>
            <button
              onClick={loadSample}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700"
            >
              <Play className="w-3.5 h-3.5" /> Load sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={direction === "yaml-to-json" ? "key: value\nlist:\n  - one\n  - two" : '{ "key": "value" }'}
            className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)" }}
            spellCheck={false}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Output {outputLabel}</label>
            <button
              onClick={copy}
              disabled={!result.ok || !result.out}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          {result.ok ? (
            <textarea
              value={result.out}
              readOnly
              placeholder="Output will appear here"
              className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-sm bg-gray-50 resize-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          ) : (
            <div className="h-96 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 overflow-auto">
              <p className="font-semibold mb-1">Parse error</p>
              <pre className="font-mono text-xs whitespace-pre-wrap">{result.err}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
