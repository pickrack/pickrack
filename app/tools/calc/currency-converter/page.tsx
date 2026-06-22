"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeftRight, Loader2, RefreshCw, AlertTriangle } from "lucide-react";

type Rates = { base: string; date: string; rates: Record<string, number> };

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
];

const CACHE_KEY = "pickrack:currency:rates";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function format(n: number, code: string): string {
  if (!isFinite(n)) return "—";
  const noDecimal = code === "VND" || code === "JPY" || code === "KRW" || code === "IDR";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: noDecimal ? 0 : 2,
    maximumFractionDigits: noDecimal ? 0 : 2,
  });
}

export default function CurrencyConverterPage() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("VND");
  const [amount, setAmount] = useState("100");
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async (base: string, force = false) => {
    if (!force) {
      try {
        const cached = localStorage.getItem(`${CACHE_KEY}:${base}`);
        if (cached) {
          const parsed = JSON.parse(cached) as { data: Rates; ts: number };
          if (Date.now() - parsed.ts < CACHE_TTL_MS) {
            setRates(parsed.data);
            setLoading(false);
            return;
          }
        }
      } catch {
        /* corrupted cache */
      }
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/currency/rates/?base=${encodeURIComponent(base)}`);
      const data = await res.json();
      if (!res.ok || !data.rates) {
        throw new Error(data.error || "Rate provider returned an error.");
      }
      const r: Rates = {
        base: data.base,
        date: data.date ?? new Date().toISOString(),
        rates: data.rates,
      };
      setRates(r);
      localStorage.setItem(`${CACHE_KEY}:${base}`, JSON.stringify({ data: r, ts: Date.now() }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load rates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates(from);
  }, [from, fetchRates]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const num = parseFloat(amount) || 0;
  const rate = rates?.rates[to];
  const converted = rate ? num * rate : null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Currency Converter</h1>
        <p className="mt-3 text-gray-600">
          Convert between 28 major currencies with live rates. Cached locally, no signup, no upsell.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 sm:p-6" style={{ borderColor: "var(--color-border)" }}>
        <label className="text-sm font-semibold text-gray-900 mb-1 block">Amount</label>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={0.01}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border px-3 py-3 text-lg font-medium focus:border-indigo-500 focus:outline-none"
          style={{ borderColor: "var(--color-border)" }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end mt-4">
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-1 block">From</label>
            <CurrencySelect value={from} onChange={setFrom} />
          </div>
          <button
            onClick={swap}
            className="rounded-xl border bg-white p-3 hover:border-indigo-400 self-end sm:mb-0 mb-2 mx-auto sm:mx-0"
            style={{ borderColor: "var(--color-border)" }}
            aria-label="Swap currencies"
          >
            <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
          </button>
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-1 block">To</label>
            <CurrencySelect value={to} onChange={setTo} />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 flex gap-2 text-sm text-rose-800">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="mt-6 rounded-2xl border bg-white p-6 flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading live rates…
        </div>
      )}

      {!loading && converted !== null && rate && (
        <div className="mt-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-6 text-center">
          <p className="text-sm text-indigo-700 mb-2">
            {format(num, from)} {from} =
          </p>
          <p className="text-4xl sm:text-5xl font-bold text-indigo-900 break-all">
            {format(converted, to)} <span className="text-2xl">{to}</span>
          </p>
          <p className="text-xs text-indigo-700 mt-3">
            1 {from} = {format(rate, to)} {to}
            {rates && (
              <>
                {" "}
                ·{" "}
                <button onClick={() => fetchRates(from, true)} className="inline-flex items-center gap-1 hover:underline">
                  <RefreshCw className="w-3 h-3" /> updated {new Date(rates.date).toLocaleString()}
                </button>
              </>
            )}
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-500 text-center">
        Rates from{" "}
        <a href="https://www.exchangerate-api.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
          exchangerate-api.com
        </a>{" "}
        (free tier). Cached 1 hour. Mid-market rates — your bank or card may charge a 2-4% spread.
      </p>
    </div>
  );
}

function CurrencySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border px-3 py-3 text-sm focus:border-indigo-500 focus:outline-none bg-white"
      style={{ borderColor: "var(--color-border)" }}
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.code} — {c.name}
        </option>
      ))}
    </select>
  );
}
