"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Loader2, Download, ArrowUp, ArrowDown, X } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

type PageSize = "a4" | "letter" | "fit";

const PAGE_DIMENSIONS: Record<PageSize, [number, number] | null> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
  fit: null,
};

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setDownloadUrl(null);
    setError(null);
  }, []);

  const moveFile = (idx: number, dir: -1 | 1) => {
    const newFiles = [...files];
    const target = idx + dir;
    if (target < 0 || target >= files.length) return;
    [newFiles[idx], newFiles[target]] = [newFiles[target], newFiles[idx]];
    setFiles(newFiles);
    setDownloadUrl(null);
  };

  const removeFile = (id: string) => {
    setFiles((f) => f.filter((x) => x.id !== id));
    setDownloadUrl(null);
  };

  const convert = async () => {
    if (files.length === 0) {
      setError("Please select at least one image.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const pdf = await PDFDocument.create();
      for (const { file } of files) {
        const buf = await file.arrayBuffer();
        const isJpg = /\.(jpe?g)$/i.test(file.name) || file.type === "image/jpeg";
        const img = isJpg
          ? await pdf.embedJpg(buf)
          : await pdf.embedPng(buf);

        const dims = PAGE_DIMENSIONS[pageSize];
        let pageW: number, pageH: number, drawW: number, drawH: number, x = 0, y = 0;

        if (dims) {
          [pageW, pageH] = dims;
          // Fit image inside page with margin 10pt
          const margin = 20;
          const maxW = pageW - 2 * margin;
          const maxH = pageH - 2 * margin;
          const scale = Math.min(maxW / img.width, maxH / img.height, 1);
          drawW = img.width * scale;
          drawH = img.height * scale;
          x = (pageW - drawW) / 2;
          y = (pageH - drawH) / 2;
        } else {
          pageW = img.width;
          pageH = img.height;
          drawW = pageW;
          drawH = pageH;
        }

        const page = pdf.addPage([pageW, pageH]);
        page.drawImage(img, { x, y, width: drawW, height: drawH });
      }
      const out = await pdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? `Failed: ${e.message}` : "Conversion failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">JPG to PDF</h1>
        <p className="mt-3 text-gray-600">
          Combine images (JPG, PNG) into a single PDF. Choose page size, drag to reorder.
        </p>
      </div>

      <ToolUploadZone
        accept=".jpg,.jpeg,.png"
        multiple={true}
        maxSizeMB={50}
        onFilesSelected={handleFilesSelected}
        label="Drop images here or click to choose"
        sublabel="JPG / PNG up to 50MB each. Multiple images allowed."
      />

      {files.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm font-semibold text-gray-900 mb-3">Page size</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {([
              { id: "a4" as const, label: "A4", desc: "210×297mm" },
              { id: "letter" as const, label: "Letter", desc: "8.5×11 in" },
              { id: "fit" as const, label: "Fit image", desc: "exact size" },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPageSize(opt.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  pageSize === opt.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <p className={`text-sm font-semibold ${pageSize === opt.id ? "text-emerald-700" : "text-gray-900"}`}>{opt.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>

          <p className="text-sm font-semibold text-gray-900 mb-2">Order ({files.length} images)</p>
          <ul className="space-y-2 mb-5">
            {files.map((f, idx) => (
              <li
                key={f.id}
                className="flex items-center gap-3 rounded-xl px-4 py-2 border bg-gray-50"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span className="text-xs font-mono text-gray-500 w-6">{idx + 1}.</span>
                <span className="flex-1 text-sm truncate">{f.file.name}</span>
                <button onClick={() => moveFile(idx, -1)} disabled={idx === 0} className="p-1 text-gray-400 hover:text-emerald-600 disabled:opacity-30" aria-label="Up">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveFile(idx, 1)} disabled={idx === files.length - 1} className="p-1 text-gray-400 hover:text-emerald-600 disabled:opacity-30" aria-label="Down">
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button onClick={() => removeFile(f.id)} className="p-1 text-gray-400 hover:text-red-500" aria-label="Remove">
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={convert}
            disabled={processing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition disabled:opacity-70"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Converting…</>
            ) : (
              "Convert to PDF"
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
          download="images.pdf"
          className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition"
        >
          <Download className="w-4 h-4" /> Download images.pdf
        </a>
      )}

    </div>
  );
}
