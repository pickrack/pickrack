"use client";

import { useState, useEffect } from "react";
import { Clock, Copy, Check, RefreshCw } from "lucide-react";

type Unit = "sec" | "ms";

function fmt(d: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .format(d)
      .replace(",", "");
  } catch {
    return d.toISOString();
  }
}

const COMMON_TZ = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Ho_Chi_Minh",
  "Asia/Seoul",
  "Asia/Dubai",
  "Australia/Sydney",
];

export default function TimestampConverterPage() {
  const [tsInput, setTsInput] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<Unit>("sec");
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().slice(0, 19));
  const [tz, setTz] = useState<string>(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "UTC";
    }
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Parse timestamp input → Date
  const tsDate = (() => {
    const n = Number(tsInput.trim());
    if (!Number.isFinite(n)) return null;
    const ms = unit === "ms" ? n : n * 1000;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  })();

  // Parse date input → Date (interpret in selected timezone)
  // ISO datetime-local input is naive; we treat it as wall-clock in `tz` and compute its UTC instant
  const dateInputToTimestamp = (): { ms: number; iso: string } | null => {
    if (!dateInput) return null;
    // Date input format "YYYY-MM-DDTHH:mm" or "YYYY-MM-DDTHH:mm:ss"
    const m = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return null;
    const [, Y, M, D, h, min, sec] = m;
    // Get the offset for this wall-clock in the target TZ
    // Trick: format the candidate UTC instant in `tz`, see what offset comes out, iterate
    const candidate = Date.UTC(+Y, +M - 1, +D, +h, +min, +(sec ?? "0"));
    // Compute offset: format candidate in tz, parse back, diff
    const tzString = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(candidate));
    // tzString like "2026-05-15, 09:00:00"
    const tzMatch = tzString.match(/^(\d{4})-(\d{2})-(\d{2}),?\s+(\d{2}):(\d{2}):(\d{2})$/);
    if (!tzMatch) return { ms: candidate, iso: new Date(candidate).toISOString() };
    const tzAsUTC = Date.UTC(+tzMatch[1], +tzMatch[2] - 1, +tzMatch[3], +tzMatch[4], +tzMatch[5], +tzMatch[6]);
    const offset = tzAsUTC - candidate;
    const finalMs = candidate - offset;
    return { ms: finalMs, iso: new Date(finalMs).toISOString() };
  };

  const dt = dateInputToTimestamp();

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const useNow = () => {
    const t = Math.floor(Date.now() / 1000);
    setTsInput(unit === "ms" ? String(t * 1000) : String(t));
    setDateInput(new Date().toISOString().slice(0, 19));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Timestamp Converter</h1>
        <p className="mt-3 text-gray-600">
          Unix timestamp ↔ ISO 8601 ↔ human-readable date. Timezone-aware, live, browser-side.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 mb-6 flex items-center justify-between gap-3 text-sm text-blue-900 flex-wrap">
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4" /> Current Unix time:
          <code className="font-mono font-semibold text-blue-700">{Math.floor(now / 1000)}</code>
        </span>
        <button
          onClick={useNow}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-blue-300 bg-white hover:bg-blue-100 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3 h-3" /> Use now
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Timestamp → Date */}
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Timestamp → Date</p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              inputMode="numeric"
              value={tsInput}
              onChange={(e) => setTsInput(e.target.value)}
              className="flex-1 rounded-xl border px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
              placeholder="1715774400"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              className="rounded-xl border px-2 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
              style={{ borderColor: "var(--color-border)" }}
            >
              <option value="sec">sec</option>
              <option value="ms">ms</option>
            </select>
          </div>

          {tsDate ? (
            <div className="space-y-2 text-sm">
              <Row label="ISO 8601 (UTC)" value={tsDate.toISOString()} onCopy={() => copy(tsDate.toISOString(), "iso")} copied={copied === "iso"} />
              <Row label={tz} value={fmt(tsDate, tz)} onCopy={() => copy(fmt(tsDate, tz), "tz")} copied={copied === "tz"} />
              <Row label="UTC long" value={tsDate.toUTCString()} onCopy={() => copy(tsDate.toUTCString(), "utc")} copied={copied === "utc"} />
              <Row label="Relative" value={relative(tsDate.getTime(), now)} onCopy={() => copy(relative(tsDate.getTime(), now), "rel")} copied={copied === "rel"} />
            </div>
          ) : (
            <p className="text-xs text-rose-600">Invalid timestamp.</p>
          )}
        </div>

        {/* Date → Timestamp */}
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Date → Timestamp</p>
          <input
            type="datetime-local"
            step={1}
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm font-mono mb-2 focus:border-blue-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white mb-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            {COMMON_TZ.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>

          {dt ? (
            <div className="space-y-2 text-sm">
              <Row label="Unix seconds" value={String(Math.floor(dt.ms / 1000))} onCopy={() => copy(String(Math.floor(dt.ms / 1000)), "sec")} copied={copied === "sec"} mono />
              <Row label="Unix milliseconds" value={String(dt.ms)} onCopy={() => copy(String(dt.ms), "ms")} copied={copied === "ms"} mono />
              <Row label="ISO 8601 (UTC)" value={dt.iso} onCopy={() => copy(dt.iso, "iso2")} copied={copied === "iso2"} mono />
            </div>
          ) : (
            <p className="text-xs text-rose-600">Invalid date.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  onCopy,
  copied,
  mono = false,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
        <p className={`text-gray-900 truncate ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
      <button
        onClick={onCopy}
        className="rounded-lg border p-2 hover:border-blue-400 shrink-0"
        style={{ borderColor: "var(--color-border)" }}
        aria-label="Copy"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
      </button>
    </div>
  );
}

function relative(ms: number, nowMs: number): string {
  const diff = ms - nowMs;
  const sign = diff < 0 ? "ago" : "from now";
  const abs = Math.abs(diff);
  const sec = Math.round(abs / 1000);
  if (sec < 60) return `${sec}s ${sign}`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ${sign}`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ${sign}`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ${sign}`;
  const mo = Math.round(d / 30);
  if (mo < 12) return `${mo}mo ${sign}`;
  const y = (d / 365).toFixed(1);
  return `${y}y ${sign}`;
}
