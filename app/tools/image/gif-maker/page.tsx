"use client";

import { useState, useRef } from "react";
import { Film, Upload, Download, X, GripVertical } from "lucide-react";

type Frame = { id: string; src: string; name: string };

export default function GifMakerPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [delayMs, setDelayMs] = useState(200);
  const [loopCount, setLoopCount] = useState(0); // 0 = infinite
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [quality, setQuality] = useState(10); // 1-30, lower = better quality, larger size
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const addFiles = (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const newFrames: Frame[] = [];
    let processed = 0;
    list.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        newFrames.push({ id: crypto.randomUUID(), src: reader.result as string, name: file.name });
        processed++;
        if (processed === list.length) {
          setFrames((f) => [...f, ...newFrames]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFrame = (id: string) => setFrames((f) => f.filter((x) => x.id !== id));

  const moveFrame = (from: number, to: number) => {
    setFrames((f) => {
      const arr = [...f];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
  };

  const generate = async () => {
    if (frames.length < 2) {
      setError("Need at least 2 frames to make a GIF");
      return;
    }
    setError(null);
    setGenerating(true);
    setProgress(0);
    setOutputUrl(null);

    try {
      // Load all frames to determine dimensions
      const images = await Promise.all(frames.map((f) => new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load ${f.name}`));
        img.src = f.src;
      })));

      const targetW = width > 0 ? width : images[0].naturalWidth;
      const targetH = height > 0 ? height : images[0].naturalHeight;

      // Dynamic import to avoid SSR issues
      const GIFModule = await import("gif.js");
      const GIF = (GIFModule as unknown as { default: new (opts: Record<string, unknown>) => unknown }).default;

      // Worker script must be a blob URL or absolute URL for cross-origin reasons
      const gif = new (GIF as new (opts: Record<string, unknown>) => {
        addFrame: (img: HTMLCanvasElement, opts: { delay: number }) => void;
        on: (event: string, cb: (data: number | Blob) => void) => void;
        render: () => void;
      })({
        workers: 2,
        quality,
        width: targetW,
        height: targetH,
        workerScript: "/lib/gif.worker.js",
        repeat: loopCount, // 0 = forever
      });

      for (const img of images) {
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        // Fit image (contain mode, white background)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetW, targetH);
        const ratio = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight);
        const dw = img.naturalWidth * ratio;
        const dh = img.naturalHeight * ratio;
        ctx.drawImage(img, (targetW - dw) / 2, (targetH - dh) / 2, dw, dh);
        gif.addFrame(canvas, { delay: delayMs });
      }

      gif.on("progress", (p) => setProgress(Math.round((p as number) * 100)));
      gif.on("finished", (blob) => {
        setOutputUrl(URL.createObjectURL(blob as Blob));
        setGenerating(false);
      });
      gif.render();
    } catch (e) {
      setError(e instanceof Error ? e.message : "GIF generation failed");
      setGenerating(false);
    }
  };

  const download = () => {
    if (!outputUrl) return;
    const a = document.createElement("a");
    a.href = outputUrl;
    a.download = "animated.gif";
    a.click();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Film className="w-7 h-7 text-indigo-600" /> GIF Maker
        </h1>
        <p className="mt-3 text-gray-600">
          Multiple images → animated GIF. Drag to reorder, set frame delay, loop count. Browser-side via gif.js Web Worker.
        </p>
      </div>

      <label
        className="block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-400 transition mb-6"
        style={{ borderColor: "var(--color-border)" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); }}
      >
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles(e.target.files); }} />
        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
        <p className="font-semibold text-gray-900 text-sm">Drop or click to add frame images</p>
        <p className="text-xs text-gray-500 mt-1">Add 2+ images. PNG / JPG / WebP. Order matters — drag to reorder below.</p>
      </label>

      {frames.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">{frames.length} frame{frames.length === 1 ? "" : "s"} — drag to reorder</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {frames.map((frame, idx) => (
                <div
                  key={frame.id}
                  draggable
                  onDragStart={() => { dragIndexRef.current = idx; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => { if (dragIndexRef.current !== null && dragIndexRef.current !== idx) moveFrame(dragIndexRef.current, idx); dragIndexRef.current = null; }}
                  className="relative group rounded-lg border bg-white p-1 cursor-grab active:cursor-grabbing"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={frame.src} alt={frame.name} className="w-full aspect-square object-cover rounded" />
                  <div className="absolute top-1 left-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/50 text-white">
                    <GripVertical className="w-2.5 h-2.5" /> {idx + 1}
                  </div>
                  <button onClick={() => removeFrame(frame.id)} className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-sm font-semibold text-gray-900">Settings</p>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Frame delay: {delayMs}ms ({(1000 / delayMs).toFixed(1)} fps)</label>
                <input type="range" min={20} max={2000} step={20} value={delayMs} onChange={(e) => setDelayMs(parseInt(e.target.value, 10))} className="w-full accent-indigo-600" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Loop: {loopCount === 0 ? "Forever" : `${loopCount} time${loopCount === 1 ? "" : "s"}`}</label>
                <input type="range" min={0} max={10} value={loopCount} onChange={(e) => setLoopCount(parseInt(e.target.value, 10))} className="w-full accent-indigo-600" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Width (px)</label>
                  <input type="number" min={0} max={2000} placeholder="auto" value={width || ""} onChange={(e) => setWidth(parseInt(e.target.value, 10) || 0)} className="w-full rounded-lg border px-2 py-1.5 text-sm font-mono focus:border-indigo-500 focus:outline-none" style={{ borderColor: "var(--color-border)" }} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Height (px)</label>
                  <input type="number" min={0} max={2000} placeholder="auto" value={height || ""} onChange={(e) => setHeight(parseInt(e.target.value, 10) || 0)} className="w-full rounded-lg border px-2 py-1.5 text-sm font-mono focus:border-indigo-500 focus:outline-none" style={{ borderColor: "var(--color-border)" }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Quality: {quality} (lower = better, larger file)</label>
                <input type="range" min={1} max={30} value={quality} onChange={(e) => setQuality(parseInt(e.target.value, 10))} className="w-full accent-indigo-600" />
              </div>
            </div>

            {!generating && !outputUrl && (
              <button onClick={generate} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 text-sm font-semibold">
                <Film className="w-4 h-4" /> Generate GIF
              </button>
            )}

            {generating && (
              <div className="rounded-2xl border bg-white p-5 space-y-2" style={{ borderColor: "var(--color-border)" }}>
                <p className="text-sm font-semibold text-gray-900">Encoding... {progress}%</p>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {outputUrl && (
              <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
                <p className="text-sm font-semibold text-gray-900">Result</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={outputUrl} alt="animated GIF" className="w-full rounded-lg border" style={{ borderColor: "var(--color-border)" }} />
                <button onClick={download} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-sm font-semibold">
                  <Download className="w-4 h-4" /> Download GIF
                </button>
                <button onClick={() => { setOutputUrl(null); setProgress(0); }} className="w-full text-xs text-gray-500 hover:text-gray-700">
                  Make another
                </button>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
