"use client";

import { useState, useCallback } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { Loader2, Download, Stamp } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

type Position = "diagonal" | "center" | "bottom";

export default function WatermarkPDFPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(60);
  const [position, setPosition] = useState<Position>("diagonal");
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setDownloadUrl(null);
    setError(null);
  }, []);

  const apply = async () => {
    if (files.length === 0) {
      setError("Please select a PDF.");
      return;
    }
    if (!text.trim()) {
      setError("Watermark text cannot be empty.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const buf = await files[0].file.arrayBuffer();
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const op = Math.max(0, Math.min(1, opacity / 100));

      pdf.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = fontSize;

        let x = 0, y = 0, rotation = 0;
        if (position === "diagonal") {
          rotation = 45;
          x = (width - textWidth * Math.cos(Math.PI / 4)) / 2;
          y = (height - textWidth * Math.sin(Math.PI / 4)) / 2;
        } else if (position === "center") {
          x = (width - textWidth) / 2;
          y = (height - textHeight) / 2;
        } else {
          x = (width - textWidth) / 2;
          y = 50;
        }

        page.drawText(text, {
          x, y,
          size: fontSize,
          font,
          color: rgb(0.7, 0.1, 0.1),
          opacity: op,
          rotate: degrees(rotation),
        });
      });

      const bytes = await pdf.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? `Failed: ${e.message}` : "Watermark failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Watermark PDF</h1>
        <p className="mt-3 text-gray-600">
          Add a text watermark to every page of a PDF. Browser-side, no upload.
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
        <div className="mt-6 rounded-2xl border bg-white p-5 space-y-5" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Watermark text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={50}
              className="w-full rounded-xl border px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Opacity: {opacity}%
            </label>
            <input
              type="range"
              min="10" max="100" step="5"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Font size: {fontSize}pt
            </label>
            <input
              type="range"
              min="20" max="120" step="4"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: "diagonal" as const, label: "Diagonal" },
                { id: "center" as const, label: "Center" },
                { id: "bottom" as const, label: "Bottom" },
              ]).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPosition(p.id)}
                  className={`p-3 rounded-xl border text-sm transition ${
                    position === p.id
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={apply}
            disabled={processing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition disabled:opacity-70"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Applying…</>
            ) : (
              <><Stamp className="w-4 h-4" /> Apply watermark</>
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
          download="watermarked.pdf"
          className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition"
        >
          <Download className="w-4 h-4" /> Download watermarked.pdf
        </a>
      )}

    </div>
  );
}
