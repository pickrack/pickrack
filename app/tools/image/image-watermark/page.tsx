"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Stamp, Upload, Download, Type, ImageIcon, RotateCcw } from "lucide-react";

type Mode = "text" | "image";
type Position = "tl" | "tr" | "bl" | "br" | "center" | "tile";

export default function ImageWatermarkPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [srcName, setSrcName] = useState("");
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("© Your Brand");
  const [fontSize, setFontSize] = useState(48);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [overlay, setOverlay] = useState<string | null>(null);
  const [overlayScale, setOverlayScale] = useState(20);
  const [opacity, setOpacity] = useState(60);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState<Position>("br");
  const [margin, setMargin] = useState(24);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleSrcFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(reader.result as string);
      setSrcName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleOverlayFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setOverlay(reader.result as string);
    reader.readAsDataURL(file);
  };

  const draw = useCallback(async () => {
    if (!src || !canvasRef.current) return;

    const img = new window.Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("load failed"));
      img.src = src;
    });

    const canvas = canvasRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    ctx.globalAlpha = opacity / 100;

    if (mode === "text" && text.trim()) {
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = fontColor;
      ctx.textBaseline = "top";
      drawMarks(ctx, canvas.width, canvas.height, position, margin, rotation, (x, y) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }, () => ctx.measureText(text).width, () => fontSize * 1.2);
    } else if (mode === "image" && overlay) {
      const overlayImg = new window.Image();
      await new Promise<void>((resolve, reject) => {
        overlayImg.onload = () => resolve();
        overlayImg.onerror = () => reject(new Error("overlay load failed"));
        overlayImg.src = overlay;
      });
      const targetW = (canvas.width * overlayScale) / 100;
      const targetH = (overlayImg.naturalHeight / overlayImg.naturalWidth) * targetW;
      drawMarks(ctx, canvas.width, canvas.height, position, margin, rotation, (x, y) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(overlayImg, 0, 0, targetW, targetH);
        ctx.restore();
      }, () => targetW, () => targetH);
    }

    ctx.globalAlpha = 1;
    setOutputUrl(canvas.toDataURL("image/png"));
  }, [src, mode, text, fontSize, fontColor, overlay, overlayScale, opacity, rotation, position, margin]);

  useEffect(() => { draw(); }, [draw]);

  const download = () => {
    if (!outputUrl) return;
    const a = document.createElement("a");
    a.href = outputUrl;
    const base = srcName.replace(/\.[^.]+$/, "");
    a.download = `${base || "image"}-watermarked.png`;
    a.click();
  };

  const reset = () => {
    setSrc(null); setSrcName("");
    setOverlay(null);
    setOutputUrl(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Stamp className="w-7 h-7 text-indigo-600" /> Image Watermark
        </h1>
        <p className="mt-3 text-gray-600">
          Add text or image watermark to a photo. 6 position presets + opacity + rotation. Browser-side, no upload.
        </p>
      </div>

      {!src ? (
        <label
          className="block border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 transition"
          style={{ borderColor: "var(--color-border)" }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleSrcFile(f); }}
        >
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSrcFile(f); }} />
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="font-semibold text-gray-900">Drop or click to upload source image</p>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP. Stays in your browser.</p>
        </label>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-sm font-semibold text-gray-900">Watermark type</p>
              <div className="inline-flex rounded-lg border p-1 bg-gray-50 w-full" style={{ borderColor: "var(--color-border)" }}>
                <button onClick={() => setMode("text")} className={`flex-1 px-3 py-1.5 text-xs font-medium rounded inline-flex items-center justify-center gap-1 ${mode === "text" ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}>
                  <Type className="w-3.5 h-3.5" /> Text
                </button>
                <button onClick={() => setMode("image")} className={`flex-1 px-3 py-1.5 text-xs font-medium rounded inline-flex items-center justify-center gap-1 ${mode === "image" ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}>
                  <ImageIcon className="w-3.5 h-3.5" /> Image
                </button>
              </div>

              {mode === "text" && (
                <>
                  <Field label="Text" value={text} onChange={setText} />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Font size</label>
                      <input type="number" min={8} max={200} value={fontSize} onChange={(e) => setFontSize(Math.max(8, parseInt(e.target.value, 10) || 48))} className="w-full rounded-lg border px-2 py-1.5 text-sm font-mono focus:border-indigo-500 focus:outline-none" style={{ borderColor: "var(--color-border)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Color</label>
                      <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="w-full h-9 rounded-lg border cursor-pointer" style={{ borderColor: "var(--color-border)" }} />
                    </div>
                  </div>
                </>
              )}

              {mode === "image" && (
                <>
                  {!overlay ? (
                    <label className="block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-indigo-400" style={{ borderColor: "var(--color-border)" }}>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleOverlayFile(f); }} />
                      <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs font-medium text-gray-900">Upload logo</p>
                    </label>
                  ) : (
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={overlay} alt="logo" className="w-16 h-16 object-contain border rounded bg-white" style={{ borderColor: "var(--color-border)" }} />
                      <button onClick={() => setOverlay(null)} className="text-xs text-red-600 hover:text-red-700">Remove</button>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Logo scale: {overlayScale}%</label>
                    <input type="range" min={5} max={80} value={overlayScale} onChange={(e) => setOverlayScale(parseInt(e.target.value, 10))} className="w-full accent-indigo-600" />
                  </div>
                </>
              )}
            </div>

            <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Position</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {([["tl","↖"],["tr","↗"],["bl","↙"],["br","↘"],["center","●"],["tile","▦"]] as const).map(([p, label]) => (
                    <button key={p} onClick={() => setPosition(p)} className={`p-2 rounded-lg border text-sm transition ${position === p ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-white"}`} style={{ borderColor: position === p ? undefined : "var(--color-border)" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Opacity: {opacity}%</label>
                <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value, 10))} className="w-full accent-indigo-600" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Rotation: {rotation}°</label>
                <input type="range" min={-45} max={45} step={1} value={rotation} onChange={(e) => setRotation(parseInt(e.target.value, 10))} className="w-full accent-indigo-600" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Margin: {margin}px</label>
                <input type="range" min={0} max={100} value={margin} onChange={(e) => setMargin(parseInt(e.target.value, 10))} className="w-full accent-indigo-600" />
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={download} disabled={!outputUrl} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
                <Download className="w-4 h-4" /> Download
              </button>
              <button onClick={reset} className="inline-flex items-center gap-1 rounded-xl border bg-white px-3 py-2.5 text-sm font-medium hover:border-indigo-400" style={{ borderColor: "var(--color-border)" }}>
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-3" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-xs text-gray-500 mb-2 px-2">{srcName}</p>
            <canvas ref={canvasRef} className="w-full max-h-[700px] object-contain bg-gray-50 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}

function drawMarks(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  position: Position,
  margin: number,
  _rotation: number,
  drawAt: (x: number, y: number) => void,
  measureW: () => number,
  measureH: () => number,
) {
  const w = measureW();
  const h = measureH();
  switch (position) {
    case "tl": drawAt(margin, margin); break;
    case "tr": drawAt(cw - margin - w, margin); break;
    case "bl": drawAt(margin, ch - margin - h); break;
    case "br": drawAt(cw - margin - w, ch - margin - h); break;
    case "center": drawAt((cw - w) / 2, (ch - h) / 2); break;
    case "tile": {
      const stepX = w + margin * 3;
      const stepY = h + margin * 3;
      for (let y = margin; y < ch; y += stepY) {
        for (let x = margin; x < cw; x += stepX) {
          drawAt(x, y);
        }
      }
      break;
    }
  }
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-700 mb-1 block">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" style={{ borderColor: "var(--color-border)" }} />
    </div>
  );
}
