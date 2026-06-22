"use client";

import { useState, useEffect, useRef } from "react";
import { Brush, Upload, Download, Loader2, AlertCircle, Cpu, Sparkles } from "lucide-react";

type Status = "idle" | "uploading" | "running" | "done" | "error";

const QUALITY_SUFFIX = "masterpiece, best quality, intricate detail, sharp focus, professional";

const STYLE_PRESETS = [
  { label: "Oil painting", prompt: `Oil painting style, thick visible brush strokes, expressive color palette, classical fine art, ${QUALITY_SUFFIX}` },
  { label: "Watercolor", prompt: `Soft watercolor painting, gentle color washes, visible paper texture, traditional art, ${QUALITY_SUFFIX}` },
  { label: "Anime", prompt: `Anime style illustration, vibrant colors, clean lineart, cel shading, studio anime quality, ${QUALITY_SUFFIX}` },
  { label: "Cyberpunk", prompt: `Cyberpunk neon aesthetic, vibrant pink and cyan lighting, dystopian futuristic city, rain reflections, cinematic, ${QUALITY_SUFFIX}` },
  { label: "Pencil sketch", prompt: `Pencil sketch, graphite shading, hand-drawn lines, monochrome, detailed crosshatching, ${QUALITY_SUFFIX}` },
  { label: "Pixar 3D", prompt: `Pixar 3D animation style, soft warm lighting, cinematic character design, expressive features, ${QUALITY_SUFFIX}` },
  { label: "Studio Ghibli", prompt: `Studio Ghibli style, soft pastel colors, dreamy hand-painted landscape, watercolor textures, magical atmosphere, ${QUALITY_SUFFIX}` },
  { label: "Cinematic photo", prompt: `Cinematic photograph, dramatic lighting, shallow depth of field, subtle film grain, high dynamic range, ${QUALITY_SUFFIX}` },
];

const QUALITY_NEGATIVE = "low quality, blurry, jpeg artifacts, deformed, watermark, text glitch, extra limbs, bad anatomy, ugly, disfigured";

type ModelEntry = { id: string; label: string; desc: string; family: "sd15" | "sdxl"; tier?: "fast" | "best" };

const MODELS: ModelEntry[] = [
  // SDXL — highest quality, surfaced first
  { id: "juggernaut-xl", label: "Juggernaut XL", desc: "Best photoreal (recommended)", family: "sdxl", tier: "best" },
  { id: "realvis-xl", label: "RealVis XL V5", desc: "Hyperreal photography", family: "sdxl", tier: "best" },
  { id: "dreamshaper-xl", label: "DreamShaper XL", desc: "Versatile creative", family: "sdxl", tier: "best" },
  { id: "dreamshaper-xl-lightning", label: "DreamShaper XL Lightning", desc: "4-step fast (~6s)", family: "sdxl", tier: "fast" },
  // SD 1.5 — older, faster, lower quality
  { id: "dreamshaper", label: "DreamShaper 8 (SD 1.5)", desc: "Versatile, fastest", family: "sd15" },
  { id: "realistic", label: "Realistic Vision V6 (SD 1.5)", desc: "Photoreal SD 1.5", family: "sd15" },
  { id: "anime", label: "Anything V5 (SD 1.5)", desc: "Anime SD 1.5", family: "sd15" },
  { id: "default", label: "Default SD 1.5", desc: "Vanilla, lowest quality", family: "sd15" },
];

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(",")[1]);
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

export default function AiImg2ImgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<{ w: number; h: number } | null>(null);
  const [prompt, setPrompt] = useState(STYLE_PRESETS[0].prompt);
  const [negativePrompt, setNegativePrompt] = useState(QUALITY_NEGATIVE);
  const [strength, setStrength] = useState(0.5);
  const [steps, setSteps] = useState(30);
  const [maxSide, setMaxSide] = useState(1024);
  const [model, setModel] = useState("juggernaut-xl");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputInfo, setOutputInfo] = useState<{ w: number; h: number; seconds: number; model?: string } | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [gpuOnline, setGpuOnline] = useState<boolean | null>(null);
  const [currentLoadedModel, setCurrentLoadedModel] = useState<string | null>(null);
  const elapsedRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchStatus = () =>
      fetch("/api/ai/qr-art/")
        .then((r) => r.json())
        .then((d: { local?: { ready?: boolean; currentModel?: string } }) => {
          setGpuOnline(d.local?.ready === true);
          setCurrentLoadedModel(d.local?.currentModel ?? null);
        })
        .catch(() => setGpuOnline(false));
    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
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
    } catch {
      setError("Could not read image dimensions");
    }
  };

  const generate = async () => {
    if (!file || !prompt.trim()) return;
    setStatus("uploading");
    setError(null);
    setOutputUrl(null);

    try {
      const b64 = await fileToBase64(file);
      setStatus("running");
      const start = Date.now();
      elapsedRef.current = setInterval(() => setElapsedMs(Date.now() - start), 250);

      const res = await fetch("/api/ai/img2img/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageB64: b64,
          prompt: prompt.trim(),
          negativePrompt: negativePrompt.trim(),
          strength,
          steps,
          maxSide,
          model,
        }),
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
        seconds: data.genSeconds,
        model: data.model,
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
      a.download = `${base}-styled.png`;
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
          <Brush className="w-7 h-7 text-violet-600" /> AI Image Stylizer (Img2Img)
        </h1>
        <p className="mt-3 text-gray-600">
          Re-paint your photo in a new style using Stable Diffusion. Strength slider controls how much to change. Self-hosted GPU.
        </p>
        {gpuOnline !== null && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold ${gpuOnline ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              <Cpu className="w-3.5 h-3.5" />
              {gpuOnline ? "GPU online · self-hosted · free" : "GPU offline"}
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
          <p className="font-semibold text-gray-900">Drop or click to upload source image</p>
          <p className="text-xs text-gray-500 mt-1">JPG / PNG / WebP. Max ~6MB. Image is resized to 768px on longer edge before processing.</p>
        </label>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
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

            {outputUrl && outputInfo && (
              <div className="rounded-2xl border bg-white p-3" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center justify-between mb-2 px-2">
                  <p className="text-xs font-semibold text-emerald-700">
                    Stylized · {outputInfo.w}×{outputInfo.h}px · {outputInfo.seconds}s
                    {outputInfo.model && <span className="ml-2 font-normal text-gray-500">· {outputInfo.model}</span>}
                  </p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={outputUrl} alt="stylized" className="w-full max-h-[500px] object-contain bg-gray-50 rounded-lg" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 space-y-3 sticky top-20" style={{ borderColor: "var(--color-border)" }}>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Style model</label>
                <p className="text-xs text-violet-700 mb-2 inline-flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3 h-3" /> SDXL — high quality (recommended)
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {MODELS.filter((m) => m.family === "sdxl").map((m) => {
                    const isActive = model === m.id;
                    const isLoaded = currentLoadedModel === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setModel(m.id)}
                        className={`p-2 rounded-lg border text-left text-xs transition ${isActive ? "border-violet-500 bg-violet-50" : "bg-white"}`}
                        style={{ borderColor: isActive ? undefined : "var(--color-border)" }}
                      >
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          {m.label}
                          {m.tier === "fast" && <span className="text-[10px] px-1 rounded bg-amber-100 text-amber-700">FAST</span>}
                          {isLoaded && <span className="text-[10px] text-emerald-600 font-medium">● loaded</span>}
                        </div>
                        <div className="text-gray-500 mt-0.5">{m.desc}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mb-2 inline-flex items-center gap-1">
                  SD 1.5 — older, faster (~15s), lower quality
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {MODELS.filter((m) => m.family === "sd15").map((m) => {
                    const isActive = model === m.id;
                    const isLoaded = currentLoadedModel === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setModel(m.id)}
                        className={`p-2 rounded-lg border text-left text-xs transition ${isActive ? "border-violet-500 bg-violet-50" : "bg-white"}`}
                        style={{ borderColor: isActive ? undefined : "var(--color-border)" }}
                      >
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5 truncate">
                          {m.label}
                          {isLoaded && <span className="text-[10px] text-emerald-600 font-medium shrink-0">● loaded</span>}
                        </div>
                        <div className="text-gray-500 mt-0.5 truncate">{m.desc}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  First-time switch to SDXL downloads ~6GB and loads ~30s. After that, ~5-10s swap between cached models.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Style prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-violet-500 focus:outline-none resize-none"
                  style={{ borderColor: "var(--color-border)" }}
                  placeholder="Describe the target style — subject can stay; describe medium + mood"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Quick presets</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {STYLE_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setPrompt(p.prompt)}
                      className={`p-1.5 rounded border text-xs font-medium transition ${prompt === p.prompt ? "border-violet-500 bg-violet-50 text-violet-700" : "bg-white"}`}
                      style={{ borderColor: prompt === p.prompt ? undefined : "var(--color-border)" }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Style strength: {strength.toFixed(2)}</label>
                <input
                  type="range"
                  min={0.1}
                  max={0.95}
                  step={0.05}
                  value={strength}
                  onChange={(e) => setStrength(parseFloat(e.target.value))}
                  className="w-full accent-violet-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Low (0.3) = subtle, original recognizable. High (0.8) = bold transformation, may lose original structure.
                </p>
              </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-medium text-violet-700 hover:underline"
              >
                {showAdvanced ? "− Hide advanced" : "+ Show advanced (steps, max-side, negative prompt)"}
              </button>

              {showAdvanced && (
                <div className="space-y-2 pt-1 border-t" style={{ borderColor: "var(--color-border)" }}>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Inference steps: {steps}</label>
                    <input type="range" min={10} max={50} step={5} value={steps} onChange={(e) => setSteps(parseInt(e.target.value, 10))} className="w-full accent-violet-600" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Max output side: {maxSide}px</label>
                    <input type="range" min={512} max={1024} step={64} value={maxSide} onChange={(e) => setMaxSide(parseInt(e.target.value, 10))} className="w-full accent-violet-600" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Negative prompt</label>
                    <input type="text" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="Things to avoid" className="w-full rounded-lg border px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" style={{ borderColor: "var(--color-border)" }} />
                  </div>
                </div>
              )}

              {status !== "running" && status !== "uploading" && (
                <button
                  onClick={generate}
                  disabled={!gpuOnline || !prompt.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 text-sm font-semibold disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" /> Stylize image
                </button>
              )}

              {(status === "uploading" || status === "running") && (
                <div className="rounded-lg border bg-gray-50 p-3" style={{ borderColor: "var(--color-border)" }}>
                  <div className="inline-flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                    {status === "uploading" ? "Sending image..." : `Generating... ${(elapsedMs / 1000).toFixed(1)}s`}
                  </div>
                </div>
              )}

              {outputUrl && (
                <button
                  onClick={downloadOutput}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-sm font-semibold"
                >
                  <Download className="w-4 h-4" /> Download styled PNG
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
