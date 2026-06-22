"use client";

import { useState, useRef } from "react";
import JSZip from "jszip";
import { Squircle, Upload, Download, Copy, Check } from "lucide-react";

const SIZES = [16, 32, 48, 96, 144, 152, 167, 180, 192, 256, 384, 512];

function resizeToCanvas(img: HTMLImageElement, size: number, bg: string, mode: "contain" | "cover"): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  if (bg !== "transparent") {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
  }
  const sw = img.naturalWidth;
  const sh = img.naturalHeight;
  let dw: number, dh: number, dx: number, dy: number;
  if (mode === "cover") {
    const ratio = Math.max(size / sw, size / sh);
    dw = sw * ratio; dh = sh * ratio;
    dx = (size - dw) / 2; dy = (size - dh) / 2;
  } else {
    const ratio = Math.min(size / sw, size / sh);
    dw = sw * ratio; dh = sh * ratio;
    dx = (size - dw) / 2; dy = (size - dh) / 2;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, dx, dy, dw, dh);
  return canvas;
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error("toBlob failed")), "image/png");
  });
}

// Build a minimal ICO file from PNG data for the given sizes (PNG-in-ICO format).
async function buildIco(canvases: { size: number; canvas: HTMLCanvasElement }[]): Promise<Blob> {
  const pngBuffers = await Promise.all(canvases.map(async (c) => new Uint8Array(await (await canvasToPngBlob(c.canvas)).arrayBuffer())));

  // ICO header: reserved(2)=0, type(2)=1, count(2)
  const headerSize = 6;
  const entrySize = 16;
  const totalHeader = headerSize + canvases.length * entrySize;

  let totalSize = totalHeader;
  for (const png of pngBuffers) totalSize += png.length;

  const buf = new Uint8Array(totalSize);
  const view = new DataView(buf.buffer);
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type (1 = icon)
  view.setUint16(4, canvases.length, true); // count

  let offset = totalHeader;
  for (let i = 0; i < canvases.length; i++) {
    const size = canvases[i].size;
    const png = pngBuffers[i];
    const entryStart = headerSize + i * entrySize;
    buf[entryStart] = size >= 256 ? 0 : size; // width
    buf[entryStart + 1] = size >= 256 ? 0 : size; // height
    buf[entryStart + 2] = 0; // color count
    buf[entryStart + 3] = 0; // reserved
    view.setUint16(entryStart + 4, 1, true); // color planes
    view.setUint16(entryStart + 6, 32, true); // bpp
    view.setUint32(entryStart + 8, png.length, true); // image size
    view.setUint32(entryStart + 12, offset, true); // offset
    buf.set(png, offset);
    offset += png.length;
  }
  return new Blob([buf], { type: "image/x-icon" });
}

export default function FaviconGeneratorPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [bg, setBg] = useState<string>("transparent");
  const [mode, setMode] = useState<"contain" | "cover">("contain");
  const [siteName, setSiteName] = useState("My Site");
  const [themeColor, setThemeColor] = useState("#6366f1");
  const [generating, setGenerating] = useState(false);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const htmlSnippet = `<link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${themeColor}">`;

  const generate = async () => {
    if (!src) return;
    setGenerating(true);
    setZipUrl(null);
    try {
      const img = new window.Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("image load failed"));
        img.src = src;
      });

      const zip = new JSZip();
      const canvases: { size: number; canvas: HTMLCanvasElement }[] = [];

      for (const size of SIZES) {
        const canvas = resizeToCanvas(img, size, bg, mode);
        const blob = await canvasToPngBlob(canvas);
        canvases.push({ size, canvas });
        const filename =
          size === 180 ? "apple-touch-icon.png" :
          `icon-${size}.png`;
        zip.file(filename, blob);
      }

      // ICO with 16, 32, 48
      const icoCanvases = canvases.filter((c) => [16, 32, 48].includes(c.size));
      const icoBlob = await buildIco(icoCanvases);
      zip.file("favicon.ico", icoBlob);

      // Manifest
      const manifest = {
        name: siteName,
        short_name: siteName.slice(0, 12),
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        theme_color: themeColor,
        background_color: bg === "transparent" ? "#ffffff" : bg,
        display: "standalone",
      };
      zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));

      // HTML snippet
      zip.file("snippet.html", htmlSnippet);

      // README
      zip.file("README.txt",
        "Pickrack Favicon Pack\n" +
        "=====================\n\n" +
        "1. Upload all files in this folder to your site root.\n" +
        "2. Paste the contents of snippet.html into your <head>.\n\n" +
        "Files:\n" +
        canvases.map((c) => `  icon-${c.size}.png — ${c.size}×${c.size}`).join("\n") +
        "\n  apple-touch-icon.png — 180×180 (iOS home screen)\n" +
        "  favicon.ico — 16/32/48 multi-size (legacy)\n" +
        "  site.webmanifest — PWA manifest\n"
      );

      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      setZipUrl(URL.createObjectURL(blob));

      // Preview
      if (previewRef.current) {
        previewRef.current.innerHTML = "";
        [16, 32, 96, 192].forEach((size) => {
          const c = canvases.find((c) => c.size === size);
          if (c) {
            const wrapper = document.createElement("div");
            wrapper.className = "text-center";
            wrapper.innerHTML = `<div class="text-xs text-gray-500 mb-1">${size}×${size}</div>`;
            const cnv = c.canvas.cloneNode(true) as HTMLCanvasElement;
            cnv.style.cssText = `border: 1px solid #e5e7eb; border-radius: 6px; image-rendering: pixelated;`;
            wrapper.appendChild(cnv);
            previewRef.current!.appendChild(wrapper);
          }
        });
      }
    } finally {
      setGenerating(false);
    }
  };

  const downloadZip = () => {
    if (!zipUrl) return;
    const a = document.createElement("a");
    a.href = zipUrl;
    a.download = "favicon-pack.zip";
    a.click();
  };

  const copySnippet = async () => {
    await navigator.clipboard.writeText(htmlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Squircle className="w-7 h-7 text-indigo-600" /> Favicon Generator
        </h1>
        <p className="mt-3 text-gray-600">
          Upload 1 image → get a complete favicon pack: 12 PNG sizes + ICO + manifest.json + HTML snippet. Browser-side.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {!src ? (
            <label
              className="block border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 transition"
              style={{ borderColor: "var(--color-border)" }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            >
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="font-semibold text-gray-900">Drop or click to upload source image</p>
              <p className="text-xs text-gray-500 mt-1">PNG/JPG/SVG, ideally square 512×512+. Stays in your browser.</p>
            </label>
          ) : (
            <>
              <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="source" className="w-24 h-24 object-contain rounded-lg border bg-gray-50" style={{ borderColor: "var(--color-border)" }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Source loaded</p>
                    <button onClick={() => { setSrc(null); setZipUrl(null); }} className="text-xs text-red-600 hover:text-red-700 mt-1">Change image</button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Background</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setBg("transparent")} className={`px-2 py-1 text-xs rounded border ${bg === "transparent" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-white"}`} style={{ borderColor: bg === "transparent" ? undefined : "var(--color-border)" }}>Transparent</button>
                      <input type="color" value={bg === "transparent" ? "#ffffff" : bg} onChange={(e) => setBg(e.target.value)} className="w-9 h-7 rounded cursor-pointer" />
                      <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="flex-1 rounded-lg border px-2 py-1 text-xs font-mono" style={{ borderColor: "var(--color-border)" }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Fit mode</label>
                    <div className="inline-flex rounded-lg border p-1 bg-gray-50 w-full" style={{ borderColor: "var(--color-border)" }}>
                      <button onClick={() => setMode("contain")} className={`flex-1 px-3 py-1 text-xs rounded ${mode === "contain" ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}>Contain</button>
                      <button onClick={() => setMode("cover")} className={`flex-1 px-3 py-1 text-xs rounded ${mode === "cover" ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}>Cover</button>
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Site name (for manifest)</label>
                    <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" style={{ borderColor: "var(--color-border)" }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Theme color</label>
                    <div className="flex items-center gap-2 border rounded-lg px-2" style={{ borderColor: "var(--color-border)" }}>
                      <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-7 h-7 cursor-pointer rounded border-0 bg-transparent p-0" />
                      <input type="text" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="flex-1 py-2 text-sm font-mono focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={generate}
                disabled={generating}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 text-sm font-semibold disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate favicon pack"}
              </button>

              {zipUrl && (
                <>
                  <button
                    onClick={downloadZip}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 text-sm font-semibold"
                  >
                    <Download className="w-4 h-4" /> Download favicon-pack.zip
                  </button>
                  <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">HTML snippet</p>
                      <button onClick={copySnippet} className="inline-flex items-center gap-1 text-xs text-indigo-700">
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto font-mono">{htmlSnippet}</pre>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div>
          <div className="rounded-2xl border bg-white p-5 sticky top-20" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-sm font-semibold text-gray-900 mb-3">Preview</p>
            {zipUrl ? (
              <div ref={previewRef} className="flex flex-wrap gap-4 justify-center" />
            ) : (
              <p className="text-xs text-gray-400 text-center py-8">Upload + generate to preview sizes</p>
            )}
            <div className="mt-4 pt-4 border-t text-xs text-gray-500 space-y-1" style={{ borderColor: "var(--color-border)" }}>
              <p>Pack includes: 12 PNG sizes (16-512px), favicon.ico (16/32/48 multi), apple-touch-icon.png (180), site.webmanifest, snippet.html, README.txt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
