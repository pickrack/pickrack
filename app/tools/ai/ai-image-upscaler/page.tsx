"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Upload, Download, Loader2, AlertCircle, Cpu } from "lucide-react";

type Status = "idle" | "uploading" | "running" | "done" | "error";

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Strip prefix "data:image/...;base64,"
      const b64 = dataUrl.split(",")[1];
      resolve(b64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function loadImageDimensions(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src;
  });
}

export default function AiImageUpscalerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<{ w: number; h: number } | null>(null);
  const [scale, setScale] = useState<2 | 4>(4);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputInfo, setOutputInfo] = useState<{ w: number; h: number; seconds: number } | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [gpuOnline, setGpuOnline] = useState<boolean | null>(null);
  const elapsedRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/ai/qr-art/")
      .then((r) => r.json())
      .then((d: { local?: { ready?: boolean } }) => setGpuOnline(d.local?.ready === true))
      .catch(() => setGpuOnline(false));
  }, []);

  const handleFile = async (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (f.size > 6 * 1024 * 1024) {
      setError("Image too large. Max ~6MB. Try compressing first.");
      return;
    }
    setError(null);
    setOutputUrl(null);
    setOutputInfo(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    try {
      const dims = await loadImageDimensions(url);
      setPreviewSize(dims);
      if (dims.w * dims.h > 1500 * 1500) {
        setError(`Large image (${dims.w}×${dims.h}). It will be pre-resized to fit GPU memory before upscaling.`);
      }
    } catch {
      setError("Could not read image dimensions");
    }
  };

  const upscale = async () => {
    if (!file) return;
    setStatus("uploading");
    setError(null);
    setOutputUrl(null);

    try {
      const b64 = await fileToBase64(file);
      setStatus("running");
      const start = Date.now();
      elapsedRef.current = setInterval(() => setElapsedMs(Date.now() - start), 250);

      const res = await fetch("/api/ai/upscale/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageB64: b64, scale }),
      });

      if (elapsedRef.current) clearInterval(elapsedRef.current);

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        setError(data.error || `Failed (${res.status})`);
        setStatus("error");
        return;
      }

      const data = await res.json();
      setOutputUrl(data.imageUrl);
      setOutputInfo({
        w: data.outputWidth,
        h: data.outputHeight,
        seconds: data.upscaleSeconds,
      });
      setStatus("done");
    } catch (e) {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      setError(e instanceof Error ? e.message : "Network error");
      setStatus("error");
    }
  };

  const downloadOutput = async () => {
    if (!outputUrl || !file) return;
    try {
      const res = await fetch(outputUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const base = file.name.replace(/\.[^.]+$/, "");
      a.download = `${base}-${scale}x.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(outputUrl, "_blank");
    }
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setPreviewSize(null);
    setOutputUrl(null);
    setOutputInfo(null);
    setStatus("idle");
    setError(null);
    setElapsedMs(0);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Sparkles className="w-7 h-7 text-violet-600" /> AI Image Upscaler
        </h1>
        <p className="mt-3 text-gray-600">
          Swin2SR transformer upscales images 2× or 4× with detail enhancement. Better than bicubic for photos. Self-hosted GPU.
        </p>
        {gpuOnline !== null && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold ${gpuOnline ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              <Cpu className="w-3.5 h-3.5" />
              {gpuOnline ? "GPU online · self-hosted · free" : "GPU offline — operator's PC is down"}
            </span>
          </div>
        )}
      </div>

      {!file ? (
        <label
          className="block border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer hover:border-violet-400 transition"
          style={{ borderColor: "var(--color-border)" }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        >
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="font-semibold text-gray-900">Drop or click to upload image</p>
          <p className="text-xs text-gray-500 mt-1">JPG / PNG / WebP. Max ~6MB. Ideal: under 1500×1500 for fastest result.</p>
        </label>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {/* Original preview */}
            <div className="rounded-2xl border bg-white p-3" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between mb-2 px-2">
                <p className="text-xs font-semibold text-gray-700">
                  Original {previewSize && <span className="text-gray-500 font-normal">· {previewSize.w}×{previewSize.h}px</span>}
                </p>
                <button onClick={reset} className="text-xs text-red-600 hover:text-red-700">Change image</button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {previewUrl && <img src={previewUrl} alt="original" className="w-full max-h-[500px] object-contain bg-gray-50 rounded-lg" />}
            </div>

            {/* Output */}
            {outputUrl && outputInfo && (
              <div className="rounded-2xl border bg-white p-3" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center justify-between mb-2 px-2">
                  <p className="text-xs font-semibold text-emerald-700">
                    Upscaled · {outputInfo.w}×{outputInfo.h}px · {outputInfo.seconds}s
                  </p>
                  <span className="text-xs text-gray-500">
                    {previewSize && `+${(((outputInfo.w * outputInfo.h) / (previewSize.w * previewSize.h)) - 1) * 100 | 0}% pixels`}
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={outputUrl} alt="upscaled" className="w-full max-h-[500px] object-contain bg-gray-50 rounded-lg" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 space-y-3 sticky top-20" style={{ borderColor: "var(--color-border)" }}>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Upscale factor</label>
                <div className="inline-flex rounded-lg border p-1 bg-gray-50 w-full" style={{ borderColor: "var(--color-border)" }}>
                  <button onClick={() => setScale(2)} className={`flex-1 px-3 py-1.5 text-xs font-medium rounded ${scale === 2 ? "bg-white shadow-sm text-violet-700" : "text-gray-600"}`}>
                    2× (~{previewSize ? `${previewSize.w * 2}×${previewSize.h * 2}` : "..."})
                  </button>
                  <button onClick={() => setScale(4)} className={`flex-1 px-3 py-1.5 text-xs font-medium rounded ${scale === 4 ? "bg-white shadow-sm text-violet-700" : "text-gray-600"}`}>
                    4× (~{previewSize ? `${previewSize.w * 4}×${previewSize.h * 4}` : "..."})
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Swin2SR is trained for 4×. 2× is downsampled after — still better than bicubic 2×, but 4× shows the biggest quality boost.
                </p>
              </div>

              {status !== "running" && status !== "uploading" && (
                <button
                  onClick={upscale}
                  disabled={!gpuOnline}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 text-sm font-semibold disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" /> Upscale {scale}×
                </button>
              )}

              {(status === "uploading" || status === "running") && (
                <div className="rounded-lg border bg-gray-50 p-3" style={{ borderColor: "var(--color-border)" }}>
                  <div className="inline-flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                    {status === "uploading" ? "Sending image..." : `Running Swin2SR... ${(elapsedMs / 1000).toFixed(1)}s`}
                  </div>
                </div>
              )}

              {outputUrl && (
                <button
                  onClick={downloadOutput}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-sm font-semibold"
                >
                  <Download className="w-4 h-4" /> Download upscaled PNG
                </button>
              )}

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
