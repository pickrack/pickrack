"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Copy, Check, Loader2, Palette } from "lucide-react";

type Swatch = { hex: string; rgb: [number, number, number]; count: number };

const MAX_BYTES = 30 * 1024 * 1024; // 30MB
const SAMPLE_DIM = 240; // resize image to this max edge before sampling

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0").toUpperCase()).join("");
}

/**
 * Median-cut color quantization.
 * Returns up to `k` dominant colors from a flat pixel array (RGBA, alpha ignored).
 */
function medianCut(pixels: Uint8ClampedArray, k: number): Swatch[] {
  // Build initial bucket of {r,g,b} per pixel
  const total = pixels.length / 4;
  const buckets: number[][][] = [
    Array.from({ length: total }, (_, i) => [
      pixels[i * 4],
      pixels[i * 4 + 1],
      pixels[i * 4 + 2],
    ]),
  ];

  while (buckets.length < k) {
    // Pick the bucket with the largest range across any channel
    let target = -1;
    let maxRange = -1;
    let cutChannel = 0;
    for (let i = 0; i < buckets.length; i++) {
      const b = buckets[i];
      if (b.length < 2) continue;
      for (let ch = 0; ch < 3; ch++) {
        let lo = 255;
        let hi = 0;
        for (const px of b) {
          if (px[ch] < lo) lo = px[ch];
          if (px[ch] > hi) hi = px[ch];
        }
        const range = hi - lo;
        if (range > maxRange) {
          maxRange = range;
          target = i;
          cutChannel = ch;
        }
      }
    }
    if (target === -1 || maxRange === 0) break;

    const bucket = buckets[target];
    bucket.sort((a, b) => a[cutChannel] - b[cutChannel]);
    const mid = Math.floor(bucket.length / 2);
    const left = bucket.slice(0, mid);
    const right = bucket.slice(mid);
    buckets.splice(target, 1, left, right);
  }

  // Average each bucket
  const swatches: Swatch[] = buckets.map((b) => {
    let r = 0, g = 0, bl = 0;
    for (const px of b) {
      r += px[0];
      g += px[1];
      bl += px[2];
    }
    const n = b.length || 1;
    const ar = Math.round(r / n);
    const ag = Math.round(g / n);
    const ab = Math.round(bl / n);
    return { hex: rgbToHex(ar, ag, ab), rgb: [ar, ag, ab], count: b.length };
  });

  return swatches.sort((a, b) => b.count - a.count);
}

export default function ColorPalettePage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [palette, setPalette] = useState<Swatch[]>([]);
  const [count, setCount] = useState(6);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback((url: string, k: number) => {
    setProcessing(true);
    setError(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const ratio = Math.max(img.width, img.height) / SAMPLE_DIM;
        const w = Math.max(1, Math.round(img.width / ratio));
        const h = Math.max(1, Math.round(img.height / ratio));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("Canvas 2D context unavailable.");
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        const swatches = medianCut(data, k);
        setPalette(swatches);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not process image.");
      } finally {
        setProcessing(false);
      }
    };
    img.onerror = () => {
      setError("Could not load image.");
      setProcessing(false);
    };
    img.src = url;
  }, []);

  const onFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("File must be an image (PNG, JPG, WebP, etc).");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("Image too large (max 30 MB).");
      return;
    }
    setError(null);
    const url = URL.createObjectURL(f);
    setImageUrl(url);
    processImage(url, count);
  };

  const onCountChange = (k: number) => {
    setCount(k);
    if (imageUrl) processImage(imageUrl, k);
  };

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const cssArray = palette.map((s) => `"${s.hex}"`).join(", ");

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Color Palette Extractor</h1>
        <p className="mt-3 text-gray-600">
          Pull the dominant colors from any image. Median-cut quantization, browser-side, copy hex codes.
        </p>
      </div>

      <div
        className="rounded-2xl border-2 border-dashed bg-white p-8 text-center hover:border-amber-400 transition cursor-pointer"
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
        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-900">Drop an image here or click to browse</p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP, AVIF — up to 30 MB</p>
      </div>

      {error && (
        <p className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {imageUrl && (
        <>
          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <label className="text-sm font-semibold text-gray-900 block">Colors</label>
              <p className="text-xs text-gray-500">{count} swatches</p>
            </div>
            <input
              type="range"
              min={3}
              max={12}
              value={count}
              onChange={(e) => onCountChange(parseInt(e.target.value, 10))}
              className="flex-1 max-w-xs accent-amber-600"
            />
          </div>

          <div className="mt-4 grid sm:grid-cols-[1fr_1fr] gap-4">
            <div className="rounded-2xl overflow-hidden border bg-gray-100" style={{ borderColor: "var(--color-border)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Source" className="w-full h-auto object-contain max-h-80" />
            </div>

            <div className="rounded-2xl border bg-white p-4 space-y-2" style={{ borderColor: "var(--color-border)" }}>
              {processing ? (
                <div className="flex items-center justify-center gap-2 text-gray-500 py-8">
                  <Loader2 className="w-4 h-4 animate-spin" /> Extracting palette…
                </div>
              ) : (
                palette.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border shrink-0"
                      style={{ backgroundColor: s.hex, borderColor: "var(--color-border)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-semibold text-gray-900">{s.hex}</p>
                      <p className="text-xs text-gray-500">
                        rgb({s.rgb[0]}, {s.rgb[1]}, {s.rgb[2]})
                      </p>
                    </div>
                    <button
                      onClick={() => copy(s.hex, `hex-${i}`)}
                      className="rounded-lg border p-2 hover:border-amber-400"
                      style={{ borderColor: "var(--color-border)" }}
                      aria-label="Copy"
                    >
                      {copied === `hex-${i}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {palette.length > 0 && (
            <div className="mt-4 rounded-2xl border bg-gray-50 p-4" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> Export as CSS array
                </p>
                <button
                  onClick={() => copy(`[${cssArray}]`, "css")}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-white hover:border-amber-400 flex items-center gap-1.5"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {copied === "css" ? <><Check className="w-3 h-3 text-emerald-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
              </div>
              <code className="text-xs text-gray-800 break-all block">[{cssArray}]</code>
            </div>
          )}
        </>
      )}
    </div>
  );
}
