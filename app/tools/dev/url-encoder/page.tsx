"use client";

import { useState, useMemo } from "react";
import { Copy, Check, ArrowDownUp } from "lucide-react";

type Mode = "encode" | "decode";
type Method = "component" | "uri";

function encode(input: string, method: Method): string {
  if (!input) return "";
  try {
    return method === "component" ? encodeURIComponent(input) : encodeURI(input);
  } catch {
    return "";
  }
}

function decode(input: string, method: Method): { ok: true; out: string } | { ok: false; err: string } {
  if (!input) return { ok: true, out: "" };
  try {
    const fn = method === "component" ? decodeURIComponent : decodeURI;
    return { ok: true, out: fn(input) };
  } catch (e) {
    return { ok: false, err: e instanceof Error ? e.message : "Invalid encoded string" };
  }
}

export default function UrlEncoderPage() {
  const [mode, setMode] = useState<Mode>("encode");
  const [method, setMethod] = useState<Method>("component");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (mode === "encode") return { ok: true as const, out: encode(input, method) };
    return decode(input, method);
  }, [input, mode, method]);

  const copy = async () => {
    if (!result.ok || !result.out) return;
    await navigator.clipboard.writeText(result.out);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    if (result.ok && result.out) {
      setInput(result.out);
      setMode(mode === "encode" ? "decode" : "encode");
    } else {
      setMode(mode === "encode" ? "decode" : "encode");
    }
  };

  const inputLen = input.length;
  const outputLen = result.ok ? result.out.length : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">URL Encoder / Decoder</h1>
        <p className="mt-3 text-gray-600">
          Percent-encode URL parameters or decode them. <code>encodeURIComponent</code> or <code>encodeURI</code> behavior. Browser-side, instant.
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

          <div className="inline-flex rounded-lg border p-1 bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
            <button
              onClick={() => setMethod("component")}
              className={`px-3 py-1.5 text-xs font-medium rounded ${method === "component" ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
              title="Encodes reserved chars (= & ? # /) — for individual query values"
            >
              encodeURIComponent
            </button>
            <button
              onClick={() => setMethod("uri")}
              className={`px-3 py-1.5 text-xs font-medium rounded ${method === "uri" ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
              title="Preserves reserved chars (= & ? # /) — for whole URLs"
            >
              encodeURI
            </button>
          </div>

          <button
            onClick={swap}
            className="ml-auto inline-flex items-center gap-1.5 text-sm border rounded-lg px-3 py-1.5 hover:bg-gray-50"
            style={{ borderColor: "var(--color-border)" }}
            title="Swap input ↔ output"
          >
            <ArrowDownUp className="w-4 h-4" /> Swap
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Input</label>
            <span className="text-xs text-gray-500">{inputLen} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "https://example.com/page?q=hello world" : "https%3A%2F%2Fexample.com%2Fpage%3Fq%3Dhello%20world"}
            className="w-full h-64 rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Output</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{outputLen} chars</span>
              <button
                onClick={copy}
                disabled={!result.ok || !result.out}
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          {result.ok ? (
            <textarea
              value={result.out}
              readOnly
              placeholder="Output will appear here"
              className="w-full h-64 rounded-lg border px-3 py-2 font-mono text-sm bg-gray-50 resize-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          ) : (
            <div className="h-64 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 overflow-auto">
              <p className="font-semibold mb-1">Decode error</p>
              <p className="font-mono text-xs">{result.err}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
