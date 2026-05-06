"use client";

import { useState, useCallback, useEffect } from "react";
import { Loader2, Download, Lock, Unlock, ImagePlus } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

const FORMAT_LABEL: Record<OutputFormat, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageResizerPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [imageInfo, setImageInfo] = useState<{ w: number; h: number; size: number } | null>(null);
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [lockAspect, setLockAspect] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(92);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("resized.jpg");
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setDownloadUrl(null);
    setOutputSize(null);
    setError(null);

    if (uploaded.length === 0) {
      setImageInfo(null);
      return;
    }

    const file = uploaded[0].file;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageInfo({ w: img.naturalWidth, h: img.naturalHeight, size: file.size });
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError("Failed to load image. Try a different file.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  // Aspect lock handlers
  const updateWidth = (v: string) => {
    setWidth(v);
    if (lockAspect && imageInfo && v) {
      const w = parseInt(v, 10);
      if (!Number.isNaN(w) && w > 0) {
        const ratio = imageInfo.h / imageInfo.w;
        setHeight(String(Math.round(w * ratio)));
      }
    }
  };
  const updateHeight = (v: string) => {
    setHeight(v);
    if (lockAspect && imageInfo && v) {
      const h = parseInt(v, 10);
      if (!Number.isNaN(h) && h > 0) {
        const ratio = imageInfo.w / imageInfo.h;
        setWidth(String(Math.round(h * ratio)));
      }
    }
  };

  // Cleanup blob URL on unmount or before new download
  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const resize = async () => {
    if (files.length === 0 || !imageInfo) {
      setError("Please select an image.");
      return;
    }
    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (Number.isNaN(w) || Number.isNaN(h) || w < 1 || h < 1 || w > 10000 || h > 10000) {
      setError("Width and height must be between 1 and 10000.");
      return;
    }

    setProcessing(true);
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);

    try {
      const file = files[0].file;
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context.");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, outputFormat, outputFormat === "image/png" ? undefined : quality / 100)
      );
      if (!blob) throw new Error("Failed to encode output image.");

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setOutputSize(blob.size);

      const ext = outputFormat === "image/jpeg" ? "jpg" : outputFormat === "image/png" ? "png" : "webp";
      const baseName = file.name.replace(/\.[^.]+$/, "");
      setDownloadName(`${baseName}-${w}x${h}.${ext}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resize failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Image Resizer</h1>
        <p className="mt-3 text-gray-600">
          Resize JPG, PNG, WebP, AVIF images to any dimensions. Browser-side, your image never uploads.
        </p>
      </div>

      <ToolUploadZone
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        multiple={false}
        maxSizeMB={50}
        onFilesSelected={handleFilesSelected}
        label="Drop an image here or click to choose"
        sublabel="JPG, PNG, WebP, AVIF up to 50MB"
      />

      {imageInfo && (
        <div className="mt-6 rounded-2xl border bg-white p-5 space-y-4" style={{ borderColor: "var(--color-border)" }}>
          <div className="text-sm text-gray-600">
            Original: <span className="font-semibold text-gray-900">{imageInfo.w} × {imageInfo.h}</span> · {formatBytes(imageInfo.size)}
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Width (px)</label>
              <input
                type="number"
                min={1}
                max={10000}
                value={width}
                onChange={(e) => updateWidth(e.target.value)}
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Height (px)</label>
              <input
                type="number"
                min={1}
                max={10000}
                value={height}
                onChange={(e) => updateHeight(e.target.value)}
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLockAspect((v) => !v)}
            className={`inline-flex items-center gap-2 text-sm transition ${lockAspect ? "text-emerald-700" : "text-gray-500"}`}
          >
            {lockAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {lockAspect ? "Aspect ratio locked" : "Aspect ratio unlocked"}
          </button>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Output format</label>
            <div className="flex gap-2">
              {(Object.keys(FORMAT_LABEL) as OutputFormat[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setOutputFormat(f)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    outputFormat === f ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "bg-white"
                  }`}
                  style={{ borderColor: outputFormat === f ? undefined : "var(--color-border)" }}
                >
                  {FORMAT_LABEL[f]}
                </button>
              ))}
            </div>
          </div>

          {outputFormat !== "image/png" && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Quality: {quality}</label>
              <input
                type="range"
                min={50}
                max={100}
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600"
              />
            </div>
          )}

          <button
            onClick={resize}
            disabled={processing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition disabled:opacity-50"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Resizing…</>
            ) : (
              <><ImagePlus className="w-4 h-4" /> Resize image</>
            )}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {downloadUrl && outputSize !== null && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-900 mb-3">
            Resized to <strong>{width} × {height}</strong> · <strong>{formatBytes(outputSize)}</strong>
          </p>
          <a
            href={downloadUrl}
            download={downloadName}
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition"
          >
            <Download className="w-4 h-4" /> Download {downloadName}
          </a>
        </div>
      )}
    </div>
  );
}
