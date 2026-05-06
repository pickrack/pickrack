"use client";

import { useState, useCallback, useEffect } from "react";
import { Loader2, Download, Sparkles, Info } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

export default function BackgroundRemoverPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [downloadName, setDownloadName] = useState("no-background.png");
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setError(null);
    if (uploaded.length === 0) {
      setOriginalUrl(null);
      return;
    }
    setOriginalUrl(URL.createObjectURL(uploaded[0].file));
    setDownloadName(uploaded[0].file.name.replace(/\.[^.]+$/, "") + "-no-bg.png");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async () => {
    if (files.length === 0) {
      setError("Please select an image.");
      return;
    }
    setProcessing(true);
    setError(null);
    setStage("Loading AI model (first-time use downloads ~30MB, then cached)…");
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    try {
      const { removeBackground } = await import("@imgly/background-removal");
      setStage("Processing image with AI…");
      const blob = await removeBackground(files[0].file, {
        progress: (key, current, total) => {
          if (key.includes("download")) {
            setStage(`Downloading model: ${Math.round((current / total) * 100)}%`);
          } else {
            setStage(`Processing: ${key}…`);
          }
        },
      });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultSize(blob.size);
      setStage("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Background removal failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">AI Background Remover</h1>
        <p className="mt-3 text-gray-600">Remove image background with AI in your browser. No upload, no signup, no daily limit.</p>
      </div>

      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-start gap-3 text-sm text-blue-900">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
        <div>
          <p className="font-medium">First use: ~30MB AI model downloads to your browser cache</p>
          <p className="mt-1 text-blue-800">
            After the model is cached, processing is instant. Your image never uploads — verifiable in DevTools → Network. Only the model files load (once, from CDN).
          </p>
        </div>
      </div>

      <ToolUploadZone
        accept="image/jpeg,image/png,image/webp"
        multiple={false}
        maxSizeMB={20}
        onFilesSelected={handleFilesSelected}
        label="Drop an image here or click to choose"
        sublabel="JPG, PNG, WebP up to 20MB. Best results: clear subject vs background."
      />

      {originalUrl && (
        <>
          <div className="grid gap-4 lg:grid-cols-2 mt-6">
            <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-sm font-semibold text-gray-900 mb-2">Original</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={originalUrl} alt="Original" className="w-full max-h-[400px] object-contain rounded-lg" />
            </div>

            <div
              className="rounded-2xl border-2 border-dashed border-amber-300 p-4 bg-[length:20px_20px] bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%)] bg-[position:0_0,10px_10px]"
            >
              <p className="text-sm font-semibold text-gray-900 mb-2 bg-white inline-block px-2 py-0.5 rounded">No background</p>
              {resultUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={resultUrl} alt="Background removed" className="w-full max-h-[400px] object-contain rounded-lg" />
              ) : (
                <div className="w-full h-[200px] flex items-center justify-center text-gray-700 text-sm bg-white/70 rounded-lg">
                  {processing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Click Remove background"}
                </div>
              )}
            </div>
          </div>

          {!resultUrl && !processing && (
            <button
              onClick={remove}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 transition"
            >
              <Sparkles className="w-4 h-4" /> Remove background
            </button>
          )}

          {processing && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-amber-700 mx-auto mb-2" />
              <p className="text-sm text-amber-900 font-medium">{stage || "Processing…"}</p>
              <p className="text-xs text-amber-700 mt-1">First-time use takes 30-60 seconds while the model downloads. Subsequent images are 5-15 seconds.</p>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          {resultUrl && (
            <a
              href={resultUrl}
              download={downloadName}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 transition"
            >
              <Download className="w-4 h-4" /> Download {downloadName} ({formatBytes(resultSize)})
            </a>
          )}
        </>
      )}
    </div>
  );
}
