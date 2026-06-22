"use client";

import { useState, useMemo, useRef } from "react";
import { Shuffle, RotateCcw, Sparkles, Copy, Check } from "lucide-react";

function secureRandomInt(max: number): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    const limit = Math.floor(0xffffffff / max) * max;
    let x: number;
    do {
      crypto.getRandomValues(buf);
      x = buf[0];
    } while (x >= limit);
    return x % max;
  }
  return Math.floor(Math.random() * max);
}

export default function RandomPickerPage() {
  const [input, setInput] = useState("Alice\nBob\nCharlie\nDana\nEli\nFiona\nGabriel\nHana");
  const [pickCount, setPickCount] = useState(1);
  const [unique, setUnique] = useState(true);
  const [picked, setPicked] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const items = useMemo(
    () => input.split(/\r?\n/).map((s) => s.trim()).filter((s) => s.length > 0),
    [input],
  );

  const maxPicks = unique ? items.length : 1000;
  const safeCount = Math.min(pickCount, maxPicks);

  const pick = () => {
    if (items.length === 0 || animating) return;
    setAnimating(true);
    setPicked([]);

    // Animation: show random items rapidly, then settle
    let cycles = 0;
    const totalCycles = 14;
    animationRef.current = setInterval(() => {
      if (cycles < totalCycles) {
        const preview: string[] = [];
        for (let i = 0; i < safeCount; i++) {
          preview.push(items[secureRandomInt(items.length)]);
        }
        setPicked(preview);
        cycles++;
      } else {
        if (animationRef.current) clearInterval(animationRef.current);
        // Final pick
        const final: string[] = [];
        const pool = [...items];
        for (let i = 0; i < safeCount; i++) {
          if (pool.length === 0) break;
          const idx = secureRandomInt(pool.length);
          final.push(pool[idx]);
          if (unique) pool.splice(idx, 1);
        }
        setPicked(final);
        setAnimating(false);
      }
    }, 60);
  };

  const reset = () => {
    if (animationRef.current) clearInterval(animationRef.current);
    setPicked([]);
    setAnimating(false);
  };

  const copy = async () => {
    if (picked.length === 0) return;
    await navigator.clipboard.writeText(picked.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Shuffle className="w-7 h-7 text-indigo-600" /> Random Picker / Name Draw
        </h1>
        <p className="mt-3 text-gray-600">
          Drop your list (one per line), pick N at random. Cryptographically secure via <code>crypto.getRandomValues</code>. No tracking.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-900">Your list ({items.length} item{items.length === 1 ? "" : "s"})</label>
              <button onClick={() => setInput("")} className="text-xs text-gray-500 hover:text-gray-700">Clear</button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="One item per line — e.g., raffle entries, names, options..."
              rows={12}
              className="w-full rounded-lg border px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none resize-none"
              style={{ borderColor: "var(--color-border)" }}
              spellCheck={false}
            />
          </div>

          <div className="rounded-2xl border bg-white p-5 space-y-4" style={{ borderColor: "var(--color-border)" }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Number to pick</label>
                <input
                  type="number"
                  min={1}
                  max={maxPicks}
                  value={pickCount}
                  onChange={(e) => setPickCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full rounded-lg border px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                  style={{ borderColor: "var(--color-border)" }}
                />
                {pickCount > maxPicks && (
                  <p className="text-xs text-amber-600 mt-1">Limited to {maxPicks} ({unique ? "list length" : "1000 max"})</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Mode</label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={unique}
                    onChange={(e) => setUnique(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  Without replacement (unique picks)
                </label>
              </div>
            </div>

            <button
              onClick={pick}
              disabled={items.length === 0 || animating}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 text-sm font-semibold disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${animating ? "animate-spin" : ""}`} />
              {animating ? "Picking..." : `Pick ${safeCount}`}
            </button>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border bg-white p-5 sticky top-20" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">Picked</p>
              {picked.length > 0 && !animating && (
                <div className="flex items-center gap-3">
                  <button onClick={copy} className="text-xs text-indigo-700 inline-flex items-center gap-1">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>
              )}
            </div>
            {picked.length > 0 ? (
              <ul className="space-y-2">
                {picked.map((item, i) => (
                  <li
                    key={i}
                    className={`rounded-lg border px-3 py-2.5 text-sm transition ${
                      animating ? "bg-gray-50 text-gray-400" : "bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold"
                    }`}
                    style={{ borderColor: animating ? "var(--color-border)" : "rgb(199 210 254)" }}
                  >
                    <span className="text-xs font-mono mr-2 text-gray-500">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 text-center py-8">Result appears here</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
