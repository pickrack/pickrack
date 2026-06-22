"use client";

import { useState, useMemo } from "react";
import { DollarSign, Users, Percent } from "lucide-react";

const PRESET_TIPS = [10, 15, 18, 20, 25];

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "VND", symbol: "₫" },
  { code: "JPY", symbol: "¥" },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
];

function format(n: number, symbol: string, decimals = 2): string {
  if (!isFinite(n)) return `${symbol}0`;
  const fixed = decimals === 0 ? Math.round(n) : Number(n.toFixed(decimals));
  return `${symbol}${fixed.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export default function TipCalculatorPage() {
  const [bill, setBill] = useState("50");
  const [tip, setTip] = useState(18);
  const [people, setPeople] = useState(1);
  const [currency, setCurrency] = useState("USD");
  const [roundUp, setRoundUp] = useState(false);

  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$";
  const decimals = currency === "VND" || currency === "JPY" ? 0 : 2;

  const result = useMemo(() => {
    const b = parseFloat(bill) || 0;
    if (b <= 0 || people < 1) {
      return { ok: false as const };
    }
    const tipAmount = (b * tip) / 100;
    let total = b + tipAmount;
    if (roundUp) total = Math.ceil(total);
    const perPerson = total / people;
    const tipPerPerson = tipAmount / people;
    return { ok: true as const, tipAmount, total, perPerson, tipPerPerson };
  }, [bill, tip, people, roundUp]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Tip Calculator</h1>
        <p className="mt-3 text-gray-600">
          Split a bill, add a tip, and round up — fast math for restaurants, taxis, and group meals.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 sm:p-6 space-y-5" style={{ borderColor: "var(--color-border)" }}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-1 block flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-indigo-600" /> Bill amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{symbol}</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={decimals === 0 ? 1000 : 0.01}
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                className="w-full rounded-xl border pl-7 pr-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-1 block">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
              style={{ borderColor: "var(--color-border)" }}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-indigo-600" /> Tip %
            <span className="ml-auto text-indigo-700 font-bold">{tip}%</span>
          </label>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {PRESET_TIPS.map((p) => (
              <button
                key={p}
                onClick={() => setTip(p)}
                className={`rounded-lg border py-2 text-sm font-medium transition ${
                  tip === p
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "bg-white text-gray-700 hover:border-indigo-300"
                }`}
                style={{ borderColor: tip === p ? undefined : "var(--color-border)" }}
              >
                {p}%
              </button>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={tip}
            onChange={(e) => setTip(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" /> Split between
            <span className="ml-auto text-indigo-700 font-bold">
              {people} {people === 1 ? "person" : "people"}
            </span>
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPeople((p) => Math.max(1, p - 1))}
              className="rounded-lg border w-9 h-9 text-lg font-bold hover:border-indigo-400"
              style={{ borderColor: "var(--color-border)" }}
              aria-label="Decrease"
            >
              −
            </button>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={people}
              onChange={(e) => setPeople(parseInt(e.target.value, 10))}
              className="flex-1 accent-indigo-600"
            />
            <button
              onClick={() => setPeople((p) => Math.min(50, p + 1))}
              className="rounded-lg border w-9 h-9 text-lg font-bold hover:border-indigo-400"
              style={{ borderColor: "var(--color-border)" }}
              aria-label="Increase"
            >
              +
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800">
          <input
            type="checkbox"
            checked={roundUp}
            onChange={(e) => setRoundUp(e.target.checked)}
            className="accent-indigo-600 w-4 h-4"
          />
          Round total up to nearest whole {symbol}
        </label>
      </div>

      {result.ok && (
        <div className="mt-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-6 grid sm:grid-cols-2 gap-4">
          <Stat label="Tip amount" value={format(result.tipAmount, symbol, decimals)} />
          <Stat label="Total" value={format(result.total, symbol, decimals)} />
          <Stat label="Tip per person" value={format(result.tipPerPerson, symbol, decimals)} />
          <Stat label="Total per person" value={format(result.perPerson, symbol, decimals)} highlight />
        </div>
      )}

      {!result.ok && (
        <p className="mt-6 text-sm text-gray-500 text-center">Enter a bill amount above to see the split.</p>
      )}
    </div>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 text-center ${highlight ? "bg-indigo-600 text-white" : "bg-white"}`}>
      <p className={`text-xs uppercase tracking-wide ${highlight ? "text-indigo-100" : "text-gray-500"}`}>{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? "text-white" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}
