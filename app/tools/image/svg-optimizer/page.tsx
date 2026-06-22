"use client";

import { useState, useMemo } from "react";
import { Sparkles, Copy, Check, Download, Upload } from "lucide-react";

type Options = {
  stripComments: boolean;
  stripDoctype: boolean;
  stripXmlDeclaration: boolean;
  collapseWhitespace: boolean;
  roundDecimals: boolean;
  decimals: number;
  shortenColors: boolean;
  removeMetadata: boolean;
  removeEmptyGroups: boolean;
  removeDefaultAttrs: boolean;
};

function optimizeSvg(input: string, opts: Options): string {
  if (!input.trim()) return "";
  let svg = input;

  if (opts.stripXmlDeclaration) {
    svg = svg.replace(/<\?xml[^?]*\?>\s*/g, "");
  }
  if (opts.stripDoctype) {
    svg = svg.replace(/<!DOCTYPE[^>]*>\s*/g, "");
  }
  if (opts.stripComments) {
    svg = svg.replace(/<!--[\s\S]*?-->/g, "");
  }
  if (opts.removeMetadata) {
    svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/g, "");
    svg = svg.replace(/<title[\s\S]*?<\/title>/g, "");
    svg = svg.replace(/<desc[\s\S]*?<\/desc>/g, "");
    svg = svg.replace(/\s*xmlns:sodipodi="[^"]*"/g, "");
    svg = svg.replace(/\s*xmlns:inkscape="[^"]*"/g, "");
    svg = svg.replace(/\s*xmlns:dc="[^"]*"/g, "");
    svg = svg.replace(/\s*xmlns:rdf="[^"]*"/g, "");
    svg = svg.replace(/\s*xmlns:cc="[^"]*"/g, "");
    svg = svg.replace(/\s*(sodipodi|inkscape|dc|rdf|cc):[a-zA-Z-]+="[^"]*"/g, "");
  }
  if (opts.shortenColors) {
    // #aabbcc → #abc when possible
    svg = svg.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, "#$1$2$3");
    // rgb(255,255,255) → #fff
    svg = svg.replace(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g, (_, r, g, b) => {
      const hex = "#" + [r, g, b].map((n) => Math.max(0, Math.min(255, parseInt(n, 10))).toString(16).padStart(2, "0")).join("");
      const m = hex.match(/^#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3$/i);
      return m ? `#${m[1]}${m[2]}${m[3]}` : hex;
    });
    // Common named colors → hex (shorter where possible)
    const namedToHex: Record<string, string> = {
      black: "#000", white: "#fff", red: "red", green: "green", blue: "blue",
    };
    Object.entries(namedToHex).forEach(([name, hex]) => {
      if (hex.length < name.length) {
        svg = svg.replace(new RegExp(`(["'\\s=])(${name})\\b`, "gi"), `$1${hex}`);
      }
    });
  }
  if (opts.roundDecimals) {
    const d = Math.max(0, Math.min(6, opts.decimals));
    svg = svg.replace(/(-?\d+)\.(\d+)/g, (_, intPart, decPart) => {
      const trimmed = decPart.slice(0, d);
      if (trimmed.length === 0 || /^0+$/.test(trimmed)) return intPart;
      return `${intPart}.${trimmed.replace(/0+$/, "")}`;
    });
  }
  if (opts.removeEmptyGroups) {
    let prev = "";
    while (prev !== svg) {
      prev = svg;
      svg = svg.replace(/<g[^>]*>\s*<\/g>/g, "");
    }
  }
  if (opts.removeDefaultAttrs) {
    svg = svg.replace(/\s+fill="black"/g, "");
    svg = svg.replace(/\s+stroke="none"/g, "");
    svg = svg.replace(/\s+stroke-width="1"/g, "");
    svg = svg.replace(/\s+opacity="1"/g, "");
    svg = svg.replace(/\s+fill-opacity="1"/g, "");
    svg = svg.replace(/\s+stroke-opacity="1"/g, "");
  }
  if (opts.collapseWhitespace) {
    svg = svg.replace(/>\s+</g, "><");
    svg = svg.replace(/\s+/g, " ");
    svg = svg.replace(/\s*([=,;])\s*/g, "$1");
  }

  return svg.trim();
}

export default function SvgOptimizerPage() {
  const [input, setInput] = useState("");
  const [opts, setOpts] = useState<Options>({
    stripComments: true,
    stripDoctype: true,
    stripXmlDeclaration: true,
    collapseWhitespace: true,
    roundDecimals: true,
    decimals: 2,
    shortenColors: true,
    removeMetadata: true,
    removeEmptyGroups: true,
    removeDefaultAttrs: true,
  });
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => optimizeSvg(input, opts), [input, opts]);
  const inputSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;
  const savings = inputSize > 0 ? ((inputSize - outputSize) / inputSize) * 100 : 0;

  const handleFile = (file: File) => {
    if (file.size > 5_000_000) {
      alert("SVG larger than 5MB — process locally instead.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setInput(reader.result as string);
    reader.readAsText(file);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([output], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Sparkles className="w-7 h-7 text-indigo-600" /> SVG Optimizer
        </h1>
        <p className="mt-3 text-gray-600">
          Strip comments, metadata, whitespace; round decimals; shorten colors. Browser-side. Live preview.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-sm font-semibold text-gray-900 mb-3">Optimization options</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          <Checkbox checked={opts.stripComments} onChange={(v) => setOpts({ ...opts, stripComments: v })} label="Strip comments" />
          <Checkbox checked={opts.stripDoctype} onChange={(v) => setOpts({ ...opts, stripDoctype: v })} label="Strip DOCTYPE" />
          <Checkbox checked={opts.stripXmlDeclaration} onChange={(v) => setOpts({ ...opts, stripXmlDeclaration: v })} label="Strip XML declaration" />
          <Checkbox checked={opts.removeMetadata} onChange={(v) => setOpts({ ...opts, removeMetadata: v })} label="Remove Inkscape/Sodipodi metadata" />
          <Checkbox checked={opts.removeEmptyGroups} onChange={(v) => setOpts({ ...opts, removeEmptyGroups: v })} label="Remove empty <g>" />
          <Checkbox checked={opts.removeDefaultAttrs} onChange={(v) => setOpts({ ...opts, removeDefaultAttrs: v })} label="Remove default attributes" />
          <Checkbox checked={opts.shortenColors} onChange={(v) => setOpts({ ...opts, shortenColors: v })} label="Shorten colors (#abc, named)" />
          <Checkbox checked={opts.collapseWhitespace} onChange={(v) => setOpts({ ...opts, collapseWhitespace: v })} label="Collapse whitespace" />
          <Checkbox checked={opts.roundDecimals} onChange={(v) => setOpts({ ...opts, roundDecimals: v })} label={`Round to ${opts.decimals} decimals`} />
        </div>
        {opts.roundDecimals && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-gray-600">Decimals:</span>
            <input
              type="range"
              min={0}
              max={6}
              value={opts.decimals}
              onChange={(e) => setOpts({ ...opts, decimals: parseInt(e.target.value, 10) })}
              className="flex-1 accent-indigo-600 max-w-xs"
            />
            <span className="font-mono w-4">{opts.decimals}</span>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Original SVG</label>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-500">{inputSize.toLocaleString()} bytes</span>
              <label className="inline-flex items-center gap-1 text-indigo-700 cursor-pointer">
                <Upload className="w-3 h-3" /> Upload
                <input type="file" accept=".svg,image/svg+xml" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </label>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste SVG markup or upload .svg file..."
            className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-xs focus:border-indigo-500 focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)" }}
            spellCheck={false}
          />
          {input && (
            <div className="mt-2 rounded-lg border p-3 flex items-center justify-center bg-white" style={{ borderColor: "var(--color-border)", minHeight: 80 }}>
              <div dangerouslySetInnerHTML={{ __html: input }} className="max-h-64 [&_svg]:max-h-64 [&_svg]:max-w-full" />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Optimized</label>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-500">
                {outputSize.toLocaleString()} bytes
                {savings > 0 && <span className="text-emerald-600 ml-1 font-semibold">−{savings.toFixed(1)}%</span>}
              </span>
              <button onClick={copy} disabled={!output} className="inline-flex items-center gap-1 text-indigo-700 disabled:opacity-50">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={download} disabled={!output} className="inline-flex items-center gap-1 text-indigo-700 disabled:opacity-50">
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-xs bg-gray-50 resize-none"
            style={{ borderColor: "var(--color-border)" }}
          />
          {output && (
            <div className="mt-2 rounded-lg border p-3 flex items-center justify-center bg-white" style={{ borderColor: "var(--color-border)", minHeight: 80 }}>
              <div dangerouslySetInnerHTML={{ __html: output }} className="max-h-64 [&_svg]:max-h-64 [&_svg]:max-w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex items-center gap-1.5 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-indigo-600" />
      {label}
    </label>
  );
}
