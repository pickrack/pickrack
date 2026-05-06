"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Download, Minimize2 } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

type OutputFormat = "image/jpeg" | "image/webp" | "image/png";

const FORMAT_LABEL: Record<OutputFormat, string> = {
  "image/jpeg": "JPG",
  "image/webp": "WebP",
  "image/png": "PNG (lossless)",
};

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

async function compressImage(file: File, quality: number, format: OutputFormat): Promise<{ blob: Blob; previewUrl: string }> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, format, format === "image/png" ? undefined : quality / 100)
  );
  if (!blob) throw new Error("Failed to encode");
  return { blob, previewUrl: URL.createObjectURL(blob) };
}

export default function ImageCompressorPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setError(null);
    if (uploaded.length === 0) {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      setOriginalUrl(null);
      return;
    }
    const file = uploaded[0].file;
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setOriginalUrl(URL.createObjectURL(file));
    setOriginalSize(file.size);
  }, [originalUrl]);

  // Live re-compress on quality/format change (debounced)
  useEffect(() => {
    if (files.length === 0) return;
    setProcessing(true);
    const handle = setTimeout(async () => {
      try {
        const { blob, previewUrl } = await compressImage(files[0].file, quality, format);
        if (compressedUrl) URL.revokeObjectURL(compressedUrl);
        setCompressedUrl(previewUrl);
        setCompressedSize(blob.size);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Compression failed");
      } finally {
        setProcessing(false);
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, quality, format]);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reduction = compressedSize > 0 && originalSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0;

  const downloadName = files[0]
    ? files[0].file.name.replace(/\.[^.]+$/, "") + (format === "image/jpeg" ? ".jpg" : format === "image/webp" ? ".webp" : ".png")
    : "compressed.jpg";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Image Compressor</h1>
        <p className="mt-3 text-gray-600">Compress JPG, PNG, WebP. Browser-side, real-time preview, no upload.</p>
      </div>

      <ToolUploadZone
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={false}
        maxSizeMB={50}
        onFilesSelected={handleFilesSelected}
        label="Drop an image here or click to choose"
        sublabel="JPG, PNG, WebP, AVIF up to 50MB"
      />

      {originalUrl && (
        <>
          <div className="grid gap-4 lg:grid-cols-2 mt-6">
            <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900">Original</p>
                <span className="text-xs text-gray-500">{formatBytes(originalSize)}</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={originalUrl} alt="Original" className="w-full max-h-[400px] object-contain rounded-lg" />
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-amber-900">
                  Compressed {processing && <Loader2 className="w-3 h-3 animate-spin inline ml-1" />}
                </p>
                <span className="text-xs text-amber-800">
                  {formatBytes(compressedSize)} {reduction > 0 && <span className="font-bold">({reduction}% smaller)</span>}
                </span>
              </div>
              {compressedUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={compressedUrl} alt="Compressed" className="w-full max-h-[400px] object-contain rounded-lg" />
              ) : (
                <div className="w-full h-[200px] flex items-center justify-center text-amber-700 text-sm">
                  {processing ? "Compressing…" : "Adjust quality below"}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border bg-white p-5 space-y-4" style={{ borderColor: "var(--color-border)" }}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-900">Quality: {quality}%</label>
                <span className="text-xs text-gray-500">
                  {quality >= 90 ? "High" : quality >= 75 ? "Recommended" : quality >= 60 ? "Low" : "Very low"}
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={100}
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="w-full accent-amber-600"
                disabled={format === "image/png"}
              />
              {format === "image/png" && <p className="text-xs text-gray-500 mt-1">PNG is lossless — quality slider has no effect.</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(FORMAT_LABEL) as OutputFormat[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`p-2 rounded-lg border text-sm font-medium transition ${
                      format === f ? "border-amber-500 bg-amber-50 text-amber-700" : "bg-white"
                    }`}
                    style={{ borderColor: format === f ? undefined : "var(--color-border)" }}
                  >
                    {FORMAT_LABEL[f]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          {compressedUrl && (
            <a
              href={compressedUrl}
              download={downloadName}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 transition"
            >
              <Download className="w-4 h-4" /> Download {downloadName} ({formatBytes(compressedSize)})
            </a>
          )}
        </>
      )}

      {!originalUrl && (
        <div className="mt-6 rounded-2xl border bg-white p-8 text-center" style={{ borderColor: "var(--color-border)" }}>
          <Minimize2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Drop an image to start compressing.</p>
        </div>
      )}
    </div>
  );
}
