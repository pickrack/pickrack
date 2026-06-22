"use client";

import { useState } from "react";
import { Percent, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

type Mode = "of" | "is-of" | "change" | "increase" | "decrease";

const MODES: { id: Mode; label: string; question: (a: string, b: string) => string }[] = [
  { id: "of", label: "X% of Y", question: (a, b) => `What is ${a || "X"}% of ${b || "Y"}?` },
  { id: "is-of", label: "X is what % of Y", question: (a, b) => `${a || "X"} is what percent of ${b || "Y"}?` },
  { id: "change", label: "% change X → Y", question: (a, b) => `Percentage change from ${a || "X"} to ${b || "Y"}?` },
  { id: "increase", label: "X increased by Y%", question: (a, b) => `What is ${a || "X"} increased by ${b || "Y"}%?` },
  { id: "decrease", label: "X decreased by Y%", question: (a, b) => `What is ${a || "X"} decreased by ${b || "Y"}%?` },
];

function compute(mode: Mode, a: number, b: number): { value: number; label: string } | null {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  switch (mode) {
    case "of":
      return { value: (a / 100) * b, label: `${a}% of ${b}` };
    case "is-of":
      if (b === 0) return { value: NaN, label: "Cannot divide by zero" };
      return { value: (a / b) * 100, label: `${a} is X% of ${b}`, };
    case "change":
      if (a === 0) return { value: NaN, label: "Cannot compute change from 0" };
      return { value: ((b - a) / a) * 100, label: `Change from ${a} to ${b}` };
    case "increase":
      return { value: a + (a * b) / 100, label: `${a} + ${b}% = result` };
    case "decrease":
      return { value: a - (a * b) / 100, label: `${a} − ${b}% = result` };
  }
}

export default function PercentageCalcPage() {
  const [mode, setMode] = useState<Mode>("of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const numA = parseFloat(a);
  const numB = parseFloat(b);
  const result = a !== "" && b !== "" ? compute(mode, numA, numB) : null;
  const currentMode = MODES.find((m) => m.id === mode)!;

  const labels = (() => {
    switch (mode) {
      case "of": return { aLabel: "Percentage (X)", aSuffix: "%", bLabel: "Of value (Y)", bSuffix: "" };
      case "is-of": return { aLabel: "Value (X)", aSuffix: "", bLabel: "Total (Y)", bSuffix: "" };
      case "change": return { aLabel: "Original (X)", aSuffix: "", bLabel: "New (Y)", bSuffix: "" };
      case "increase":
      case "decrease": return { aLabel: "Starting value (X)", aSuffix: "", bLabel: "Percent (Y)", bSuffix: "%" };
    }
  })();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Percent className="w-7 h-7 text-indigo-600" /> Percentage Calculator
        </h1>
        <p className="mt-3 text-gray-600">
          Five common percentage operations: percent of, ratio, change, increase, decrease. Live result as you type.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
        <label className="text-xs font-medium text-gray-700 mb-2 block">Calculation type</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`p-2 rounded-lg border text-xs font-medium transition ${
                mode === m.id ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-white"
              }`}
              style={{ borderColor: mode === m.id ? undefined : "var(--color-border)" }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-sm text-gray-700 mb-4">{currentMode.question(a, b)}</p>

        <div className="grid sm:grid-cols-[1fr_auto_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">{labels.aLabel}</label>
            <div className="flex items-center border rounded-lg" style={{ borderColor: "var(--color-border)" }}>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="0"
                className="flex-1 px-3 py-2 text-sm font-mono focus:outline-none"
                step="any"
              />
              {labels.aSuffix && <span className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-l" style={{ borderColor: "var(--color-border)" }}>{labels.aSuffix}</span>}
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-gray-400 mb-3 mx-auto" />

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">{labels.bLabel}</label>
            <div className="flex items-center border rounded-lg" style={{ borderColor: "var(--color-border)" }}>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="0"
                className="flex-1 px-3 py-2 text-sm font-mono focus:outline-none"
                step="any"
              />
              {labels.bSuffix && <span className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-l" style={{ borderColor: "var(--color-border)" }}>{labels.bSuffix}</span>}
            </div>
          </div>

          <div className="hidden sm:block" />
        </div>
      </div>

      <div className="rounded-2xl border bg-indigo-50 border-indigo-200 p-6 text-center" style={{ borderColor: "rgb(199 210 254)" }}>
        <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-2">Result</p>
        {result ? (
          Number.isFinite(result.value) ? (
            <>
              <p className="text-4xl font-bold text-indigo-700 font-mono">
                {result.value.toLocaleString("en-US", { maximumFractionDigits: 6, minimumFractionDigits: 0 })}
                {mode === "is-of" || mode === "change" ? "%" : ""}
              </p>
              <p className="text-xs text-indigo-600 mt-2">{result.label}</p>
              {mode === "change" && Number.isFinite(result.value) && (
                <p className="text-xs text-indigo-600 mt-1 inline-flex items-center gap-1">
                  {result.value > 0 ? <TrendingUp className="w-3 h-3" /> : result.value < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                  {result.value > 0 ? "Increase" : result.value < 0 ? "Decrease" : "No change"}
                </p>
              )}
            </>
          ) : (
            <p className="text-amber-700 text-sm">{result.label}</p>
          )
        ) : (
          <p className="text-gray-400 text-sm">Enter both values to see the result</p>
        )}
      </div>
    </div>
  );
}
