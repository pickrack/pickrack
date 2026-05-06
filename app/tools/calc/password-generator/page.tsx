"use client";

import { useState, useCallback, useEffect } from "react";
import { Copy, Check, RefreshCw, Eye, EyeOff } from "lucide-react";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/";
const SIMILAR = /[0Ol1Ii|`'"]/g;

function generatePassword(opts: {
  length: number;
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
}): string {
  let pool = "";
  if (opts.lower) pool += LOWER;
  if (opts.upper) pool += UPPER;
  if (opts.digits) pool += DIGITS;
  if (opts.symbols) pool += SYMBOLS;
  if (opts.excludeSimilar) pool = pool.replace(SIMILAR, "");
  if (pool.length === 0) return "";

  // Cryptographic random pick
  const result = new Array<string>(opts.length);
  const buf = new Uint32Array(opts.length);
  crypto.getRandomValues(buf);
  for (let i = 0; i < opts.length; i++) {
    result[i] = pool[buf[i] % pool.length];
  }

  // Ensure at least one char from each enabled set
  const sets: string[] = [];
  if (opts.lower) sets.push(opts.excludeSimilar ? LOWER.replace(SIMILAR, "") : LOWER);
  if (opts.upper) sets.push(opts.excludeSimilar ? UPPER.replace(SIMILAR, "") : UPPER);
  if (opts.digits) sets.push(opts.excludeSimilar ? DIGITS.replace(SIMILAR, "") : DIGITS);
  if (opts.symbols) sets.push(opts.excludeSimilar ? SYMBOLS.replace(SIMILAR, "") : SYMBOLS);

  const positions = new Uint32Array(sets.length);
  crypto.getRandomValues(positions);
  for (let i = 0; i < sets.length; i++) {
    const set = sets[i];
    if (set.length === 0) continue;
    const pos = positions[i] % opts.length;
    const charBuf = new Uint32Array(1);
    crypto.getRandomValues(charBuf);
    result[pos] = set[charBuf[0] % set.length];
  }

  return result.join("");
}

function passwordStrength(pw: string): { label: string; color: string; entropy: number } {
  if (!pw) return { label: "—", color: "text-gray-400", entropy: 0 };
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  const entropy = pw.length * Math.log2(pool || 1);
  if (entropy < 40) return { label: "Weak", color: "text-red-600", entropy };
  if (entropy < 60) return { label: "Fair", color: "text-amber-600", entropy };
  if (entropy < 80) return { label: "Strong", color: "text-emerald-600", entropy };
  return { label: "Very strong", color: "text-emerald-700", entropy };
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [show, setShow] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(() => {
    const pw = generatePassword({ length, lower, upper, digits, symbols, excludeSimilar });
    setPassword(pw);
    setCopied(false);
  }, [length, lower, upper, digits, symbols, excludeSimilar]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // Auto-clear clipboard after 30s
    setTimeout(() => navigator.clipboard.writeText("").catch(() => {}), 30_000);
  };

  const strength = passwordStrength(password);
  const noneSelected = !lower && !upper && !digits && !symbols;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Password Generator</h1>
        <p className="mt-3 text-gray-600">
          Generate cryptographically-strong random passwords. Length, character set, similar-character exclusion — all configurable.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 mb-6" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              readOnly
              className="w-full rounded-xl border bg-gray-50 px-4 py-3 font-mono text-sm sm:text-base pr-10 focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
              aria-label={show ? "Hide" : "Show"}
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={copy}
            disabled={!password}
            className="rounded-xl border bg-white px-3 py-3 hover:border-emerald-400 disabled:opacity-50"
            style={{ borderColor: "var(--color-border)" }}
            aria-label="Copy"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={regenerate}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-3"
            aria-label="Regenerate"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-between text-sm">
          <span className={`font-medium ${strength.color}`}>{strength.label}</span>
          <span className="text-gray-500">{strength.entropy.toFixed(0)} bits entropy</span>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 space-y-5" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">Length</span>
            <span className="text-sm font-bold text-emerald-700">{length}</span>
          </label>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>8</span>
            <span>16 (rec)</span>
            <span>32</span>
            <span>64</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Toggle label="Lowercase (a-z)" checked={lower} onChange={setLower} />
          <Toggle label="Uppercase (A-Z)" checked={upper} onChange={setUpper} />
          <Toggle label="Numbers (0-9)" checked={digits} onChange={setDigits} />
          <Toggle label="Symbols (!@#$…)" checked={symbols} onChange={setSymbols} />
        </div>

        <Toggle label="Exclude similar-looking (0/O, 1/l/I)" checked={excludeSimilar} onChange={setExcludeSimilar} />

        {noneSelected && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
            Select at least one character set.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-500 text-center">
        Generated locally using crypto.getRandomValues. Never sent to a server. Clipboard auto-clears 30 seconds after copy.
      </p>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-emerald-600 w-4 h-4"
      />
      {label}
    </label>
  );
}
