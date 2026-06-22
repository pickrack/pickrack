"use client";

import { useState } from "react";
import { Plus, Trash2, Copy, Check, Shuffle } from "lucide-react";

type GradType = "linear" | "radial" | "conic";
type Stop = { id: string; color: string; pos: number };

const PRESETS: { name: string; type: GradType; angle: number; stops: { color: string; pos: number }[] }[] = [
  { name: "Sunset", type: "linear", angle: 135, stops: [{ color: "#FF6B6B", pos: 0 }, { color: "#FFE66D", pos: 100 }] },
  { name: "Ocean", type: "linear", angle: 90, stops: [{ color: "#0093E9", pos: 0 }, { color: "#80D0C7", pos: 100 }] },
  { name: "Mojito", type: "linear", angle: 45, stops: [{ color: "#1D976C", pos: 0 }, { color: "#93F9B9", pos: 100 }] },
  { name: "Cosmic", type: "radial", angle: 0, stops: [{ color: "#3a1c71", pos: 0 }, { color: "#d76d77", pos: 50 }, { color: "#ffaf7b", pos: 100 }] },
  { name: "Aurora", type: "conic", angle: 0, stops: [{ color: "#00c6ff", pos: 0 }, { color: "#0072ff", pos: 50 }, { color: "#00c6ff", pos: 100 }] },
];

function uid(): string {
  return Math.random().toString(36).slice(2, 8);
}

function buildCss(type: GradType, angle: number, stops: Stop[]): string {
  const sorted = [...stops].sort((a, b) => a.pos - b.pos);
  const stopStr = sorted.map((s) => `${s.color} ${s.pos}%`).join(", ");
  if (type === "linear") return `linear-gradient(${angle}deg, ${stopStr})`;
  if (type === "radial") return `radial-gradient(circle, ${stopStr})`;
  return `conic-gradient(from ${angle}deg, ${stopStr})`;
}

function randomHex(): string {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0").toUpperCase();
}

export default function GradientGeneratorPage() {
  const [type, setType] = useState<GradType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { id: uid(), color: "#FF6B6B", pos: 0 },
    { id: uid(), color: "#4ECDC4", pos: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const css = buildCss(type, angle, stops);
  const fullCss = `background: ${css};`;

  const addStop = () => {
    if (stops.length >= 6) return;
    const mid = stops.length >= 2 ? Math.round((stops[stops.length - 2].pos + stops[stops.length - 1].pos) / 2) : 50;
    setStops([...stops, { id: uid(), color: randomHex(), pos: mid }]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((s) => s.id !== id));
  };

  const updateStop = (id: string, patch: Partial<Stop>) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const randomize = () => {
    const count = 2 + Math.floor(Math.random() * 3);
    const newStops: Stop[] = [];
    for (let i = 0; i < count; i++) {
      newStops.push({
        id: uid(),
        color: randomHex(),
        pos: Math.round((100 / (count - 1)) * i),
      });
    }
    setStops(newStops);
    setAngle(Math.floor(Math.random() * 360));
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setType(p.type);
    setAngle(p.angle);
    setStops(p.stops.map((s) => ({ id: uid(), ...s })));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">CSS Gradient Generator</h1>
        <p className="mt-3 text-gray-600">
          Build linear, radial, or conic CSS gradients with live preview. Copy CSS, no signup.
        </p>
      </div>

      {/* Preview */}
      <div
        className="rounded-2xl border h-64 mb-4 shadow-inner"
        style={{ background: css, borderColor: "var(--color-border)" }}
      />

      {/* Type + actions */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="inline-flex rounded-lg border p-0.5 bg-white" style={{ borderColor: "var(--color-border)" }}>
          {(["linear", "radial", "conic"] as GradType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1.5 text-sm font-medium rounded ${type === t ? "bg-blue-600 text-white" : "text-gray-600"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={randomize}
          className="text-sm px-3 py-1.5 rounded-lg border bg-white hover:border-blue-400 flex items-center gap-1.5"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Shuffle className="w-3.5 h-3.5" /> Random
        </button>
        <div className="ml-auto flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-blue-400"
              style={{ borderColor: "var(--color-border)" }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Angle + stops */}
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          {type !== "radial" && (
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-900 mb-2 flex items-center justify-between">
                <span>{type === "linear" ? "Angle" : "Start angle"}</span>
                <span className="text-blue-700 font-bold">{angle}°</span>
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-gray-900">Color stops ({stops.length})</label>
              <button
                onClick={addStop}
                disabled={stops.length >= 6}
                className="text-xs px-2 py-1 rounded-lg border bg-white hover:border-blue-400 flex items-center gap-1 disabled:opacity-40"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Plus className="w-3 h-3" /> Add stop
              </button>
            </div>
            {stops.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <input
                  type="color"
                  value={s.color}
                  onChange={(e) => updateStop(s.id, { color: e.target.value })}
                  className="w-10 h-10 rounded-lg border cursor-pointer"
                  style={{ borderColor: "var(--color-border)" }}
                />
                <input
                  type="text"
                  value={s.color}
                  onChange={(e) => updateStop(s.id, { color: e.target.value })}
                  className="rounded-lg border px-2 py-1 text-xs font-mono w-24 focus:border-blue-500 focus:outline-none"
                  style={{ borderColor: "var(--color-border)" }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={s.pos}
                  onChange={(e) => updateStop(s.id, { pos: parseInt(e.target.value, 10) })}
                  className="flex-1 accent-blue-600"
                />
                <span className="w-10 text-xs text-gray-600 tabular-nums">{s.pos}%</span>
                <button
                  onClick={() => removeStop(s.id)}
                  disabled={stops.length <= 2}
                  className="p-1 rounded hover:bg-rose-50 disabled:opacity-30"
                  aria-label="Remove stop"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CSS output */}
        <div className="rounded-2xl border bg-gray-900 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">CSS</p>
            <button
              onClick={copy}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 hover:bg-gray-700 flex items-center gap-1.5"
            >
              {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <code className="text-xs text-emerald-300 font-mono leading-relaxed flex-1 whitespace-pre-wrap break-all">
            {fullCss}
          </code>
          <p className="text-xs text-gray-500 mt-3">
            Tailwind v4:{" "}
            <code className="text-gray-300">bg-[{css.replace(/\s/g, "_")}]</code>
          </p>
        </div>
      </div>
    </div>
  );
}
