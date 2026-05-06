"use client";

import { useState, useCallback } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { Loader2, Download, RotateCw } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

type Angle = 90 | 180 | 270;

export default function RotatePDFPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [angle, setAngle] = useState<Angle>(90);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setDownloadUrl(null);
    setError(null);
  }, []);

  const rotate = async () => {
    if (files.length === 0) {
      setError("Please select a PDF file.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const buf = await files[0].file.arrayBuffer();
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
      pdf.getPages().forEach((page) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      });
      const out = await pdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? `Failed: ${e.message}` : "Rotate failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Rotate PDF</h1>
        <p className="mt-3 text-gray-600">
          Rotate all pages of a PDF by 90°, 180°, or 270°. Browser-side, no upload.
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

      {files.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm font-semibold text-gray-900 mb-3">Rotation angle</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {([90, 180, 270] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAngle(a)}
                className={`p-3 rounded-xl border text-center transition ${
                  angle === a
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                {a}°
              </button>
            ))}
          </div>

          <button
            onClick={rotate}
            disabled={processing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition disabled:opacity-70"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Rotating…</>
            ) : (
              <><RotateCw className="w-4 h-4" /> Rotate by {angle}°</>
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
          download="rotated.pdf"
          className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition"
        >
          <Download className="w-4 h-4" /> Download rotated.pdf
        </a>
      )}

    </div>
  );
}
