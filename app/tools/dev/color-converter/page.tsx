"use client";

import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };
type HSV = { h: number; s: number; v: number };

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function hexToRgb(hex: string): RGB | null {
  const h = hex.replace(/^#/, "").trim();
  if (/^[0-9a-f]{3}$/i.test(h)) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }
  if (/^[0-9a-f]{6}$/i.test(h)) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }
  return null;
}

function rgbToHex({ r, g, b }: RGB): string {
  return "#" + [r, g, b].map((v) => clamp(v, 0, 255).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
    else if (max === gn) h = ((bn - rn) / d + 2) * 60;
    else h = ((rn - gn) / d + 4) * 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100, ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hn = (h % 360 + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hn % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (hn < 1) { r1 = c; g1 = x; }
  else if (hn < 2) { r1 = x; g1 = c; }
  else if (hn < 3) { g1 = c; b1 = x; }
  else if (hn < 4) { g1 = x; b1 = c; }
  else if (hn < 5) { r1 = x; b1 = c; }
  else { r1 = c; b1 = x; }
  const m = ln - c / 2;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function rgbToHsv({ r, g, b }: RGB): HSV {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
    else if (max === gn) h = ((bn - rn) / d + 2) * 60;
    else h = ((rn - gn) / d + 4) * 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hsvToRgb({ h, s, v }: HSV): RGB {
  const sn = s / 100, vn = v / 100;
  const c = vn * sn;
  const hn = (h % 360 + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hn % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (hn < 1) { r1 = c; g1 = x; }
  else if (hn < 2) { r1 = x; g1 = c; }
  else if (hn < 3) { g1 = c; b1 = x; }
  else if (hn < 4) { g1 = x; b1 = c; }
  else if (hn < 5) { r1 = x; b1 = c; }
  else { r1 = c; b1 = x; }
  const m = vn - c;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function parseRgbString(s: string): RGB | null {
  const m = s.match(/(\d+)\D+(\d+)\D+(\d+)/);
  if (!m) return null;
  const r = parseInt(m[1], 10);
  const g = parseInt(m[2], 10);
  const b = parseInt(m[3], 10);
  if ([r, g, b].some((n) => n < 0 || n > 255 || Number.isNaN(n))) return null;
  return { r, g, b };
}

function parseHslString(s: string): HSL | null {
  const m = s.match(/(-?\d+)\D+(\d+)\D+(\d+)/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const sat = parseInt(m[2], 10);
  const l = parseInt(m[3], 10);
  if (Number.isNaN(h) || sat < 0 || sat > 100 || l < 0 || l > 100) return null;
  return { h, s: sat, l };
}

function parseHsvString(s: string): HSV | null {
  const m = s.match(/(-?\d+)\D+(\d+)\D+(\d+)/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const sat = parseInt(m[2], 10);
  const v = parseInt(m[3], 10);
  if (Number.isNaN(h) || sat < 0 || sat > 100 || v < 0 || v > 100) return null;
  return { h, s: sat, v };
}

function relLuminance({ r, g, b }: RGB): number {
  const ch = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function contrast(a: RGB, b: RGB): number {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
}

function wcagRating(c: number): string {
  if (c >= 7) return "AAA";
  if (c >= 4.5) return "AA";
  if (c >= 3) return "AA Large";
  return "Fail";
}

export default function ColorConverterPage() {
  const [rgb, setRgb] = useState<RGB>({ r: 99, g: 102, b: 241 });
  const [hexInput, setHexInput] = useState("#6366F1");
  const [rgbInput, setRgbInput] = useState("99, 102, 241");
  const [hslInput, setHslInput] = useState("239, 84%, 67%");
  const [hsvInput, setHsvInput] = useState("239, 59%, 95%");
  const [copied, setCopied] = useState<string | null>(null);

  const hex = useMemo(() => rgbToHex(rgb), [rgb]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const hsv = useMemo(() => rgbToHsv(rgb), [rgb]);
  const cssRgb = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const cssHsl = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const cWhite = contrast(rgb, { r: 255, g: 255, b: 255 });
  const cBlack = contrast(rgb, { r: 0, g: 0, b: 0 });

  const updateFromRgb = (next: RGB) => {
    setRgb(next);
    setHexInput(rgbToHex(next));
    const h2 = rgbToHsl(next);
    const v2 = rgbToHsv(next);
    setRgbInput(`${next.r}, ${next.g}, ${next.b}`);
    setHslInput(`${h2.h}, ${h2.s}%, ${h2.l}%`);
    setHsvInput(`${v2.h}, ${v2.s}%, ${v2.v}%`);
  };

  const handleHex = (v: string) => {
    setHexInput(v);
    const parsed = hexToRgb(v);
    if (parsed) {
      setRgb(parsed);
      const h2 = rgbToHsl(parsed);
      const v2 = rgbToHsv(parsed);
      setRgbInput(`${parsed.r}, ${parsed.g}, ${parsed.b}`);
      setHslInput(`${h2.h}, ${h2.s}%, ${h2.l}%`);
      setHsvInput(`${v2.h}, ${v2.s}%, ${v2.v}%`);
    }
  };

  const handleRgb = (v: string) => {
    setRgbInput(v);
    const parsed = parseRgbString(v);
    if (parsed) {
      setRgb(parsed);
      setHexInput(rgbToHex(parsed));
      const h2 = rgbToHsl(parsed);
      const v2 = rgbToHsv(parsed);
      setHslInput(`${h2.h}, ${h2.s}%, ${h2.l}%`);
      setHsvInput(`${v2.h}, ${v2.s}%, ${v2.v}%`);
    }
  };

  const handleHsl = (v: string) => {
    setHslInput(v);
    const parsed = parseHslString(v);
    if (parsed) {
      const newRgb = hslToRgb(parsed);
      setRgb(newRgb);
      setHexInput(rgbToHex(newRgb));
      setRgbInput(`${newRgb.r}, ${newRgb.g}, ${newRgb.b}`);
      const v2 = rgbToHsv(newRgb);
      setHsvInput(`${v2.h}, ${v2.s}%, ${v2.v}%`);
    }
  };

  const handleHsv = (v: string) => {
    setHsvInput(v);
    const parsed = parseHsvString(v);
    if (parsed) {
      const newRgb = hsvToRgb(parsed);
      setRgb(newRgb);
      setHexInput(rgbToHex(newRgb));
      setRgbInput(`${newRgb.r}, ${newRgb.g}, ${newRgb.b}`);
      const h2 = rgbToHsl(newRgb);
      setHslInput(`${h2.h}, ${h2.s}%, ${h2.l}%`);
    }
  };

  const handleColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = hexToRgb(e.target.value);
    if (parsed) updateFromRgb(parsed);
  };

  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Color Converter</h1>
        <p className="mt-3 text-gray-600">
          Convert between HEX, RGB, HSL, HSV. Live preview + WCAG contrast check. Browser-side.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <Row label="HEX" value={hexInput} onChange={handleHex} copyKey="hex" copyValue={hex} copied={copied === "hex"} onCopy={copy} />
          <Row label="RGB" value={rgbInput} onChange={handleRgb} copyKey="rgb" copyValue={cssRgb} copied={copied === "rgb"} onCopy={copy} />
          <Row label="HSL" value={hslInput} onChange={handleHsl} copyKey="hsl" copyValue={cssHsl} copied={copied === "hsl"} onCopy={copy} />
          <Row label="HSV" value={hsvInput} onChange={handleHsv} copyKey="hsv" copyValue={`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`} copied={copied === "hsv"} onCopy={copy} />

          <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-sm font-semibold text-gray-900 mb-3">WCAG contrast</p>
            <div className="grid grid-cols-2 gap-3">
              <ContrastCard label="vs White" sample={rgb} bg={{ r: 255, g: 255, b: 255 }} ratio={cWhite} />
              <ContrastCard label="vs Black" sample={rgb} bg={{ r: 0, g: 0, b: 0 }} ratio={cBlack} />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              AAA ≥ 7:1 · AA ≥ 4.5:1 · AA Large ≥ 3:1 (for 18pt+ or 14pt bold text).
            </p>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border bg-white p-5 sticky top-20 space-y-4" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-sm font-semibold text-gray-900">Preview</p>
            <div
              className="aspect-square rounded-xl border"
              style={{ background: hex, borderColor: "var(--color-border)" }}
            />
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Color picker</label>
              <input
                type="color"
                value={hex}
                onChange={handleColorPicker}
                className="w-full h-10 cursor-pointer rounded border-0 bg-transparent p-0"
                aria-label="System color picker"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <ChannelInput label="R" value={rgb.r} onChange={(v) => updateFromRgb({ ...rgb, r: clamp(v, 0, 255) })} max={255} />
              <ChannelInput label="G" value={rgb.g} onChange={(v) => updateFromRgb({ ...rgb, g: clamp(v, 0, 255) })} max={255} />
              <ChannelInput label="B" value={rgb.b} onChange={(v) => updateFromRgb({ ...rgb, b: clamp(v, 0, 255) })} max={255} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label, value, onChange, copyKey, copyValue, copied, onCopy,
}: {
  label: string; value: string; onChange: (v: string) => void;
  copyKey: string; copyValue: string; copied: boolean; onCopy: (k: string, v: string) => void;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 flex items-center gap-3" style={{ borderColor: "var(--color-border)" }}>
      <span className="font-mono text-sm font-bold text-gray-700 w-12 shrink-0">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-lg border px-3 py-1.5 font-mono text-sm focus:border-indigo-500 focus:outline-none min-w-0"
        style={{ borderColor: "var(--color-border)" }}
      />
      <button
        onClick={() => onCopy(copyKey, copyValue)}
        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 shrink-0"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function ChannelInput({ label, value, onChange, max }: { label: string; value: number; onChange: (v: number) => void; max: number }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-700 mb-1 block text-center">{label}</label>
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="w-full rounded-lg border px-2 py-1 text-sm font-mono text-center focus:border-indigo-500 focus:outline-none"
        style={{ borderColor: "var(--color-border)" }}
      />
    </div>
  );
}

function ContrastCard({ label, sample, bg, ratio }: { label: string; sample: RGB; bg: RGB; ratio: number }) {
  const rating = wcagRating(ratio);
  const ratingColor = rating === "AAA" ? "text-emerald-700" : rating === "AA" ? "text-emerald-600" : rating === "AA Large" ? "text-amber-600" : "text-red-600";
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
      <div
        className="px-3 py-2 text-center text-sm font-semibold"
        style={{ background: `rgb(${bg.r}, ${bg.g}, ${bg.b})`, color: `rgb(${sample.r}, ${sample.g}, ${sample.b})` }}
      >
        Sample text
      </div>
      <div className="p-2 text-center">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-mono font-bold text-gray-900">{ratio.toFixed(2)}:1</p>
        <p className={`text-xs font-semibold ${ratingColor}`}>{rating}</p>
      </div>
    </div>
  );
}
