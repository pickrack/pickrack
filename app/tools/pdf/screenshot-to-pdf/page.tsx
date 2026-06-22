"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ClipboardPaste, Upload, Trash2, ArrowUp, ArrowDown, Loader2, Download, FileText } from "lucide-react";

type Shot = { id: string; url: string; w: number; h: number; size: number };

type PageMode = "fit" | "a4" | "letter";

const MAX_SHOTS = 30;
const MAX_BYTES = 30 * 1024 * 1024;

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

async function imageBytes(url: string): Promise<{ bytes: Uint8Array; type: "png" | "jpg" }> {
  const res = await fetch(url);
  const blob = await res.blob();
  const buf = await blob.arrayBuffer();
  const type = blob.type === "image/jpeg" ? "jpg" : "png";
  return { bytes: new Uint8Array(buf), type };
}

export default function ScreenshotToPdfPage() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [pageMode, setPageMode] = useState<PageMode>("fit");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addBlob = useCallback((blob: Blob) => {
    if (!blob.type.startsWith("image/")) return;
    if (blob.size > MAX_BYTES) {
      setError("Image too large (max 30 MB each).");
      return;
    }
    if (shots.length >= MAX_SHOTS) {
      setError(`Max ${MAX_SHOTS} screenshots per PDF.`);
      return;
    }
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      setShots((s) => [...s, { id: uid(), url, w: img.naturalWidth, h: img.naturalHeight, size: blob.size }]);
    };
    img.onerror = () => setError("Could not load one of the images.");
    img.src = url;
  }, [shots.length]);

  // Global clipboard paste listener — works anywhere on the page
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      let pasted = 0;
      for (const item of Array.from(e.clipboardData.items)) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          if (blob) {
            addBlob(blob);
            pasted++;
          }
        }
      }
      if (pasted > 0) {
        e.preventDefault();
        setError(null);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addBlob]);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) addBlob(f);
  };

  const move = (id: string, dir: -1 | 1) => {
    setShots((s) => {
      const i = s.findIndex((x) => x.id === id);
      if (i < 0) return s;
      const j = i + dir;
      if (j < 0 || j >= s.length) return s;
      const copy = [...s];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const remove = (id: string) => {
    setShots((s) => {
      const target = s.find((x) => x.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return s.filter((x) => x.id !== id);
    });
  };

  const buildPdf = async () => {
    if (shots.length === 0) {
      setError("Paste a screenshot (Ctrl/Cmd+V) or upload an image first.");
      return;
    }
    setProcessing(true);
    setError(null);
    setDownloadUrl(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();

      const A4 = { w: 595.28, h: 841.89 };
      const LETTER = { w: 612, h: 792 };

      for (const shot of shots) {
        const { bytes, type } = await imageBytes(shot.url);
        const img = type === "jpg" ? await doc.embedJpg(bytes) : await doc.embedPng(bytes);

        if (pageMode === "fit") {
          // One image per page, page size = image native pixels (1px = 1pt)
          const page = doc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        } else {
          const size = pageMode === "a4" ? A4 : LETTER;
          const page = doc.addPage([size.w, size.h]);
          // Fit image into page with 20pt margin, maintain aspect
          const margin = 20;
          const availW = size.w - margin * 2;
          const availH = size.h - margin * 2;
          const scale = Math.min(availW / img.width, availH / img.height);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const x = (size.w - drawW) / 2;
          const y = (size.h - drawH) / 2;
          page.drawImage(img, { x, y, width: drawW, height: drawH });
        }
      }

      const bytes = await doc.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to build PDF.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Screenshot to PDF</h1>
        <p className="mt-3 text-gray-600">
          Paste screenshots with <kbd className="px-1.5 py-0.5 rounded border bg-gray-50 text-xs font-mono">Ctrl+V</kbd> (or <kbd className="px-1.5 py-0.5 rounded border bg-gray-50 text-xs font-mono">⌘V</kbd>) and combine into a single PDF. Browser-side, no upload.
        </p>
      </div>

      <div
        className="rounded-2xl border-2 border-dashed bg-white p-8 text-center hover:border-rose-400 transition cursor-pointer mb-4"
        style={{ borderColor: "var(--color-border)" }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <div className="flex items-center justify-center gap-2 mb-2">
          <ClipboardPaste className="w-6 h-6 text-rose-600" />
          <span className="text-base font-semibold text-gray-900">Paste anywhere on the page</span>
        </div>
        <p className="text-sm text-gray-600">or drag images here / click to browse</p>
        <p className="text-xs text-gray-500 mt-2">PNG, JPG, WebP — up to {MAX_SHOTS} screenshots, 30 MB each</p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {shots.length > 0 && (
        <>
          <div className="rounded-2xl border bg-white p-4 mb-4" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <p className="text-sm font-semibold text-gray-900">
                {shots.length} screenshot{shots.length === 1 ? "" : "s"} queued
              </p>
              <button
                onClick={() => {
                  shots.forEach((s) => URL.revokeObjectURL(s.url));
                  setShots([]);
                  setDownloadUrl(null);
                }}
                className="text-xs text-gray-500 hover:text-rose-600"
              >
                Clear all
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {shots.map((s, i) => (
                <div
                  key={s.id}
                  className="rounded-xl border bg-gray-50 p-3 flex gap-3 items-center"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.url} alt={`Screenshot ${i + 1}`} className="w-16 h-16 object-cover rounded-lg border" />
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="font-medium text-gray-900">#{i + 1}</p>
                    <p className="text-xs text-gray-500">
                      {s.w}×{s.h} · {(s.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => move(s.id, -1)} disabled={i === 0} className="p-1 rounded hover:bg-white disabled:opacity-30" aria-label="Move up">
                      <ArrowUp className="w-4 h-4 text-gray-600" />
                    </button>
                    <button onClick={() => move(s.id, 1)} disabled={i === shots.length - 1} className="p-1 rounded hover:bg-white disabled:opacity-30" aria-label="Move down">
                      <ArrowDown className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <button onClick={() => remove(s.id)} className="p-1 rounded hover:bg-rose-100" aria-label="Remove">
                    <Trash2 className="w-4 h-4 text-rose-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 mb-4" style={{ borderColor: "var(--color-border)" }}>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Page size</label>
            <div className="grid grid-cols-3 gap-2">
              {(["fit", "a4", "letter"] as PageMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setPageMode(m)}
                  className={`p-3 rounded-xl border text-left transition ${
                    pageMode === m ? "border-rose-500 bg-rose-50" : "bg-white"
                  }`}
                  style={{ borderColor: pageMode === m ? undefined : "var(--color-border)" }}
                >
                  <p className={`text-sm font-semibold ${pageMode === m ? "text-rose-700" : "text-gray-900"}`}>
                    {m === "fit" ? "Fit-to-image" : m === "a4" ? "A4" : "US Letter"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {m === "fit" ? "Page = image native size" : m === "a4" ? "210 × 297 mm" : "8.5 × 11 in"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={buildPdf}
              disabled={processing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 transition disabled:opacity-50"
            >
              {processing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Building PDF…</>
              ) : (
                <><FileText className="w-4 h-4" /> Combine into PDF</>
              )}
            </button>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download="screenshots.pdf"
                className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white hover:border-rose-400 text-gray-800 font-medium py-3 transition"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Download className="w-4 h-4" /> Download screenshots.pdf
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
