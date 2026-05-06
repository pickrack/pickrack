"use client";

import { useState, useMemo } from "react";

function computeStats(text: string, wpm: number) {
  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  // Sentences: split on . ! ? followed by whitespace or end
  const sentences = trimmed === "" ? 0 : (trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed]).length;
  // Paragraphs: separated by 2+ newlines
  const paragraphs = trimmed === "" ? 0 : trimmed.split(/\n\s*\n/).filter((p) => p.trim() !== "").length;
  const readingMinutes = wpm > 0 ? words / wpm : 0;

  // Top words
  const wordList = trimmed.toLowerCase().match(/\b[\p{L}\p{N}']+\b/gu) || [];
  const freq = new Map<string, number>();
  for (const w of wordList) freq.set(w, (freq.get(w) ?? 0) + 1);
  const topWords = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return { words, charsWithSpaces, charsNoSpaces, sentences, paragraphs, readingMinutes, topWords };
}

function formatReadingTime(min: number): string {
  if (min < 1) return `${Math.round(min * 60)} sec`;
  if (min < 60) return `${min.toFixed(1)} min`;
  return `${(min / 60).toFixed(1)} hr`;
}

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(200);

  const stats = useMemo(() => computeStats(text, wpm), [text, wpm]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Word Counter</h1>
        <p className="mt-3 text-gray-600">
          Count words, characters, sentences, paragraphs, and reading time. Live update as you type.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here…"
            spellCheck={false}
            className="w-full rounded-2xl border p-4 text-sm leading-relaxed h-[500px] focus:border-emerald-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <Stat label="Words" value={stats.words.toLocaleString()} highlight />
            <Stat label="Characters" value={stats.charsWithSpaces.toLocaleString()} sub="with spaces" />
            <Stat label="Characters" value={stats.charsNoSpaces.toLocaleString()} sub="no spaces" />
            <Stat label="Sentences" value={stats.sentences.toLocaleString()} />
            <Stat label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
          </div>

          <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Reading time</span>
              <span className="text-emerald-700 font-bold">{formatReadingTime(stats.readingMinutes)}</span>
            </div>
            <label className="block text-xs text-gray-500 mb-1">At {wpm} words/minute</label>
            <input
              type="range"
              min={100}
              max={400}
              step={10}
              value={wpm}
              onChange={(e) => setWpm(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>100 (slow)</span>
              <span>200 (avg)</span>
              <span>400 (fast)</span>
            </div>
          </div>

          {stats.topWords.length > 0 && (
            <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-sm font-semibold text-gray-900 mb-3">Top words</p>
              <ul className="space-y-1.5">
                {stats.topWords.map(([word, count]) => (
                  <li key={word} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate">{word}</span>
                    <span className="text-gray-500 ml-2">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-gray-600">
        {label} {sub && <span className="text-xs text-gray-400">({sub})</span>}
      </span>
      <span className={`font-bold ${highlight ? "text-2xl text-emerald-700" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}
