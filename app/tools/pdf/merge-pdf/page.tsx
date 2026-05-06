"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Loader2, Download, ArrowUp, ArrowDown, X } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

export default function MergePDFPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
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

  const merge = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const merged = await PDFDocument.create();
      for (const { file } of files) {
        const buf = await file.arrayBuffer();
        const src = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const out = await merged.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? `Failed: ${e.message}` : "Merge failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Merge PDF</h1>
        <p className="mt-3 text-gray-600">
          Combine multiple PDFs into one. Drag to reorder. Files never leave your browser.
        </p>
      </div>

      <ToolUploadZone
        accept=".pdf"
        multiple={true}
        maxSizeMB={200}
        onFilesSelected={handleFilesSelected}
        label="Drop PDF files here or click to choose"
        sublabel="Select 2 or more PDFs (up to 200MB each). Order them below."
      />

      {files.length > 1 && (
        <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Order ({files.length} files)
          </p>
          <ul className="space-y-2">
            {files.map((f, idx) => (
              <li
                key={f.id}
                className="flex items-center gap-3 rounded-xl px-4 py-2 border bg-gray-50"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span className="text-xs font-mono text-gray-500 w-6">{idx + 1}.</span>
                <span className="flex-1 text-sm truncate">{f.file.name}</span>
                <button
                  onClick={() => moveFile(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 rounded text-gray-400 hover:text-emerald-600 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveFile(idx, 1)}
                  disabled={idx === files.length - 1}
                  className="p-1 rounded text-gray-400 hover:text-emerald-600 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeFile(f.id)}
                  className="p-1 rounded text-gray-400 hover:text-red-500"
                  aria-label="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={merge}
            disabled={processing}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition disabled:opacity-70"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Merging…</>
            ) : (
              "Merge PDFs"
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
          download="merged.pdf"
          className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition"
        >
          <Download className="w-4 h-4" /> Download merged.pdf
        </a>
      )}

    </div>
  );
}
