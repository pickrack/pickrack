"use client";

import { useState, useRef } from "react";
import { Upload, Download, Loader2, AlertTriangle, ZoomIn } from "lucide-react";

type Scale = 2 | 3 | 4;

const MAX_BYTES = 30 * 1024 * 1024;
const MAX_OUTPUT_DIM = 8192; // browser canvas safety

/**
 * High-quality upscale via stepped bilinear in canvas with imageSmoothingQuality="high".
 * Real-ESRGAN/SwinIR would require ~30MB WASM model + ONNX runtime — out of scope for v1.
 * This implementation goes in incremental 1.5x steps for smoother gradient than a single big upscale.
 */
async function upscale(src: HTMLImageElement, scale: Scale): Promise<Blob> {
  const targetW = Math.min(src.naturalWidth * scale, MAX_OUTPUT_DIM);
  const targetH = Math.min(src.naturalHeight * scale, MAX_OUTPUT_DIM);

  // Step in 1.5x increments
  let currentW = src.naturalWidth;
  let currentH = src.naturalHeight;
  let sourceCanvas: HTMLCanvasElement | OffscreenCanvas = document.createElement("canvas");
  sourceCanvas.width = currentW;
  sourceCanvas.height = currentH;
  let ctx = (sourceCanvas as HTMLCanvasElement).getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(src, 0, 0);

  while (currentW < targetW) {
    const nextW = Math.min(Math.round(currentW * 1.5), targetW);
    const nextH = Math.min(Math.round(currentH * 1.5), targetH);
    const next = document.createElement("canvas");
    next.width = nextW;
    next.height = nextH;
    const nctx = next.getContext("2d");
    if (!nctx) throw new Error("Canvas unavailable");
    nctx.imageSmoothingEnabled = true;
    nctx.imageSmoothingQuality = "high";
    nctx.drawImage(sourceCanvas as HTMLCanvasElement, 0, 0, nextW, nextH);
    sourceCanvas = next;
    ctx = nctx;
    currentW = nextW;
    currentH = nextH;
  }

  return new Promise<Blob>((resolve, reject) => {
    (sourceCanvas as HTMLCanvasElement).toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png"
    );
  });
}

export default function ImageUpscalerPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDims, setImageDims] = useState<{ w: number; h: number } | null>(null);
  const [scale, setScale] = useState<Scale>(2);
  const [output, setOutput] = useState<{ url: string; size: number; w: number; h: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (output) URL.revokeObjectURL(output.url);
    setImageUrl(null);
    setImageDims(null);
    setOutput(null);
    setError(null);
  };

  const onFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("File must be an image.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("Image too large (max 30 MB).");
      return;
    }
    setError(null);
    setOutput(null);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth * 4 > MAX_OUTPUT_DIM * 2 || img.naturalHeight * 4 > MAX_OUTPUT_DIM * 2) {
        setError(`Source too large to upscale (${img.naturalWidth}×${img.naturalHeight}). Use Image Resizer first to reduce.`);
        return;
      }
      setImageDims({ w: img.naturalWidth, h: img.naturalHeight });
      setImageUrl(url);
    };
    img.onerror = () => setError("Could not load image.");
    img.src = url;
  };

  const run = async () => {
    if (!imageUrl) return;
    setProcessing(true);
    setError(null);
    try {
      const img = new Image();
      img.src = imageUrl;
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("Image decode failed"));
      });
      const blob = await upscale(img, scale);
      const url = URL.createObjectURL(blob);
      setOutput({
        url,
        size: blob.size,
        w: Math.min(img.naturalWidth * scale, MAX_OUTPUT_DIM),
        h: Math.min(img.naturalHeight * scale, MAX_OUTPUT_DIM),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upscale failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Image Upscaler</h1>
        <p className="mt-3 text-gray-600">
          Enlarge an image 2×, 3×, or 4× with smooth stepped resampling. Browser-side, no upload, no signup.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3 text-sm text-amber-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div>
          <p className="font-medium">This is a high-quality bicubic upscaler, not an AI super-resolution model</p>
          <p className="mt-1 text-amber-800">
            Output is smoother than the browser default but won&apos;t invent missing detail the way Real-ESRGAN or Topaz Gigapixel do. Best for moderate enlargements of clean source images. A WASM Real-ESRGAN version is on the roadmap.
          </p>
        </div>
      </div>

      {!imageUrl && (
        <div
          className="rounded-2xl border-2 border-dashed bg-white p-10 text-center hover:border-amber-400 transition cursor-pointer"
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
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-base font-medium text-gray-900">Drop an image here or click to browse</p>
          <p className="text-sm text-gray-500 mt-1">PNG, JPG, WebP, AVIF — up to 30 MB</p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {imageUrl && imageDims && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Source</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Source" className="w-full h-auto rounded-lg max-h-64 object-contain mx-auto" />
              <p className="mt-2 text-sm text-gray-700 text-center">
                {imageDims.w} × {imageDims.h}
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-4 flex flex-col" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Output preview</p>
              {output ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={output.url} alt="Upscaled" className="w-full h-auto rounded-lg max-h-64 object-contain mx-auto" />
                  <p className="mt-2 text-sm text-gray-700 text-center">
                    {output.w} × {output.h} · {(output.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                  Click Upscale to generate
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Scale factor</label>
            <div className="grid grid-cols-3 gap-2">
              {([2, 3, 4] as Scale[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`p-3 rounded-xl border text-center transition ${
                    scale === s
                      ? "border-amber-500 bg-amber-50"
                      : "bg-white hover:border-amber-300"
                  }`}
                  style={{ borderColor: scale === s ? undefined : "var(--color-border)" }}
                >
                  <p className={`text-lg font-bold ${scale === s ? "text-amber-700" : "text-gray-900"}`}>{s}×</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {imageDims.w * s} × {imageDims.h * s}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={run}
              disabled={processing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 transition disabled:opacity-50"
            >
              {processing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Upscaling…</>
              ) : (
                <><ZoomIn className="w-4 h-4" /> Upscale {scale}×</>
              )}
            </button>
            {output && (
              <a
                href={output.url}
                download={`upscaled-${scale}x.png`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white hover:border-amber-400 text-gray-800 font-medium py-3 transition"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Download className="w-4 h-4" /> Download PNG
              </a>
            )}
          </div>

          <button onClick={reset} className="mt-3 text-sm text-gray-500 hover:text-rose-600 mx-auto block">
            Choose another image
          </button>
        </>
      )}
    </div>
  );
}
