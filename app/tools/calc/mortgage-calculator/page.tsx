"use client";

import { useState, useMemo } from "react";
import { Home, Calendar, DollarSign, Percent, TrendingDown } from "lucide-react";

type Row = {
  month: number;
  year: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
  cumulativeInterest: number;
};

function computeAmortization(
  principal: number,
  annualRate: number,
  termYears: number,
  extraMonthly: number,
): { monthlyPayment: number; rows: Row[]; totalInterest: number; totalPaid: number; monthsActual: number } {
  const months = termYears * 12;
  const r = annualRate / 100 / 12;
  if (principal <= 0 || annualRate < 0 || months <= 0) {
    return { monthlyPayment: 0, rows: [], totalInterest: 0, totalPaid: 0, monthsActual: 0 };
  }
  const monthlyPayment =
    r === 0 ? principal / months : (principal * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1);

  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;
  const rows: Row[] = [];

  for (let i = 1; i <= months * 2 && balance > 0.01; i++) {
    const interest = balance * r;
    let principalPaid = monthlyPayment - interest + extraMonthly;
    if (principalPaid > balance) principalPaid = balance;
    const paymentActual = principalPaid + interest;
    balance -= principalPaid;
    totalInterest += interest;
    totalPaid += paymentActual;
    rows.push({
      month: i,
      year: Math.ceil(i / 12),
      payment: paymentActual,
      interest,
      principal: principalPaid,
      balance: Math.max(0, balance),
      cumulativeInterest: totalInterest,
    });
    if (balance <= 0.01) break;
  }
  return { monthlyPayment, rows, totalInterest, totalPaid, monthsActual: rows.length };
}

function fmt(n: number, decimals: number = 2): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function MortgageCalcPage() {
  const [amount, setAmount] = useState(300_000);
  const [rate, setRate] = useState(7.0);
  const [years, setYears] = useState(30);
  const [extra, setExtra] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => computeAmortization(amount, rate, years, extra), [amount, rate, years, extra]);
  const baseline = useMemo(() => computeAmortization(amount, rate, years, 0), [amount, rate, years]);

  const monthsSaved = baseline.monthsActual - result.monthsActual;
  const interestSaved = baseline.totalInterest - result.totalInterest;
  const principalPct = result.totalPaid > 0 ? (amount / result.totalPaid) * 100 : 0;
  const interestPct = 100 - principalPct;

  const yearSummary = useMemo(() => {
    const map = new Map<number, { payment: number; interest: number; principal: number; balance: number }>();
    for (const r of result.rows) {
      const existing = map.get(r.year) || { payment: 0, interest: 0, principal: 0, balance: r.balance };
      existing.payment += r.payment;
      existing.interest += r.interest;
      existing.principal += r.principal;
      existing.balance = r.balance;
      map.set(r.year, existing);
    }
    return Array.from(map.entries()).map(([year, v]) => ({ year, ...v }));
  }, [result.rows]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Home className="w-7 h-7 text-indigo-600" /> Mortgage Calculator
        </h1>
        <p className="mt-3 text-gray-600">
          Monthly payment, total interest, amortization schedule. Extra-payment what-if. Pure US-style fixed-rate mortgage math.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 space-y-4" style={{ borderColor: "var(--color-border)" }}>
            <NumField icon={<DollarSign className="w-4 h-4" />} label="Loan amount" value={amount} onChange={setAmount} step={1000} suffix="USD" />
            <NumField icon={<Percent className="w-4 h-4" />} label="Annual interest rate" value={rate} onChange={setRate} step={0.05} suffix="%" decimals={2} />
            <NumField icon={<Calendar className="w-4 h-4" />} label="Loan term" value={years} onChange={setYears} step={1} suffix="years" />
            <NumField icon={<TrendingDown className="w-4 h-4" />} label="Extra monthly payment (optional)" value={extra} onChange={setExtra} step={50} suffix="USD" />
          </div>

          <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Year-by-year amortization</p>
              <button onClick={() => setShowTable(!showTable)} className="text-xs text-indigo-700 hover:underline">
                {showTable ? "Hide" : "Show table"}
              </button>
            </div>
            {showTable && (
              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left border-b" style={{ borderColor: "var(--color-border)" }}>
                      <th className="py-2 pr-3 font-semibold text-gray-700">Year</th>
                      <th className="py-2 pr-3 font-semibold text-gray-700 text-right">Paid</th>
                      <th className="py-2 pr-3 font-semibold text-gray-700 text-right">Interest</th>
                      <th className="py-2 pr-3 font-semibold text-gray-700 text-right">Principal</th>
                      <th className="py-2 pr-3 font-semibold text-gray-700 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearSummary.map((y) => (
                      <tr key={y.year} className="border-b" style={{ borderColor: "var(--color-border)" }}>
                        <td className="py-1.5 pr-3 font-mono">{y.year}</td>
                        <td className="py-1.5 pr-3 font-mono text-right">{fmt(y.payment, 0)}</td>
                        <td className="py-1.5 pr-3 font-mono text-right text-red-600">{fmt(y.interest, 0)}</td>
                        <td className="py-1.5 pr-3 font-mono text-right text-emerald-600">{fmt(y.principal, 0)}</td>
                        <td className="py-1.5 pr-3 font-mono text-right">{fmt(y.balance, 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 space-y-3 sticky top-20" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Monthly payment</p>
            <p className="text-3xl font-bold text-indigo-600 font-mono">${fmt(result.monthlyPayment + extra, 2)}</p>
            <p className="text-xs text-gray-500">
              Base: ${fmt(result.monthlyPayment, 2)}{extra > 0 ? ` + $${fmt(extra, 2)} extra` : ""}
            </p>

            <div className="border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
              <Stat label="Total paid" value={`$${fmt(result.totalPaid, 0)}`} />
              <Stat label="Total interest" value={`$${fmt(result.totalInterest, 0)}`} accent="red" />
              <Stat label="Payoff in" value={`${Math.floor(result.monthsActual / 12)}y ${result.monthsActual % 12}m`} />
            </div>

            {extra > 0 && monthsSaved > 0 && (
              <div className="border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
                <p className="text-xs font-semibold text-emerald-700 mb-1">With extra payment:</p>
                <Stat label="Months saved" value={`${monthsSaved} (${Math.floor(monthsSaved / 12)}y ${monthsSaved % 12}m)`} accent="green" />
                <Stat label="Interest saved" value={`$${fmt(interestSaved, 0)}`} accent="green" />
              </div>
            )}

            <div className="border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs font-semibold text-gray-700 mb-2">Principal vs Interest</p>
              <div className="h-4 rounded-full overflow-hidden flex" style={{ background: "#fef2f2" }}>
                <div className="bg-emerald-500" style={{ width: `${principalPct}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-1.5">
                <span className="text-emerald-600 font-medium">{principalPct.toFixed(0)}% principal</span>
                <span className="text-red-600 font-medium">{interestPct.toFixed(0)}% interest</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumField({ icon, label, value, onChange, step, suffix, decimals }: {
  icon: React.ReactNode; label: string; value: number; onChange: (v: number) => void;
  step: number; suffix: string; decimals?: number;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-700 mb-1 block flex items-center gap-1.5">
        <span className="text-gray-400">{icon}</span>{label}
      </label>
      <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={0}
          className="flex-1 px-3 py-2 text-sm font-mono focus:outline-none"
        />
        <span className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-l" style={{ borderColor: "var(--color-border)" }}>{suffix}</span>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: "red" | "green" }) {
  const cls = accent === "red" ? "text-red-700" : accent === "green" ? "text-emerald-700" : "text-gray-900";
  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="text-xs text-gray-600">{label}</span>
      <span className={`text-sm font-mono font-semibold ${cls}`}>{value}</span>
    </div>
  );
}
