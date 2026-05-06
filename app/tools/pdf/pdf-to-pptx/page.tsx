"use client";

import { useState, useCallback } from "react";
import { Loader2, Download, Presentation, AlertTriangle, Info } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

export default function PDFtoPPTXPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("converted.pptx");
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setDownloadUrl(null);
    setError(null);
  }, []);

  const convert = async () => {
    if (files.length === 0) {
      setError("Please select a PDF.");
      return;
    }
    setProcessing(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const fd = new FormData();
      fd.append("file", files[0].file);
      const res = await fetch("/api/pdf/pdf-to-pptx/", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }
      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName(files[0].file.name.replace(/\.pdf$/i, ".pptx"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">PDF to PowerPoint</h1>
        <p className="mt-3 text-gray-600">
          Convert each PDF page into a slide. Image-per-slide approach — text won&apos;t be editable, but layout is preserved exactly. Free, no signup, no watermark.
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-start gap-3 text-sm text-blue-900">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
        <div>
          <p className="font-medium">How this works</p>
          <p className="mt-1 text-blue-800">
            Each PDF page is rendered as a high-resolution image and embedded in a 16:9 slide. This is the most reliable approach across PowerPoint, Keynote, and Google Slides — text-extraction PDF→PPTX rarely produces clean results. If you need editable text, try{" "}
            <a className="underline hover:text-blue-700" href="/tools/pdf/pdf-to-word/">PDF to Word</a> instead.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3 text-sm text-amber-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div>
          <p className="font-medium">Server-side processing</p>
          <p className="mt-1 text-amber-800">
            Your PDF uploads over HTTPS, gets rendered by Poppler, then deleted immediately. Max 200 pages per conversion.
          </p>
        </div>
      </div>

      <ToolUploadZone
        accept=".pdf"
        multiple={false}
        maxSizeMB={30}
        onFilesSelected={handleFilesSelected}
        label="Drop a PDF here or click to choose"
        sublabel="Single PDF up to 30MB, max 200 pages"
      />

      {files.length > 0 && !downloadUrl && (
        <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <button
            onClick={convert}
            disabled={processing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition disabled:opacity-70"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Converting…</>
            ) : (
              <><Presentation className="w-4 h-4" /> Convert to PowerPoint</>
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
