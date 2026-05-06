"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Loader2, Download, Scissors } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

function parseRange(input: string, total: number): number[] | string {
  // Parse "1-3, 5, 7-10" → [0, 1, 2, 4, 6, 7, 8, 9] (0-indexed)
  const trimmed = input.trim();
  if (!trimmed) return "Please enter a page range.";
  const out = new Set<number>();
  const parts = trimmed.split(/[,\s]+/).filter(Boolean);
  for (const part of parts) {
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) return `Invalid token "${part}". Use format like 1-3, 5, 7-10.`;
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;
    if (start < 1 || end < 1 || start > total || end > total) {
      return `Page out of range (1-${total}).`;
    }
    if (start > end) return `Invalid range "${part}" — start greater than end.`;
    for (let i = start; i <= end; i++) out.add(i - 1);
  }
  return Array.from(out).sort((a, b) => a - b);
}

export default function SplitPDFPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [range, setRange] = useState("");
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback(async (uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setDownloadUrl(null);
    setError(null);
    setPageCount(null);
    if (uploaded[0]) {
      try {
        const buf = await uploaded[0].file.arrayBuffer();
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        setPageCount(pdf.getPageCount());
      } catch (e) {
        setError(e instanceof Error ? `Failed to read PDF: ${e.message}` : "Failed to read PDF.");
      }
    }
  }, []);

  const split = async () => {
    if (files.length === 0 || !pageCount) {
      setError("Please select a PDF first.");
      return;
    }
    const indices = parseRange(range, pageCount);
    if (typeof indices === "string") {
      setError(indices);
      return;
    }
    if (indices.length === 0) {
      setError("No pages selected.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const buf = await files[0].file.arrayBuffer();
      const src = await PDFDocument.load(buf, { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? `Failed: ${e.message}` : "Split failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Split PDF</h1>
        <p className="mt-3 text-gray-600">
          Extract specific pages from a PDF. Browser-side, your file never uploads.
        </p>
      </div>

      <ToolUploadZone
        accept=".pdf"
        multiple={false}
        maxSizeMB={200}
        onFilesSelected={handleFilesSelected}
        label="Drop a PDF here or click to choose"
        sublabel="Single PDF up to 200MB"
      />

      {pageCount !== null && (
        <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm text-gray-600 mb-3">
            PDF has <strong className="text-gray-900">{pageCount} pages</strong>. Specify which to extract:
          </p>
          <input
            type="text"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="e.g. 1-3, 5, 7-10"
            className="w-full rounded-xl border px-4 py-3 text-sm font-mono focus:border-emerald-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
          <p className="text-xs text-gray-500 mt-2">
            Format: comma-separated. Use <code className="bg-gray-100 px-1 rounded">1-3</code> for ranges, <code className="bg-gray-100 px-1 rounded">5</code> for single pages.
          </p>

          <button
            onClick={split}
            disabled={processing || !range.trim()}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition disabled:opacity-50"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Extracting…</>
            ) : (
              <><Scissors className="w-4 h-4" /> Extract pages</>
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
          download="extracted.pdf"
          className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition"
        >
          <Download className="w-4 h-4" /> Download extracted.pdf
        </a>
      )}

    </div>
  );
}
