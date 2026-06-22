"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Loader2, Copy, Check, Download, Languages, AlertTriangle, FileText } from "lucide-react";
import { SUPPORTED_LANGUAGES, POPULAR_TARGETS } from "@/lib/translate-languages";

const MAX_BYTES = 20 * 1024 * 1024;
const MAX_CHARS = 50_000;

const ACCEPT = ".txt,.md,.html,.htm,.csv,.json,.xml,.pdf,text/plain,text/markdown,text/html,text/csv,application/json,application/pdf";

export default function TranslateDocumentPage() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [target, setTarget] = useState("vi");
  const [preserveFormat, setPreserveFormat] = useState(true);
  const [translation, setTranslation] = useState<string | null>(null);
  const [chunks, setChunks] = useState(0);
  const [extracting, setExtracting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pdfjsReady, setPdfjsReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        if (cancelled) return;
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        setPdfjsReady(true);
      } catch {
        /* user can still use text input even without pdf.js */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const extractPdf = async (file: File): Promise<string> => {
    if (!pdfjsReady) throw new Error("PDF reader is still loading. Try again in a moment.");
    const pdfjs = await import("pdfjs-dist");
    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    let out = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      out += content.items.map((it) => ("str" in it ? it.str : "")).filter(Boolean).join(" ");
      out += "\n\n";
      if (out.length > MAX_CHARS) {
        out = out.slice(0, MAX_CHARS);
        break;
      }
    }
    return out.trim();
  };

  const onFile = async (f: File | null) => {
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setError("File too large (max 20 MB).");
      return;
    }
    setError(null);
    setExtracting(true);
    setFileName(f.name);
    setTranslation(null);
    try {
      let content = "";
      if (f.name.toLowerCase().endsWith(".pdf") || f.type === "application/pdf") {
        content = await extractPdf(f);
      } else {
        content = await f.text();
      }
      if (content.length > MAX_CHARS) {
        content = content.slice(0, MAX_CHARS);
        setError(`File truncated to ${MAX_CHARS.toLocaleString()} characters. Translate in chunks for longer documents.`);
      }
      setText(content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read file.");
      setFileName(null);
    } finally {
      setExtracting(false);
    }
  };

  const translate = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Paste text or upload a file.");
      return;
    }
    if (trimmed.length > MAX_CHARS) {
      setError(`Text too long. Max ${MAX_CHARS.toLocaleString()} characters.`);
      return;
    }
    setProcessing(true);
    setError(null);
    setTranslation(null);
    try {
      const res = await fetch("/api/ai/translate-document/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, targetLang: target, preserveFormat }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      setTranslation(data.translation);
      setChunks(data.chunks ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Translation failed.");
    } finally {
      setProcessing(false);
    }
  };

  const copy = async () => {
    if (!translation) return;
    await navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTranslation = () => {
    if (!translation) return;
    const blob = new Blob([translation], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const base = fileName ? fileName.replace(/\.[^.]+$/, "") : "translation";
    a.download = `${base}-${target}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Translate Document</h1>
        <p className="mt-3 text-gray-600">
          Translate text, markdown, HTML, CSV, JSON, or PDF documents into 20 languages with Claude. Preserves formatting.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 flex items-start gap-3 text-sm text-violet-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-violet-600" />
        <div>
          <p className="font-medium">Daily quota: 5 documents/day per IP</p>
          <p className="mt-1 text-violet-800">
            Document translation chunks the input and runs multiple Claude passes — more expensive than text-only translation. PDF files are parsed in your browser; only extracted text is sent to Anthropic. Anthropic does not train on API inputs.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Source text</label>
            <span className={`text-xs ${text.length > MAX_CHARS ? "text-rose-600" : "text-gray-500"}`}>
              {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
          </div>

          <div
            className="rounded-2xl border-2 border-dashed bg-white p-3 mb-2 text-center hover:border-violet-400 transition cursor-pointer"
            style={{ borderColor: "var(--color-border)" }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onFile(e.dataTransfer.files?.[0] ?? null);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            {extracting ? (
              <p className="text-sm text-violet-700 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Reading {fileName}…
              </p>
            ) : fileName ? (
              <p className="text-sm text-gray-700 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4 text-violet-600" /> {fileName}{" "}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileName(null);
                    setText("");
                  }}
                  className="text-xs text-gray-500 hover:text-rose-600 underline"
                >
                  clear
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> Upload .txt / .md / .html / .csv / .json / .pdf — or paste below
              </p>
            )}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text here, or upload a file above…"
            spellCheck={false}
            className="w-full rounded-2xl border p-4 text-sm leading-relaxed h-[350px] font-mono focus:border-violet-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-violet-600" /> Translation
              {chunks > 1 && <span className="text-xs text-gray-500 font-normal">({chunks} chunks)</span>}
            </label>
            {translation && (
              <div className="flex gap-2">
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-violet-400"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {copied ? <><Check className="w-3.5 h-3.5 text-violet-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
                <button
                  onClick={downloadTranslation}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-violet-400"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <Download className="w-3.5 h-3.5" /> .txt
                </button>
              </div>
            )}
          </div>

          <div
            className="w-full rounded-2xl border bg-white p-4 text-sm leading-relaxed h-[350px] overflow-y-auto"
            style={{ borderColor: "var(--color-border)" }}
          >
            {processing ? (
              <p className="text-gray-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Translating…
              </p>
            ) : translation ? (
              <div className="whitespace-pre-wrap text-gray-800 font-mono">{translation}</div>
            ) : (
              <p className="text-gray-400">Translation will appear here.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-[1fr_auto] gap-3 items-end">
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Target language</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {POPULAR_TARGETS.map((code) => (
              <button
                key={code}
                onClick={() => setTarget(code)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                  target === code ? "border-violet-500 bg-violet-50 text-violet-700" : "bg-white text-gray-700 hover:border-violet-300"
                }`}
                style={{ borderColor: target === code ? undefined : "var(--color-border)" }}
              >
                {SUPPORTED_LANGUAGES[code]}
              </button>
            ))}
          </div>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm focus:border-violet-500 focus:outline-none bg-white"
            style={{ borderColor: "var(--color-border)" }}
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer pb-2">
          <input
            type="checkbox"
            checked={preserveFormat}
            onChange={(e) => setPreserveFormat(e.target.checked)}
            className="accent-violet-600 w-4 h-4"
          />
          Preserve markdown / HTML structure
        </label>
      </div>

      <button
        onClick={translate}
        disabled={processing || !text.trim() || text.length > MAX_CHARS}
        className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 transition disabled:opacity-50"
      >
        {processing ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Translating with Claude…</>
        ) : (
          <><Languages className="w-4 h-4" /> Translate to {SUPPORTED_LANGUAGES[target]}</>
        )}
      </button>

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}
    </div>
  );
}
