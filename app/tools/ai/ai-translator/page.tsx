"use client";

import { useState } from "react";
import { Loader2, Copy, Check, Languages, AlertTriangle, ArrowRight } from "lucide-react";
import { SUPPORTED_LANGUAGES, POPULAR_TARGETS } from "@/lib/translate-languages";

const MAX_INPUT = 8_000;

export default function AITranslatorPage() {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("vi");
  const [translation, setTranslation] = useState<string | null>(null);
  const [translatedTo, setTranslatedTo] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const translate = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please paste some text to translate.");
      return;
    }
    if (trimmed.length > MAX_INPUT) {
      setError(`Text too long (max ${MAX_INPUT.toLocaleString()} characters).`);
      return;
    }

    setProcessing(true);
    setError(null);
    setTranslation(null);
    try {
      const res = await fetch("/api/ai/translate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, target }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }
      setTranslation(data.translation);
      setTranslatedTo(data.targetLanguage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Translation failed.");
    } finally {
      setProcessing(false);
    }
  };

  const copy = async () => {
    if (!translation) return;
    await navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const popular = POPULAR_TARGETS.map((code) => ({ code, name: SUPPORTED_LANGUAGES[code] }));
  const allOthers = Object.entries(SUPPORTED_LANGUAGES)
    .filter(([code]) => !POPULAR_TARGETS.includes(code))
    .sort((a, b) => a[1].localeCompare(b[1]));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">AI Translator</h1>
        <p className="mt-3 text-gray-600">
          Translate text into 20 languages with formatting preserved. Powered by Claude Haiku 4.5.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 flex items-start gap-3 text-sm text-violet-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-violet-600" />
        <div>
          <p className="font-medium">AI processing via Anthropic API</p>
          <p className="mt-1 text-violet-800">
            Your text is sent over HTTPS to Claude. Anthropic does not use API inputs for training. Pickrack stores nothing. Daily quota: 10/IP.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Source text (auto-detect)</label>
            <span className={`text-xs ${text.length > MAX_INPUT ? "text-red-600" : "text-gray-500"}`}>
              {text.length.toLocaleString()} / {MAX_INPUT.toLocaleString()}
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text in any language…"
            spellCheck={false}
            className="w-full rounded-2xl border p-4 text-sm leading-relaxed h-[400px] focus:border-violet-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
            <label className="text-sm font-semibold text-gray-900">
              Translation {translatedTo && <span className="text-gray-500 font-normal">({translatedTo})</span>}
            </label>
            {translation && (
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-violet-400"
                style={{ borderColor: "var(--color-border)" }}
              >
                {copied ? <><Check className="w-3.5 h-3.5 text-violet-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            )}
          </div>
          <div
            className="w-full rounded-2xl border p-4 text-sm leading-relaxed h-[400px] overflow-auto bg-gray-50 whitespace-pre-wrap text-gray-800"
            style={{ borderColor: "var(--color-border)" }}
          >
            {translation || <span className="text-gray-400 italic">Translation will appear here…</span>}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-5 space-y-4" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Translate to</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {popular.map((l) => (
              <button
                key={l.code}
                onClick={() => setTarget(l.code)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                  target === l.code ? "border-violet-500 bg-violet-50 text-violet-700" : "bg-white"
                }`}
                style={{ borderColor: target === l.code ? undefined : "var(--color-border)" }}
              >
                {l.name}
              </button>
            ))}
          </div>
          <details className="text-sm text-gray-600">
            <summary className="cursor-pointer hover:text-violet-600 select-none">More languages…</summary>
            <div className="mt-2 flex flex-wrap gap-2">
              {allOthers.map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => setTarget(code)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                    target === code ? "border-violet-500 bg-violet-50 text-violet-700" : "bg-white"
                  }`}
                  style={{ borderColor: target === code ? undefined : "var(--color-border)" }}
                >
                  {name}
                </button>
              ))}
            </div>
          </details>
        </div>

        <button
          onClick={translate}
          disabled={processing || !text.trim() || text.length > MAX_INPUT}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 transition disabled:opacity-50"
        >
          {processing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Translating with Claude…</>
          ) : (
            <><Languages className="w-4 h-4" /> Translate <ArrowRight className="w-4 h-4" /> {SUPPORTED_LANGUAGES[target]}</>
          )}
        </button>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
        )}
      </div>
    </div>
  );
}
