"use client";

import { useState, useCallback } from "react";
import { Loader2, Download, FileImage } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

type Target = "image/jpeg" | "image/png";

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

type Result = { name: string; size: number; url: string };

export default function HEICtoJPGPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [target, setTarget] = useState<Target>("image/jpeg");
  const [quality, setQuality] = useState(92);
  const [results, setResults] = useState<Result[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setResults([]);
    setError(null);
  }, []);

  const convert = async () => {
    if (files.length === 0) {
      setError("Please select HEIC file(s).");
      return;
    }
    setProcessing(true);
    setError(null);
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);
    setProgress({ done: 0, total: files.length });

    try {
      // Dynamic import to defer the 150KB heic2any payload until conversion is requested
      const heic2any = (await import("heic2any")).default;
      const out: Result[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i].file;
        const result = await heic2any({
          blob: f,
          toType: target,
          quality: target === "image/jpeg" ? quality / 100 : undefined,
        });
        const blob = Array.isArray(result) ? result[0] : (result as Blob);
        const ext = target === "image/jpeg" ? "jpg" : "png";
        const baseName = f.name.replace(/\.[^.]+$/, "");
        out.push({
          name: `${baseName}.${ext}`,
          size: blob.size,
          url: URL.createObjectURL(blob),
        });
        setProgress({ done: i + 1, total: files.length });
      }
      setResults(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "HEIC conversion failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">HEIC to JPG Converter</h1>
        <p className="mt-3 text-gray-600">Convert iPhone HEIC photos to JPG or PNG. Browser-side, no upload.</p>
      </div>

      <ToolUploadZone
        accept=".heic,.heif,image/heic,image/heif"
        multiple={true}
        maxSizeMB={50}
        onFilesSelected={handleFilesSelected}
        label="Drop HEIC/HEIF photo(s) here"
        sublabel="Single or batch up to 50 photos, 50MB each"
      />

      {files.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-white p-5 space-y-4" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Output format</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                ["image/jpeg", "JPG (smaller, lossy)"],
                ["image/png", "PNG (lossless, larger)"],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTarget(id as Target)}
                  className={`p-3 rounded-xl border font-medium transition text-sm ${
                    target === id ? "border-amber-500 bg-amber-50 text-amber-700" : "bg-white"
                  }`}
                  style={{ borderColor: target === id ? undefined : "var(--color-border)" }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {target === "image/jpeg" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-900">JPG quality: {quality}%</label>
                <span className="text-xs text-gray-500">{quality >= 90 ? "Archival" : quality >= 80 ? "High" : "Smaller"}</span>
              </div>
              <input
                type="range"
                min={60}
                max={100}
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="w-full accent-amber-600"
              />
            </div>
          )}

          <button
            onClick={convert}
            disabled={processing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 transition disabled:opacity-50"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Converting {progress.done}/{progress.total}…</>
            ) : (
              <><FileImage className="w-4 h-4" /> Convert {files.length} file{files.length === 1 ? "" : "s"}</>
            )}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {results.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-900 mb-3">Converted {results.length} file{results.length === 1 ? "" : "s"}</p>
          <ul className="space-y-2">
            {results.map((r, i) => (
              <li key={i} className="flex items-center gap-3 bg-white rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                  <p className="text-xs text-gray-500">{formatBytes(r.size)}</p>
                </div>
                <a
                  href={r.url}
                  download={r.name}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-medium"
                >
                  <Download className="w-3 h-3" /> Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
