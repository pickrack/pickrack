"use client";

import { useState, useCallback, useEffect } from "react";
import { Loader2, Download, Image as ImageIcon } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

type Quality = "low" | "medium" | "high";
const QUALITY: Record<Quality, { scale: number; jpeg: number; label: string; desc: string }> = {
  low: { scale: 1.0, jpeg: 0.7, label: "Low", desc: "Smaller files, faster" },
  medium: { scale: 1.5, jpeg: 0.85, label: "Medium", desc: "Balanced — recommended" },
  high: { scale: 2.5, jpeg: 0.95, label: "High", desc: "Sharper text, larger files" },
};

export default function PDFtoJPGPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [quality, setQuality] = useState<Quality>("medium");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("images.zip");
  const [error, setError] = useState<string | null>(null);
  const [pdfjsReady, setPdfjsReady] = useState(false);

  // Lazy-load pdfjs worker on mount (avoid SSR issues)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        if (cancelled) return;
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        setPdfjsReady(true);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? `Failed to load PDF reader: ${e.message}` : "Failed to load PDF reader.");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setDownloadUrl(null);
    setError(null);
    setProgress({ done: 0, total: 0 });
  }, []);

  const convert = async () => {
    if (files.length === 0) {
      setError("Please select a PDF.");
      return;
    }
    if (!pdfjsReady) {
      setError("PDF reader is still loading. Try again in a moment.");
      return;
    }
    setProcessing(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const pdfjs = await import("pdfjs-dist");
      const JSZip = (await import("jszip")).default;
      const opts = QUALITY[quality];

      const buf = await files[0].file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buf }).promise;
      const total = pdf.numPages;
      setProgress({ done: 0, total });

      const baseName = files[0].file.name.replace(/\.pdf$/i, "");

      if (total === 1) {
        // Single page: download JPG directly
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: opts.scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D context unavailable.");
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", opts.jpeg)
        );
        if (!blob) throw new Error("Failed to encode JPG.");
        setProgress({ done: 1, total: 1 });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(`${baseName}.jpg`);
        return;
      }

      // Multi-page: ZIP
      const zip = new JSZip();
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: opts.scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D context unavailable.");
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", opts.jpeg)
        );
        if (!blob) throw new Error(`Failed to encode page ${i}.`);
        zip.file(`${baseName}-page-${String(i).padStart(3, "0")}.jpg`, blob);
        setProgress({ done: i, total });
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      setDownloadUrl(URL.createObjectURL(zipBlob));
      setDownloadName(`${baseName}-pages.zip`);
    } catch (e) {
      setError(e instanceof Error ? `Failed: ${e.message}` : "Conversion failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">PDF to JPG</h1>
        <p className="mt-3 text-gray-600">
          Export each PDF page as a JPG image. Browser-side, your file never uploads.
        </p>
      </div>

      <ToolUploadZone
        accept=".pdf"
        multiple={false}
        maxSizeMB={100}
        onFilesSelected={handleFilesSelected}
        label="Drop a PDF here or click to choose"
        sublabel="Single PDF up to 100MB. Multi-page PDFs download as ZIP."
      />

      {files.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm font-semibold text-gray-900 mb-3">Image quality</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {(Object.keys(QUALITY) as Quality[]).map((q) => {
              const info = QUALITY[q];
              return (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`p-3 rounded-xl border text-left transition ${
                    quality === q
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <p className={`text-sm font-semibold ${quality === q ? "text-emerald-700" : "text-gray-900"}`}>{info.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{info.desc}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={convert}
            disabled={processing || !pdfjsReady}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition disabled:opacity-70"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {progress.total > 0 ? `Rendering page ${progress.done}/${progress.total}…` : "Reading PDF…"}
              </>
            ) : !pdfjsReady ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Loading PDF reader…</>
            ) : (
              <><ImageIcon className="w-4 h-4" /> Convert to JPG</>
            )}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {downloadUrl && (
        <a
          href={downloadUrl}
          download={downloadName}
          className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition"
        >
          <Download className="w-4 h-4" /> Download {downloadName}
        </a>
      )}

    </div>
  );
}
