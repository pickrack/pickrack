"use client";

import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

// Vietnamese-specific letters not handled by standard Unicode normalize
const VI_MAP: Record<string, string> = {
  "đ": "d", "Đ": "D",
};

function slugify(s: string, separator: "-" | "_", maxLength: number): string {
  if (!s) return "";
  // 1. Strip Vietnamese đ first
  let out = s.replace(/[đĐ]/g, (c) => VI_MAP[c] || c);
  // 2. NFD normalize and strip combining marks (covers VN tones, accented Latin, etc.)
  out = out.normalize("NFD").replace(/[̀-ͯ]/g, "");
  // 3. Lowercase
  out = out.toLowerCase();
  // 4. Replace any non-alphanumeric with separator
  out = out.replace(/[^a-z0-9]+/g, separator);
  // 5. Collapse + trim separators
  const sepEsc = separator === "-" ? "-" : "_";
  out = out.replace(new RegExp(`${sepEsc}+`, "g"), separator);
  out = out.replace(new RegExp(`^${sepEsc}+|${sepEsc}+$`, "g"), "");
  // 6. Truncate to max length at last separator
  if (maxLength > 0 && out.length > maxLength) {
    let truncated = out.slice(0, maxLength);
    const lastSep = truncated.lastIndexOf(separator);
    if (lastSep > 0) truncated = truncated.slice(0, lastSep);
    out = truncated;
  }
  return out;
}

export default function SlugGeneratorPage() {
  const [text, setText] = useState("Cách viết bài SEO hay năm 2026");
  const [separator, setSeparator] = useState<"-" | "_">("-");
  const [maxLength, setMaxLength] = useState(0); // 0 = unlimited
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => slugify(text, separator, maxLength), [text, separator, maxLength]);

  const copy = async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">URL Slug Generator</h1>
        <p className="mt-3 text-gray-600">Strip Vietnamese diacritics, special chars, lowercase. Browser-side, instant.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Title or text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cách viết bài SEO hay năm 2026"
            className="w-full rounded-xl border px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div className="rounded-2xl border bg-emerald-50 border-emerald-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">Slug</span>
            <button
              onClick={copy}
              disabled={!slug}
              className="text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-emerald-400 inline-flex items-center gap-1.5 disabled:opacity-50"
              style={{ borderColor: "var(--color-border)" }}
            >
              {copied ? <><Check className="w-3 h-3 text-emerald-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
            </button>
          </div>
          <code className="font-mono text-base sm:text-lg text-emerald-900 break-all block">
            {slug || <span className="text-emerald-400 italic text-sm">Type a title above…</span>}
          </code>
          {slug && <p className="text-xs text-emerald-700 mt-2">{slug.length} characters</p>}
        </div>

        <div className="rounded-2xl border bg-white p-5 space-y-4" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Separator</label>
            <div className="grid grid-cols-2 gap-2">
              {(["-", "_"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeparator(s)}
                  className={`p-2 rounded-lg border text-sm font-mono font-medium transition ${
                    separator === s ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "bg-white"
                  }`}
                  style={{ borderColor: separator === s ? undefined : "var(--color-border)" }}
                >
                  {s === "-" ? "Hyphen (-) recommended" : "Underscore (_)"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-900">
                Max length {maxLength > 0 ? `(${maxLength})` : "(unlimited)"}
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {[0, 60, 80, 100].map((n) => (
                <button
                  key={n}
                  onClick={() => setMaxLength(n)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                    maxLength === n ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "bg-white"
                  }`}
                  style={{ borderColor: maxLength === n ? undefined : "var(--color-border)" }}
                >
                  {n === 0 ? "Unlimited" : `${n} chars`}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Google recommends slugs under 60 characters for best SEO.</p>
          </div>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4 text-xs text-gray-600">
          <p className="font-semibold text-gray-900 mb-1">Examples</p>
          <ul className="space-y-1 font-mono text-gray-700">
            <li>Cách viết bài SEO hay → <span className="text-emerald-700">cach-viet-bai-seo-hay</span></li>
            <li>Đường về quê hương → <span className="text-emerald-700">duong-ve-que-huong</span></li>
            <li>café & restaurant — Saigon → <span className="text-emerald-700">cafe-restaurant-saigon</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
