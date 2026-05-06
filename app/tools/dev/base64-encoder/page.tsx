"use client";

import { useState, useMemo } from "react";
import { Copy, Check, ArrowDownUp } from "lucide-react";

type Mode = "encode" | "decode";

function utf8ToBase64(str: string, urlSafe: boolean): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const std = btoa(binary);
    return urlSafe ? std.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : std;
  } catch {
    return "";
  }
}

function base64ToUtf8(str: string, urlSafe: boolean): { ok: true; out: string } | { ok: false; err: string } {
  try {
    let normalized = str.trim();
    if (urlSafe) {
      normalized = normalized.replace(/-/g, "+").replace(/_/g, "/");
      while (normalized.length % 4) normalized += "=";
    }
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return { ok: true, out: new TextDecoder("utf-8", { fatal: false }).decode(bytes) };
  } catch (e) {
    return { ok: false, err: e instanceof Error ? e.message : "Invalid Base64" };
  }
}

export default function Base64Page() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input) return { ok: true as const, out: "", err: null };
    if (mode === "encode") {
      return { ok: true as const, out: utf8ToBase64(input, urlSafe), err: null };
    }
    const dec = base64ToUtf8(input, urlSafe);
    if (dec.ok) return { ok: true as const, out: dec.out, err: null };
    return { ok: false as const, out: "", err: dec.err };
  }, [input, mode, urlSafe]);

  const copy = async () => {
    if (!result.out) return;
    await navigator.clipboard.writeText(result.out);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swap = () => {
    if (!result.ok || !result.out) return;
    setInput(result.out);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Base64 Encoder & Decoder</h1>
        <p className="mt-3 text-gray-600">Encode text to Base64 or decode back. Browser-side, no upload.</p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="inline-flex rounded-lg border bg-gray-50 p-1" style={{ borderColor: "var(--color-border)" }}>
            {(["encode", "decode"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  mode === m ? "bg-white text-blue-700 shadow-sm" : "text-gray-600"
                }`}
              >
                {m === "encode" ? "Encode" : "Decode"}
              </button>
            ))}
          </div>
          <label className="ml-auto inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="accent-blue-600" />
            URL-safe (- _ instead of + /)
          </label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">
            {mode === "encode" ? "Plain text" : "Base64"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Type any text…" : "Paste Base64…"}
            spellCheck={false}
            className="w-full rounded-2xl border p-4 font-mono text-xs h-[400px] focus:border-blue-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
            <label className="text-sm font-semibold text-gray-900">
              {mode === "encode" ? "Base64" : "Plain text"}
            </label>
            <div className="flex gap-2">
              <button
                onClick={swap}
                disabled={!result.ok || !result.out}
                className="text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-blue-400 inline-flex items-center gap-1.5 disabled:opacity-50"
                style={{ borderColor: "var(--color-border)" }}
                title="Use this output as next input (swap mode)"
              >
                <ArrowDownUp className="w-3 h-3" /> Swap
              </button>
              {result.ok && result.out && (
                <button
                  onClick={copy}
                  className="text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-blue-400 inline-flex items-center gap-1.5"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {copied ? <><Check className="w-3 h-3 text-blue-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
              )}
            </div>
          </div>
          {result.ok ? (
            <pre
              className="w-full rounded-2xl border p-4 font-mono text-xs h-[400px] overflow-auto bg-gray-50 text-gray-800 whitespace-pre-wrap break-all"
              style={{ borderColor: "var(--color-border)" }}
            >
              {result.out || <span className="text-gray-400 italic">Output will appear here…</span>}
            </pre>
          ) : (
            <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-4 h-[400px]">
              <p className="text-xs font-semibold text-red-900 mb-1">Decode failed</p>
              <p className="text-xs font-mono text-red-700">{result.err}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
