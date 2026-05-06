"use client";

import { useState, useCallback } from "react";
import { Loader2, Download, Minimize2, AlertTriangle } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

type Level = "low" | "medium" | "high";

const LEVEL_INFO: Record<Level, { label: string; desc: string; dpi: string }> = {
  low: { label: "Low", desc: "Best quality, smaller reduction", dpi: "300 dpi" },
  medium: { label: "Medium", desc: "Balanced — recommended", dpi: "150 dpi" },
  high: { label: "High", desc: "Maximum compression, lower quality", dpi: "72 dpi" },
};

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

export default function CompressPDFPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [level, setLevel] = useState<Level>("medium");
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setDownloadUrl(null);
    setStats(null);
    setError(null);
  }, []);

  const compress = async () => {
    if (files.length === 0) {
      setError("Please select a PDF.");
      return;
    }
    setProcessing(true);
    setError(null);
    setDownloadUrl(null);
    setStats(null);

    try {
      const fd = new FormData();
      fd.append("file", files[0].file);
      fd.append("level", level);
      const res = await fetch("/api/pdf/compress/", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }
      const original = Number(res.headers.get("X-Original-Size")) || files[0].file.size;
      const compressed = Number(res.headers.get("X-Compressed-Size")) || 0;
      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      setStats({ original, compressed: compressed || blob.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed.");
    } finally {
      setProcessing(false);
    }
  };

  const reduction = stats
    ? Math.max(0, Math.round((1 - stats.compressed / stats.original) * 100))
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Compress PDF</h1>
        <p className="mt-3 text-gray-600">
          Reduce PDF file size for email or upload. Server-side via Ghostscript.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3 text-sm text-amber-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div>
          <p className="font-medium">Server-side processing</p>
          <p className="mt-1 text-amber-800">
            File is uploaded over HTTPS, processed with Ghostscript, then deleted. Nothing logged.
          </p>
        </div>
      </div>

      <ToolUploadZone
        accept=".pdf"
        multiple={false}
        maxSizeMB={100}
        onFilesSelected={handleFilesSelected}
        label="Drop a PDF here or click to choose"
        sublabel="Single PDF up to 100MB. Encrypted PDFs not supported."
      />

      {files.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm font-semibold text-gray-900 mb-3">Compression level</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {(Object.keys(LEVEL_INFO) as Level[]).map((id) => {
              const info = LEVEL_INFO[id];
              return (
                <button
                  key={id}
                  onClick={() => setLevel(id)}
                  className={`p-3 rounded-xl border text-left transition ${
                    level === id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <p className={`text-sm font-semibold ${level === id ? "text-emerald-700" : "text-gray-900"}`}>{info.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{info.desc}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{info.dpi}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={compress}
            disabled={processing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition disabled:opacity-70"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Compressing…</>
            ) : (
              <><Minimize2 className="w-4 h-4" /> Compress PDF</>
            )}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {downloadUrl && stats && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-900">
            <strong>{formatBytes(stats.original)}</strong> → <strong>{formatBytes(stats.compressed)}</strong>{" "}
            <span className="text-emerald-700 font-semibold">({reduction}% smaller)</span>
          </p>
          <a
            href={downloadUrl}
            download="compressed.pdf"
            className="mt-3 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition"
          >
            <Download className="w-4 h-4" /> Download compressed.pdf
          </a>
        </div>
      )}

    </div>
  );
}
