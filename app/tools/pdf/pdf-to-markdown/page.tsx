"use client";

import { useState, useCallback } from "react";
import { Loader2, Download, Copy, CheckCircle2, FileCode, AlertTriangle } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

export default function PDFtoMarkdownPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [content, setContent] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setContent(null);
    setError(null);
  }, []);

  const extract = async () => {
    if (files.length === 0) {
      setError("Please select a PDF.");
      return;
    }
    setProcessing(true);
    setError(null);
    setContent(null);

    try {
      const fd = new FormData();
      fd.append("file", files[0].file);
      const res = await fetch("/api/pdf/extract-markdown/", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      setContent(data.content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed.");
    } finally {
      setProcessing(false);
    }
  };

  const copy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (!content || files.length === 0) return;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = files[0].file.name.replace(/\.pdf$/i, "") + ".md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">PDF to Markdown</h1>
        <p className="mt-3 text-gray-600">
          Extract PDF text with layout preserved. Paste into ChatGPT, Claude, Notion, or any AI tool.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3 text-sm text-amber-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div>
          <p className="font-medium">Server-side processing</p>
          <p className="mt-1 text-amber-800">
            Your PDF is uploaded over HTTPS, processed with pdftotext (Poppler), then deleted. Output is plain text — works as Markdown for LLM input.
          </p>
        </div>
      </div>

      <ToolUploadZone
        accept=".pdf"
        multiple={false}
        maxSizeMB={30}
        onFilesSelected={handleFilesSelected}
        label="Drop a PDF here or click to choose"
        sublabel="PDF up to 30MB. Text-based PDFs work best (scans need OCR first)."
      />

      {files.length > 0 && !content && (
        <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <button
            onClick={extract}
            disabled={processing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition disabled:opacity-70"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Extracting…</>
            ) : (
              <><FileCode className="w-4 h-4" /> Extract to Markdown</>
            )}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {content && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <h2 className="text-sm font-semibold flex items-center gap-1.5 text-gray-900">
              <FileCode className="w-4 h-4 text-emerald-600" /> Markdown output
              <span className="text-xs font-normal text-gray-500 ml-2">
                {content.length.toLocaleString()} chars
              </span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border bg-white text-gray-700 hover:border-emerald-400"
                style={{ borderColor: "var(--color-border)" }}
              >
                {copied ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
              <button
                onClick={download}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="w-3.5 h-3.5" /> Download .md
              </button>
            </div>
          </div>
          <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto p-4 rounded-lg bg-gray-50 text-gray-800">
            {content}
          </pre>
        </div>
      )}

    </div>
  );
}
