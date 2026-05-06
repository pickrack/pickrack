"use client";

import { useState, useCallback } from "react";
import { Loader2, Download, RefreshCw } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

type Target = "image/png" | "image/jpeg" | "image/webp" | "image/avif";

const TARGET_LABEL: Record<Target, { label: string; ext: string }> = {
  "image/png": { label: "PNG", ext: "png" },
  "image/jpeg": { label: "JPG", ext: "jpg" },
  "image/webp": { label: "WebP", ext: "webp" },
  "image/avif": { label: "AVIF", ext: "avif" },
};

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

type Result = { name: string; size: number; url: string };

async function convertImage(file: File, target: Target): Promise<Result> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");
  // For PNG → JPG conversion, fill white background first (JPG has no transparency)
  if (target === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, target, target === "image/png" ? undefined : 0.92)
  );
  if (!blob) throw new Error(`Browser cannot encode ${TARGET_LABEL[target].label}`);
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return {
    name: `${baseName}.${TARGET_LABEL[target].ext}`,
    size: blob.size,
    url: URL.createObjectURL(blob),
  };
}

export default function ImageConverterPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [target, setTarget] = useState<Target>("image/webp");
  const [results, setResults] = useState<Result[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setResults([]);
    setError(null);
  }, []);

  const convert = async () => {
    if (files.length === 0) {
      setError("Please select an image.");
      return;
    }
    setProcessing(true);
    setError(null);
    // Cleanup previous URLs
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);

    const out: Result[] = [];
    try {
      for (const f of files) {
        out.push(await convertImage(f.file, target));
      }
      setResults(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setProcessing(false);
    }
  };

  const totalOriginal = files.reduce((sum, f) => sum + f.file.size, 0);
  const totalConverted = results.reduce((sum, r) => sum + r.size, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Image Converter</h1>
        <p className="mt-3 text-gray-600">PNG, JPG, WebP, AVIF — convert single or batch. Browser-side, no upload.</p>
      </div>

      <ToolUploadZone
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp"
        multiple={true}
        maxSizeMB={50}
        onFilesSelected={handleFilesSelected}
        label="Drop image(s) here or click to choose"
        sublabel="JPG, PNG, WebP, AVIF, GIF, BMP — single or batch"
      />

      {files.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-white p-5 space-y-4" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Convert to</p>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(TARGET_LABEL) as Target[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  className={`p-3 rounded-xl border font-medium transition ${
                    target === t ? "border-amber-500 bg-amber-50 text-amber-700" : "bg-white"
                  }`}
                  style={{ borderColor: target === t ? undefined : "var(--color-border)" }}
                >
                  {TARGET_LABEL[t].label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500">
            {files.length} file{files.length === 1 ? "" : "s"} · {formatBytes(totalOriginal)} total
          </div>

          <button
            onClick={convert}
            disabled={processing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 transition disabled:opacity-50"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Converting…</>
            ) : (
              <><RefreshCw className="w-4 h-4" /> Convert to {TARGET_LABEL[target].label}</>
            )}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {results.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-900 mb-3">
            Converted {results.length} file{results.length === 1 ? "" : "s"} · {formatBytes(totalConverted)} total
          </p>
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
