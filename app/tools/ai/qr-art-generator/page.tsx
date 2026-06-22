"use client";

import { useState, useEffect, useRef } from "react";
import jsQR from "jsqr";
import {
  Sparkles, Download, AlertCircle, Check, Loader2, Wand2, Cpu,
} from "lucide-react";

type Status = "idle" | "generating" | "done" | "error";
type Scan = "pending" | "ok" | "fail";
type Backend = {
  local: {
    configured: boolean;
    ready?: boolean;
    device?: string;
    currentModel?: string;
    vramTotalGb?: number;
    vramUsedGb?: number;
    inFlight?: number;
    maxInFlight?: number;
    avgGenSeconds?: number | null;
    gpuTempC?: number;
    gpuPowerW?: number;
  };
} | null;

const MODELS = [
  { id: "default", label: "Default SD 1.5", desc: "Balanced, photo + art" },
  { id: "dreamshaper", label: "DreamShaper 8", desc: "Versatile photo + creative" },
  { id: "realistic", label: "Realistic Vision V6", desc: "Hyperreal photography" },
  { id: "anime", label: "Anything V5", desc: "Anime / illustration" },
];

const STYLE_PRESETS = [
  { label: "Mountain sunrise", prompt: "Misty mountain landscape at sunrise, peaceful, photorealistic, high detail" },
  { label: "Cyberpunk city", prompt: "Cyberpunk neon city street at night, vibrant pink and cyan, rain reflections, cinematic" },
  { label: "Watercolor sakura", prompt: "Watercolor painting of cherry blossoms, soft pastel, traditional Japanese art" },
  { label: "Enchanted forest", prompt: "Ancient forest with towering trees, mossy ground, magical light beams, ethereal" },
  { label: "Botanical vintage", prompt: "Vintage botanical illustration, line art, hand-drawn, sepia tones, 19th century" },
  { label: "Art deco abstract", prompt: "Abstract geometric pattern, bold colors, art deco style, symmetrical" },
  { label: "Ocean sunset", prompt: "Ocean waves at sunset, golden hour, photography, dramatic clouds" },
  { label: "Cozy autumn cabin", prompt: "Cozy autumn cabin in the woods, warm light from windows, oil painting" },
];

export default function QrArtGeneratorPage() {
  const [qrContent, setQrContent] = useState("https://pickrack.com/");
  const [prompt, setPrompt] = useState(STYLE_PRESETS[0].prompt);
  const [model, setModel] = useState("default");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [qrcodeWeight, setQrcodeWeight] = useState(1.4);
  const [steps, setSteps] = useState(30);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [scan, setScan] = useState<Scan>("pending");
  const [backend, setBackend] = useState<Backend>(null);
  const [source, setSource] = useState<"local" | "replicate" | null>(null);
  const elapsedRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any legacy token from localStorage left over from BYOK era
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pickrack-replicate-token");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/ai/qr-art/", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Backend;
        if (!cancelled) setBackend(data);
      } catch {
        /* offline */
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const generate = async () => {
    if (!qrContent.trim() || !prompt.trim()) {
      setError("QR content and prompt are both required.");
      return;
    }
    setStatus("generating");
    setError(null);
    setImageUrl(null);
    setScan("pending");
    setElapsedMs(0);
    const start = Date.now();
    elapsedRef.current = setInterval(() => setElapsedMs(Date.now() - start), 250);

    try {
      const res = await fetch("/api/ai/qr-art/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrContent: qrContent.trim(),
          prompt: prompt.trim(),
          negativePrompt: negativePrompt.trim(),
          qrcodeWeight,
          steps,
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
      setImageUrl(data.imageUrl);
      setSource(data.source ?? null);
      setStatus("done");
      verifyScannability(data.imageUrl);
    } catch (e) {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      setError(e instanceof Error ? e.message : "Network error");
      setStatus("error");
    }
  };

  const verifyScannability = async (url: string) => {
    setScan("pending");
    try {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) { setScan("fail"); return; }
        ctx.drawImage(img, 0, 0);
        try {
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(data.data, data.width, data.height, { inversionAttempts: "attemptBoth" });
          setScan(code && code.data ? "ok" : "fail");
        } catch {
          // Canvas tainted (no CORS) — can't verify, mark unknown
          setScan("fail");
        }
      };
      img.onerror = () => setScan("fail");
      img.src = url;
    } catch {
      setScan("fail");
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ai-qr-art.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Wand2 className="w-7 h-7 text-violet-600" /> AI-Art QR Generator
        </h1>
        <p className="mt-3 text-gray-600">
          Stable Diffusion + ControlNet creates a scannable QR code blended into a custom artwork. ~25-30s per generation.
        </p>
        <BackendBadge backend={backend} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-1 block">QR content</label>
              <input
                type="text"
                value={qrContent}
                onChange={(e) => setQrContent(e.target.value)}
                placeholder="https://example.com or any text"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
              <p className="text-xs text-gray-500 mt-1">URL or text to encode. The artwork will be generated around this QR pattern.</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900 mb-1 block">Style model</label>
              <div className="grid grid-cols-2 gap-2">
                {MODELS.map((m) => {
                  const isActive = model === m.id;
                  const isCurrent = backend?.local.currentModel === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setModel(m.id)}
                      className={`p-2 rounded-lg border text-left text-xs transition ${
                        isActive ? "border-indigo-500 bg-indigo-50" : "bg-white"
                      }`}
                      style={{ borderColor: isActive ? undefined : "var(--color-border)" }}
                    >
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                        {m.label}
                        {isCurrent && <span className="text-[10px] text-emerald-600 font-medium">● loaded</span>}
                      </div>
                      <div className="text-gray-500 mt-0.5">{m.desc}</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Switching to a non-loaded model adds ~10-30s for download on first use; ~5s thereafter (LRU cache of 1).
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900 mb-1 block">Art style prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the artwork — subject, style, lighting, mood"
                rows={3}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none resize-none"
                style={{ borderColor: "var(--color-border)" }}
              />
              <p className="text-xs text-gray-500 mt-1">Be descriptive: subject + style + lighting + mood. Try a preset below.</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Quick presets</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STYLE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setPrompt(p.prompt)}
                    className={`p-2 rounded-lg border text-xs font-medium transition text-left ${
                      prompt === p.prompt ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-white"
                    }`}
                    style={{ borderColor: prompt === p.prompt ? undefined : "var(--color-border)" }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-medium text-indigo-700 hover:underline self-start"
            >
              {showAdvanced ? "− Hide advanced" : "+ Show advanced (QR weight, inference steps, negative prompt)"}
            </button>

            {showAdvanced && (
              <div className="space-y-3 pt-1 border-t" style={{ borderColor: "var(--color-border)" }}>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    QR scan weight: {qrcodeWeight.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min={0.5}
                    max={2.5}
                    step={0.1}
                    value={qrcodeWeight}
                    onChange={(e) => setQrcodeWeight(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher = QR more visible / more reliable scan. Lower = more artistic / harder to scan. 1.2-1.6 is the usual sweet spot.
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Inference steps: {steps}</label>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={steps}
                    onChange={(e) => setSteps(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">More steps = higher quality, longer wait + higher cost. 30 is balanced.</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Negative prompt</label>
                  <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="Things to avoid (e.g., 'text, watermark, blurry')"
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={generate}
            disabled={status === "generating" || !qrContent.trim() || !prompt.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 text-sm font-semibold disabled:opacity-50"
          >
            {status === "generating" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating · {(elapsedMs / 1000).toFixed(1)}s
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate AI-art QR
              </>
            )}
          </button>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div>
          <div className="rounded-2xl border bg-white p-5 sticky top-20 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-sm font-semibold text-gray-900">Result</p>
            {status === "idle" && (
              <div className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed flex items-center justify-center" style={{ borderColor: "var(--color-border)" }}>
                <p className="text-xs text-gray-400 text-center px-4">
                  Generated artwork appears here.<br />Test the scan with the QR Scanner before printing.
                </p>
              </div>
            )}

            {status === "generating" && (
              <div className="aspect-square bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                <p className="text-sm text-gray-700 font-medium">Generating...</p>
                <p className="text-xs text-gray-500">{(elapsedMs / 1000).toFixed(1)}s elapsed</p>
              </div>
            )}

            {status === "done" && imageUrl && (
              <>
                <div className="aspect-square rounded-xl overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="AI-generated QR art" className="w-full h-full object-contain bg-white" crossOrigin="anonymous" />
                </div>

                <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
                  <div className="flex items-center gap-2">
                    {scan === "pending" && <span className="text-gray-500">Checking scan...</span>}
                    {scan === "ok" && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <Check className="w-3.5 h-3.5" /> Scannable (strict check)
                      </span>
                    )}
                    {scan === "fail" && (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> Strict scanner couldn&apos;t decode
                      </span>
                    )}
                  </div>
                  {source && (
                    <span className="inline-flex items-center gap-1 text-gray-500 text-[11px]">
                      <Cpu className="w-3 h-3" /> Generated on GPU
                    </span>
                  )}
                </div>

                {scan === "fail" && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs space-y-2">
                    <p className="text-amber-900">
                      Our JS scanner is strict — your iPhone Camera / Google Lens / Pickrack&apos;s own
                      <a href="/tools/calc/qr-scanner/" target="_blank" rel="noopener" className="text-indigo-700 underline ml-1">QR Scanner</a> may still scan it fine. Always test with a real phone before printing.
                    </p>
                    <p className="text-amber-800">
                      Still want a stricter pattern? Bump <strong>QR weight</strong> to 1.6-1.8 (Advanced) or pick a simpler prompt.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => { setQrcodeWeight(Math.min(2.5, qrcodeWeight + 0.2)); }}
                        className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white px-2 py-1 font-medium text-amber-900 hover:bg-amber-100"
                      >
                        QR weight {qrcodeWeight.toFixed(1)} → {Math.min(2.5, qrcodeWeight + 0.2).toFixed(1)}
                      </button>
                      <a
                        href={imageUrl}
                        download="ai-qr-art-preview.png"
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1 rounded-md border bg-white px-2 py-1 font-medium text-gray-700 hover:bg-gray-50"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        Open in new tab
                      </a>
                    </div>
                  </div>
                )}

                <button
                  onClick={downloadImage}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm font-medium"
                >
                  <Download className="w-4 h-4" /> Download PNG
                </button>
                <button
                  onClick={generate}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:border-indigo-400"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  Generate again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BackendBadge({ backend }: { backend: Backend }) {
  if (!backend) {
    return (
      <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-400">
        <Loader2 className="w-3 h-3 animate-spin" /> Checking GPU status...
      </div>
    );
  }

  const localReady = backend.local.configured && backend.local.ready === true;
  const inFlight = backend.local.inFlight ?? 0;
  const maxInFlight = backend.local.maxInFlight ?? 4;
  const avg = backend.local.avgGenSeconds;
  const vramUsed = backend.local.vramUsedGb;
  const vramTotal = backend.local.vramTotalGb;

  if (localReady) {
    const busy = inFlight > 0;
    const queueLabel = busy ? `${inFlight}/${maxInFlight} in flight` : "idle";
    const avgLabel = avg ? ` · avg ${avg}s` : "";
    const vramLabel = vramUsed != null && vramTotal != null ? ` · ${vramUsed}/${vramTotal} GB VRAM` : "";
    const temp = backend.local.gpuTempC;
    const power = backend.local.gpuPowerW;
    const tempLabel = temp != null ? ` · ${temp}°C` : "";
    const powerLabel = power != null ? ` · ${Math.round(power)}W` : "";
    return (
      <div className="mt-4 inline-flex flex-wrap items-center gap-2 text-xs">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold ${busy ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
          <Cpu className="w-3.5 h-3.5" />
          {busy ? "GPU busy" : "GPU online"} · self-hosted · free
        </span>
        <span className="text-gray-500">{queueLabel}{avgLabel}{vramLabel}{tempLabel}{powerLabel}</span>
      </div>
    );
  }

  return (
    <div className="mt-4 inline-flex items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 font-semibold text-red-700">
        <AlertCircle className="w-3.5 h-3.5" /> GPU offline
      </span>
      <span className="text-gray-500">Operator's PC is asleep or down — generation will fail until it&apos;s back. Status reloads every 60s.</span>
    </div>
  );
}
