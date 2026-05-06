"use client";

import { useState, useMemo } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum at vero eos accusamus iusto odio dignissimos ducimus blanditiis praesentium voluptatum deleniti atque corrupti quos dolores quas molestias excepturi obcaecati cupiditate similique mollitia animi laborum dolorum fuga harum quidem rerum facilis recusandae itaque earum hic tenetur sapiente delectus reiciendis maiores alias perferendis doloribus asperiores repellat".split(" ");

const CLASSIC_OPENER = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

type Mode = "words" | "sentences" | "paragraphs";

function pickRandom(arr: string[], n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(arr[Math.floor(Math.random() * arr.length)]);
  }
  return out;
}

function generateSentence(): string {
  const len = 8 + Math.floor(Math.random() * 12); // 8-20 words
  const words = pickRandom(WORDS, len);
  // Insert a comma somewhere in the middle for realism
  if (Math.random() > 0.4) {
    const commaAt = 3 + Math.floor(Math.random() * (len - 5));
    words[commaAt] = words[commaAt] + ",";
  }
  let sentence = words.join(" ");
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  return sentence;
}

function generate(mode: Mode, count: number, classic: boolean): string {
  if (mode === "words") {
    let result = pickRandom(WORDS, count).join(" ");
    if (classic) {
      const opener = CLASSIC_OPENER.split(" ").slice(0, Math.min(count, 18)).join(" ");
      result = opener + " " + pickRandom(WORDS, Math.max(0, count - 18)).join(" ");
    }
    result = result.trim();
    return result.charAt(0).toUpperCase() + result.slice(1) + ".";
  }
  if (mode === "sentences") {
    const sentences: string[] = [];
    if (classic) sentences.push(CLASSIC_OPENER);
    while (sentences.length < count) sentences.push(generateSentence());
    return sentences.slice(0, count).join(" ");
  }
  // paragraphs
  const paras: string[] = [];
  for (let p = 0; p < count; p++) {
    const sentenceCount = 4 + Math.floor(Math.random() * 5); // 4-8 sentences
    const ss: string[] = [];
    if (p === 0 && classic) ss.push(CLASSIC_OPENER);
    while (ss.length < sentenceCount) ss.push(generateSentence());
    paras.push(ss.slice(0, sentenceCount).join(" "));
  }
  return paras.join("\n\n");
}

export default function LoremIpsumPage() {
  const [mode, setMode] = useState<Mode>("paragraphs");
  const [count, setCount] = useState(3);
  const [classic, setClassic] = useState(true);
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const output = useMemo(
    () => generate(mode, count, classic),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, count, classic, seed]
  );

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const limits: Record<Mode, [number, number]> = {
    words: [10, 1000],
    sentences: [1, 100],
    paragraphs: [1, 20],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Lorem Ipsum Generator</h1>
        <p className="mt-3 text-gray-600">Placeholder text for design mockups, drafts, and CMS testing.</p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4 space-y-4" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {(["words", "sentences", "paragraphs"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setCount(m === "words" ? 50 : m === "sentences" ? 5 : 3); }}
                className={`p-2 rounded-xl border text-sm font-medium transition ${
                  mode === m ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "bg-white"
                }`}
                style={{ borderColor: mode === m ? undefined : "var(--color-border)" }}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Count: {count}</label>
          </div>
          <input
            type="range"
            min={limits[mode][0]}
            max={limits[mode][1]}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-600"
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} className="accent-emerald-600" />
          <span className="text-gray-700">Start with classic <code className="text-xs bg-gray-100 px-1 rounded">Lorem ipsum dolor sit amet…</code></span>
        </label>

        <div className="flex gap-2">
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="inline-flex items-center gap-1.5 rounded-xl border bg-white px-4 py-2 text-sm font-medium hover:border-emerald-400"
            style={{ borderColor: "var(--color-border)" }}
          >
            <RefreshCw className="w-4 h-4" /> Regenerate
          </button>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium transition"
          >
            {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-gray-50 p-5 max-h-[600px] overflow-auto" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{output}</p>
      </div>
    </div>
  );
}
