"use client";

import { useState, useMemo } from "react";
import { Calendar, Cake } from "lucide-react";

function ymdDiff(from: Date, to: Date): { years: number; months: number; days: number } {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    months--;
    // Days in previous month of `to`
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

function totalDays(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

function nextBirthday(birth: Date, today: Date): { date: Date; daysAway: number } {
  const month = birth.getMonth();
  const day = birth.getDate();
  let next = new Date(today.getFullYear(), month, day);
  if (next <= today) next = new Date(today.getFullYear() + 1, month, day);
  // Handle Feb 29 in non-leap year — JS auto-rolls to Mar 1
  const daysAway = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return { date: next, daysAway };
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AgeCalculatorPage() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const [birthDate, setBirthDate] = useState("1995-01-15");
  const [refDate, setRefDate] = useState(todayIso);

  const result = useMemo(() => {
    const from = new Date(birthDate + "T00:00:00");
    const to = new Date(refDate + "T00:00:00");
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return { ok: false as const, error: "Invalid date" };
    }
    if (from > to) {
      return { ok: false as const, error: "Birth date must be before reference date" };
    }

    const ymd = ymdDiff(from, to);
    const days = totalDays(from, to);
    const hours = days * 24;
    const minutes = hours * 60;
    const isLeapBday = from.getMonth() === 1 && from.getDate() === 29;

    // Only compute next birthday if reference is "today"
    const showBirthday = refDate === todayIso;
    const nextBday = showBirthday ? nextBirthday(from, to) : null;

    return { ok: true as const, ymd, days, hours, minutes, isLeapBday, nextBday };
  }, [birthDate, refDate, todayIso]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Age Calculator</h1>
        <p className="mt-3 text-gray-600">Years, months, days, hours, minutes lived. Plus next-birthday countdown.</p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-6 grid gap-4 sm:grid-cols-2" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-1 block flex items-center gap-1.5">
            <Cake className="w-4 h-4 text-indigo-600" /> Birth date
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={todayIso}
            className="w-full rounded-xl border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-1 block flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" /> Reference date
          </label>
          <input
            type="date"
            value={refDate}
            onChange={(e) => setRefDate(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
          {refDate !== todayIso && (
            <button
              onClick={() => setRefDate(todayIso)}
              className="text-xs text-indigo-600 hover:text-indigo-700 mt-1"
            >
              Reset to today
            </button>
          )}
        </div>
      </div>

      {!result.ok && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{result.error}</p>
      )}

      {result.ok && (
        <>
          <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-6 mb-4 text-center">
            <p className="text-sm text-indigo-700 mb-2">You are exactly</p>
            <p className="text-3xl sm:text-4xl font-bold text-indigo-900">
              {result.ymd.years} <span className="text-xl text-indigo-600 font-normal">years</span>{" "}
              {result.ymd.months} <span className="text-xl text-indigo-600 font-normal">months</span>{" "}
              {result.ymd.days} <span className="text-xl text-indigo-600 font-normal">days</span>
            </p>
            {result.isLeapBday && (
              <p className="text-xs text-indigo-700 mt-3">⚠ Born on Feb 29 (leap-year birthday). Most years celebrate Feb 28 or Mar 1.</p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3 mb-4">
            <Stat label="Total days" value={result.days.toLocaleString()} />
            <Stat label="Total hours" value={result.hours.toLocaleString()} />
            <Stat label="Total minutes" value={result.minutes.toLocaleString()} />
          </div>

          {result.nextBday && (
            <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                <Cake className="w-4 h-4 text-indigo-600" /> Next birthday
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {result.nextBday.daysAway} day{result.nextBday.daysAway === 1 ? "" : "s"} away
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {DAYS_OF_WEEK[result.nextBday.date.getDay()]}, {result.nextBday.date.toDateString()}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-4 text-center" style={{ borderColor: "var(--color-border)" }}>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
