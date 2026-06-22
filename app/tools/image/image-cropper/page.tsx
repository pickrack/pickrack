"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Download, Crop as CropIcon } from "lucide-react";

type Ratio = { label: string; value: number | null };

const RATIOS: Ratio[] = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
  { label: "3:2", value: 3 / 2 },
];

type CropRect = { x: number; y: number; w: number; h: number };

const MAX_BYTES = 30 * 1024 * 1024;

export default function ImageCropperPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDims, setImageDims] = useState<{ w: number; h: number } | null>(null);
  const [ratio, setRatio] = useState<Ratio>(RATIOS[0]);
  const [crop, setCrop] = useState<CropRect>({ x: 10, y: 10, w: 60, h: 60 });
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ mode: "move" | "se" | null; sx: number; sy: number; orig: CropRect } | null>(null);

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
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setImageDims({ w: img.naturalWidth, h: img.naturalHeight });
      setImageUrl(url);
      setCrop({ x: 10, y: 10, w: 80, h: 80 });
    };
    img.onerror = () => setError("Could not load image.");
    img.src = url;
  };

  // Enforce aspect ratio when active
  const constrainToRatio = useCallback(
    (c: CropRect, r: number | null): CropRect => {
      if (!r) return c;
      // Treat container as if it were the image's actual dims; we operate in percent so ratio = width%/height% * (imageW/imageH)
      // For simplicity, when ratio is locked we keep width % constant and recompute height %
      if (!imageDims) return c;
      const heightPct = (c.w * imageDims.w) / (r * imageDims.h);
      return { ...c, h: Math.min(100 - c.y, heightPct) };
    },
    [imageDims]
  );

  useEffect(() => {
    setCrop((c) => constrainToRatio(c, ratio.value));
  }, [ratio, constrainToRatio]);

  const startDrag = (mode: "move" | "se", e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const point = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    dragRef.current = {
      mode,
      sx: point.clientX,
      sy: point.clientY,
      orig: { ...crop },
    };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const d = dragRef.current;
      if (!d || !containerRef.current) return;
      const point = "touches" in e ? e.touches[0] : (e as MouseEvent);
      const rect = containerRef.current.getBoundingClientRect();
      const dxPct = ((point.clientX - d.sx) / rect.width) * 100;
      const dyPct = ((point.clientY - d.sy) / rect.height) * 100;

      if (d.mode === "move") {
        const nx = Math.max(0, Math.min(100 - d.orig.w, d.orig.x + dxPct));
        const ny = Math.max(0, Math.min(100 - d.orig.h, d.orig.y + dyPct));
        setCrop({ ...d.orig, x: nx, y: ny });
      } else if (d.mode === "se") {
        let nw = Math.max(5, Math.min(100 - d.orig.x, d.orig.w + dxPct));
        let nh = Math.max(5, Math.min(100 - d.orig.y, d.orig.h + dyPct));
        if (ratio.value && imageDims) {
          // Lock based on width change
          nh = (nw * imageDims.w) / (ratio.value * imageDims.h);
          if (d.orig.y + nh > 100) {
            nh = 100 - d.orig.y;
            nw = (nh * ratio.value * imageDims.h) / imageDims.w;
          }
        }
        setCrop({ ...d.orig, w: nw, h: nh });
      }
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [ratio, imageDims]);

  const exportCrop = (format: "image/png" | "image/jpeg") => {
    if (!imageUrl || !imageDims) return;
    const img = new Image();
    img.onload = () => {
      const sx = (crop.x / 100) * imageDims.w;
      const sy = (crop.y / 100) * imageDims.h;
      const sw = (crop.w / 100) * imageDims.w;
      const sh = (crop.h / 100) * imageDims.h;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(sw);
      canvas.height = Math.round(sh);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `cropped.${format === "image/png" ? "png" : "jpg"}`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        },
        format,
        0.92
      );
    };
    img.src = imageUrl;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Image Cropper</h1>
        <p className="mt-3 text-gray-600">
          Crop images with preset aspect ratios (1:1, 4:3, 16:9, 9:16) or freeform. Browser-side, no upload.
        </p>
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
          <div className="flex flex-wrap gap-2 mb-4">
            {RATIOS.map((r) => (
              <button
                key={r.label}
                onClick={() => setRatio(r)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                  ratio.label === r.label
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "bg-white text-gray-700 hover:border-amber-300"
                }`}
                style={{ borderColor: ratio.label === r.label ? undefined : "var(--color-border)" }}
              >
                {r.label}
              </button>
            ))}
            <button
              onClick={() => {
                if (imageUrl) URL.revokeObjectURL(imageUrl);
                setImageUrl(null);
                setImageDims(null);
              }}
              className="ml-auto px-3 py-1.5 rounded-lg border text-sm bg-white text-gray-600 hover:border-rose-300"
              style={{ borderColor: "var(--color-border)" }}
            >
              Choose another
            </button>
          </div>

          <div
            ref={containerRef}
            className="relative inline-block w-full select-none"
            style={{ touchAction: "none" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Source" className="block w-full h-auto rounded-xl" draggable={false} />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            <div
              className="absolute border-2 border-amber-400 cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"
              style={{
                left: `${crop.x}%`,
                top: `${crop.y}%`,
                width: `${crop.w}%`,
                height: `${crop.h}%`,
                boxShadow: "none",
                background: "transparent",
              }}
              onMouseDown={(e) => startDrag("move", e)}
              onTouchStart={(e) => startDrag("move", e)}
            >
              {/* Punch-through highlight by inverting overlay logic */}
              <div className="absolute inset-0" style={{ background: "transparent" }} />
              <div
                className="absolute right-0 bottom-0 w-4 h-4 bg-amber-500 cursor-se-resize"
                style={{ transform: "translate(50%, 50%)" }}
                onMouseDown={(e) => startDrag("se", e)}
                onTouchStart={(e) => startDrag("se", e)}
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl border bg-white p-4 text-sm text-gray-700 flex flex-wrap gap-4 justify-between" style={{ borderColor: "var(--color-border)" }}>
            <span>
              Source: <strong>{imageDims.w} × {imageDims.h}</strong>
            </span>
            <span>
              Output:{" "}
              <strong>
                {Math.round((crop.w / 100) * imageDims.w)} × {Math.round((crop.h / 100) * imageDims.h)}
              </strong>
            </span>
            <span>
              Ratio: <strong>{ratio.label}</strong>
            </span>
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <button
              onClick={() => exportCrop("image/png")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 transition"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button
              onClick={() => exportCrop("image/jpeg")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white hover:border-amber-400 text-gray-800 font-medium py-3 transition"
              style={{ borderColor: "var(--color-border)" }}
            >
              <CropIcon className="w-4 h-4" /> Download JPG
            </button>
          </div>
        </>
      )}
    </div>
  );
}
