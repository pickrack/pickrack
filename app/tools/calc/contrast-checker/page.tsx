"use client";

import { useState, useMemo } from "react";
import { Eye, Check, X, Copy } from "lucide-react";

type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB | null {
  const h = hex.replace(/^#/, "").trim();
  if (/^[0-9a-f]{3}$/i.test(h)) {
    return { r: parseInt(h[0] + h[0], 16), g: parseInt(h[1] + h[1], 16), b: parseInt(h[2] + h[2], 16) };
  }
  if (/^[0-9a-f]{6}$/i.test(h)) {
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  return null;
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
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

type Tier = { name: string; min: number; description: string };
const TIERS: Tier[] = [
  { name: "AAA normal text", min: 7.0, description: "≥7:1 — highest standard, body text 14pt+ regular" },
  { name: "AAA large text",  min: 4.5, description: "≥4.5:1 — large text (18pt+ regular or 14pt+ bold)" },
  { name: "AA normal text",  min: 4.5, description: "≥4.5:1 — minimum for body text" },
  { name: "AA large text",   min: 3.0, description: "≥3:1 — large text only" },
  { name: "UI components",   min: 3.0, description: "≥3:1 — non-text UI elements (buttons, form borders)" },
];

export default function ContrastCheckerPage() {
  const [fg, setFg] = useState("#1a202c");
  const [bg, setBg] = useState("#ffffff");
  const [copied, setCopied] = useState<string | null>(null);

  const fgRgb = useMemo(() => hexToRgb(fg), [fg]);
  const bgRgb = useMemo(() => hexToRgb(bg), [bg]);
  const ratio = fgRgb && bgRgb ? contrast(fgRgb, bgRgb) : null;

  const swap = () => { setFg(bg); setBg(fg); };

  const copyRatio = async () => {
    if (ratio === null) return;
    await navigator.clipboard.writeText(`${ratio.toFixed(2)}:1`);
    setCopied("ratio");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Eye className="w-7 h-7 text-indigo-600" /> WCAG Contrast Checker
        </h1>
        <p className="mt-3 text-gray-600">
          Foreground / background colors → contrast ratio + WCAG AA / AAA rating. Sample text preview at multiple sizes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <ColorBox label="Foreground (text)" value={fg} onChange={setFg} />
        <ColorBox label="Background" value={bg} onChange={setBg} />
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={swap}
          className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
          style={{ borderColor: "var(--color-border)" }}
        >
          ⇅ Swap colors
        </button>
      </div>

      {ratio !== null && fgRgb && bgRgb && (
        <>
          <div className="rounded-2xl border p-8 text-center mb-6" style={{ background: bg, borderColor: "var(--color-border)" }}>
            <p className="font-semibold mb-2" style={{ color: fg, fontSize: "11px" }}>11pt sample (graphic text)</p>
            <p className="font-medium mb-2" style={{ color: fg, fontSize: "14px" }}>14pt regular sample</p>
            <p className="font-bold mb-2" style={{ color: fg, fontSize: "14px" }}>14pt bold sample (counts as &quot;large&quot;)</p>
            <p className="font-medium mb-2" style={{ color: fg, fontSize: "18px" }}>18pt regular sample (counts as &quot;large&quot;)</p>
            <p className="font-bold" style={{ color: fg, fontSize: "24px" }}>24pt bold heading</p>
          </div>

          <div className="rounded-2xl border bg-white p-6 mb-6" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contrast ratio</p>
              <button onClick={copyRatio} className="text-xs text-indigo-700 inline-flex items-center gap-1">
                {copied === "ratio" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied === "ratio" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-5xl font-bold font-mono text-gray-900 text-center mb-6">{ratio.toFixed(2)}<span className="text-2xl text-gray-500">:1</span></p>

            <table className="w-full text-sm">
              <tbody>
                {TIERS.map((tier) => {
                  const pass = ratio >= tier.min;
                  return (
                    <tr key={tier.name} className="border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
                      <td className="py-2.5 pr-3">
                        {pass ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <Check className="w-4 h-4" /> Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                            <X className="w-4 h-4" /> Fail
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 font-medium text-gray-900">{tier.name}</td>
                      <td className="py-2.5 text-xs text-gray-500">{tier.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border bg-amber-50 border-amber-200 p-4 text-sm text-amber-900" style={{ borderColor: "rgb(253 230 138)" }}>
            <p className="font-semibold mb-1">Tips to improve contrast</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>For body text aim for <strong>4.5:1 (AA)</strong> or higher. AAA (7:1) is gold-standard for max accessibility.</li>
              <li>Darker foreground or lighter background usually fixes failures faster than the opposite.</li>
              <li>UI components like icons, button borders, and focus rings only need 3:1 against their background.</li>
              <li>Large bold text (14pt+ bold or 18pt+ regular) can use 3:1 (AA) / 4.5:1 (AAA).</li>
            </ul>
          </div>
        </>
      )}
      {ratio === null && (
        <p className="text-center text-amber-700 text-sm">Enter valid hex colors above (e.g., #ff0000 or #f00).</p>
      )}
    </div>
  );
}

function ColorBox({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--color-border)" }}>
      <label className="text-xs font-medium text-gray-700 mb-2 block">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-14 h-14 rounded-lg cursor-pointer border-0 bg-transparent"
        />
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#?[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v.startsWith("#") ? v : "#" + v);
          }}
          className="flex-1 rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none uppercase"
          style={{ borderColor: "var(--color-border)" }}
        />
      </div>
    </div>
  );
}
