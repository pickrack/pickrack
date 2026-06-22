"use client";

import { useState, useMemo } from "react";
import { Activity, AlertTriangle } from "lucide-react";

type Unit = "metric" | "imperial";

type BmiBand = {
  label: string;
  min: number;
  max: number;
  color: string;
  bg: string;
};

const BANDS: BmiBand[] = [
  { label: "Underweight", min: 0, max: 18.5, color: "text-sky-700", bg: "bg-sky-100 border-sky-200" },
  { label: "Healthy", min: 18.5, max: 25, color: "text-emerald-700", bg: "bg-emerald-100 border-emerald-200" },
  { label: "Overweight", min: 25, max: 30, color: "text-amber-700", bg: "bg-amber-100 border-amber-200" },
  { label: "Obese", min: 30, max: 100, color: "text-rose-700", bg: "bg-rose-100 border-rose-200" },
];

function bandFor(bmi: number): BmiBand {
  return BANDS.find((b) => bmi >= b.min && bmi < b.max) ?? BANDS[BANDS.length - 1];
}

export default function BmiCalculatorPage() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [heightCm, setHeightCm] = useState("170");
  const [weightKg, setWeightKg] = useState("65");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("7");
  const [weightLb, setWeightLb] = useState("143");

  const result = useMemo(() => {
    let h_m: number, w_kg: number;
    if (unit === "metric") {
      h_m = (parseFloat(heightCm) || 0) / 100;
      w_kg = parseFloat(weightKg) || 0;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      const totalIn = ft * 12 + inches;
      h_m = totalIn * 0.0254;
      w_kg = (parseFloat(weightLb) || 0) * 0.453592;
    }
    if (h_m <= 0 || w_kg <= 0) return { ok: false as const };
    const bmi = w_kg / (h_m * h_m);
    if (!isFinite(bmi)) return { ok: false as const };

    // Healthy weight range for this height (BMI 18.5 - 24.9)
    const minHealthyKg = 18.5 * h_m * h_m;
    const maxHealthyKg = 24.9 * h_m * h_m;
    const minHealthyLb = minHealthyKg / 0.453592;
    const maxHealthyLb = maxHealthyKg / 0.453592;

    return {
      ok: true as const,
      bmi,
      band: bandFor(bmi),
      healthy:
        unit === "metric"
          ? `${minHealthyKg.toFixed(1)} – ${maxHealthyKg.toFixed(1)} kg`
          : `${minHealthyLb.toFixed(0)} – ${maxHealthyLb.toFixed(0)} lb`,
    };
  }, [unit, heightCm, weightKg, heightFt, heightIn, weightLb]);

  // Position of BMI on the 14-40 scale for the gauge bar (0% .. 100%)
  const gaugePct = result.ok ? Math.max(0, Math.min(100, ((result.bmi - 14) / (40 - 14)) * 100)) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">BMI Calculator</h1>
        <p className="mt-3 text-gray-600">
          Body Mass Index from height and weight, with a healthy-range estimate. Metric and imperial supported.
        </p>
      </div>

      <div className="mb-6 inline-flex rounded-xl border p-1 bg-white mx-auto" style={{ borderColor: "var(--color-border)" }}>
        <button
          onClick={() => setUnit("metric")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
            unit === "metric" ? "bg-indigo-600 text-white" : "text-gray-600"
          }`}
        >
          Metric (cm / kg)
        </button>
        <button
          onClick={() => setUnit("imperial")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
            unit === "imperial" ? "bg-indigo-600 text-white" : "text-gray-600"
          }`}
        >
          Imperial (ft / lb)
        </button>
      </div>

      <div className="rounded-2xl border bg-white p-5 sm:p-6 space-y-4" style={{ borderColor: "var(--color-border)" }}>
        {unit === "metric" ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Height (cm)" value={heightCm} onChange={setHeightCm} suffix="cm" />
            <Field label="Weight (kg)" value={weightKg} onChange={setWeightKg} suffix="kg" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Height (ft)" value={heightFt} onChange={setHeightFt} suffix="ft" />
            <Field label="Height (in)" value={heightIn} onChange={setHeightIn} suffix="in" />
            <Field label="Weight (lb)" value={weightLb} onChange={setWeightLb} suffix="lb" />
          </div>
        )}
      </div>

      {result.ok && (
        <>
          <div className={`mt-6 rounded-2xl border-2 p-6 text-center ${result.band.bg}`}>
            <p className="text-sm text-gray-600 mb-1">Your BMI</p>
            <p className={`text-5xl font-bold ${result.band.color}`}>{result.bmi.toFixed(1)}</p>
            <p className={`text-lg font-semibold mt-2 ${result.band.color}`}>{result.band.label}</p>
            <p className="text-sm text-gray-700 mt-3">Healthy weight for your height: <strong>{result.healthy}</strong></p>
          </div>

          <div className="mt-4 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> BMI range
            </p>
            <div className="relative h-3 rounded-full overflow-hidden flex">
              <div className="bg-sky-400 flex-[4.5]" title="Underweight" />
              <div className="bg-emerald-400 flex-[6.5]" title="Healthy" />
              <div className="bg-amber-400 flex-[5]" title="Overweight" />
              <div className="bg-rose-400 flex-[10]" title="Obese" />
            </div>
            <div
              className="relative h-0"
              style={{ marginTop: -22 }}
              aria-hidden
            >
              <div
                className="absolute w-1 h-6 bg-gray-900 rounded"
                style={{ left: `${gaugePct}%`, transform: "translateX(-50%)" }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-3">
              <span>14</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3 text-sm text-amber-900">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <p>
              BMI is a screening tool, not a diagnosis. Athletes with high muscle mass often score &quot;overweight&quot; despite being healthy. Children, pregnant women, and elderly need different metrics. Talk to a clinician for personal advice.
            </p>
          </div>
        </>
      )}

      {!result.ok && (
        <p className="mt-6 text-sm text-gray-500 text-center">Enter height and weight to see your BMI.</p>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-900 mb-1 block">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={0.1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border pl-3 pr-10 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          style={{ borderColor: "var(--color-border)" }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">{suffix}</span>
      </div>
    </div>
  );
}
