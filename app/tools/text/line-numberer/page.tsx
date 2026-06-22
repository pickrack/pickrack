"use client";

import { useState, useMemo } from "react";
import { Hash, Copy, Check, ArrowDownUp } from "lucide-react";

type Preset = { id: string; label: string; template: string; sample: string };

const PRESETS: Preset[] = [
  { id: "n",           label: "1, 2, 3",       template: "{n}. {line}",      sample: "1. apple" },
  { id: "n-pad",       label: "001, 002",      template: "{n:03}. {line}",   sample: "001. apple" },
  { id: "dash",        label: "- bullet",      template: "- {line}",         sample: "- apple" },
  { id: "star",        label: "* bullet",      template: "* {line}",         sample: "* apple" },
  { id: "checkbox",    label: "- [ ] todo",    template: "- [ ] {line}",     sample: "- [ ] apple" },
  { id: "n-paren",     label: "1) 2) 3)",      template: "{n}) {line}",      sample: "1) apple" },
  { id: "n-bracket",   label: "[1] [2] [3]",   template: "[{n}] {line}",     sample: "[1] apple" },
  { id: "tab",         label: "TAB indent",    template: "\\t{line}",        sample: "\tapple" },
  { id: "blockquote",  label: "> quote",       template: "> {line}",         sample: "> apple" },
  { id: "letter",      label: "a, b, c",       template: "{a}. {line}",      sample: "a. apple" },
  { id: "letter-upper",label: "A, B, C",       template: "{A}. {line}",      sample: "A. apple" },
  { id: "roman",       label: "i, ii, iii",    template: "{r}. {line}",      sample: "i. apple" },
];

function toRoman(num: number, lower = true): string {
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  let n = num;
  for (const [v, s] of map) {
    while (n >= v) { result += s; n -= v; }
  }
  return lower ? result.toLowerCase() : result;
}

function toLetter(num: number, upper = false): string {
  // 1=a, 2=b, ... 26=z, 27=aa, 28=ab
  let result = "";
  let n = num;
  while (n > 0) {
    n--;
    result = String.fromCharCode((upper ? 65 : 97) + (n % 26)) + result;
    n = Math.floor(n / 26);
  }
  return result;
}

function applyTemplate(template: string, lineNum: number, line: string, startAt: number): string {
  const actualNum = startAt + lineNum - 1;
  let result = template
    .replace(/\\t/g, "\t")
    .replace(/\\n/g, "\n")
    .replace(/\{line\}/g, line)
    .replace(/\{a\}/g, toLetter(actualNum, false))
    .replace(/\{A\}/g, toLetter(actualNum, true))
    .replace(/\{r\}/g, toRoman(actualNum, true))
    .replace(/\{R\}/g, toRoman(actualNum, false));

  // {n} and {n:NN} for zero-padded numbers
  result = result.replace(/\{n(?::(\d+))?\}/g, (_match, pad) => {
    const numStr = actualNum.toString();
    return pad ? numStr.padStart(parseInt(pad, 10), "0") : numStr;
  });
  return result;
}

export default function LineNumbererPage() {
  const [input, setInput] = useState("");
  const [template, setTemplate] = useState(PRESETS[0].template);
  const [startAt, setStartAt] = useState(1);
  const [skipBlanks, setSkipBlanks] = useState(true);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input) return "";
    const lines = input.split(/\r?\n/);
    const result: string[] = [];
    let counter = 0;
    for (const line of lines) {
      if (skipBlanks && line.trim().length === 0) {
        result.push(line);
        continue;
      }
      counter++;
      result.push(applyTemplate(template, counter, line, startAt));
    }
    return result.join("\n");
  }, [input, template, startAt, skipBlanks]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Hash className="w-7 h-7 text-indigo-600" /> Line Numberer
        </h1>
        <p className="mt-3 text-gray-600">
          Add a number, bullet, or custom prefix to each line. 12 presets + custom template syntax.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4 space-y-4" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Quick presets</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setTemplate(p.template)}
                className={`p-2 rounded-lg border text-left text-xs transition ${
                  template === p.template ? "border-indigo-500 bg-indigo-50" : "bg-white"
                }`}
                style={{ borderColor: template === p.template ? undefined : "var(--color-border)" }}
              >
                <div className="font-semibold text-gray-900">{p.label}</div>
                <div className="text-gray-500 font-mono text-[10px] mt-0.5 truncate">{p.sample}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-[1fr_auto] gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Template <span className="text-gray-500 font-normal">— {`{line}`} = original, {`{n}`} = number, {`{n:03}`} = padded, {`{a}/{A}`} = letter, {`{r}/{R}`} = roman, {`\\t`} = tab</span>
            </label>
            <input
              type="text"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Start at</label>
            <input
              type="number"
              min={0}
              value={startAt}
              onChange={(e) => setStartAt(parseInt(e.target.value, 10) || 1)}
              className="w-24 rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
          <input type="checkbox" checked={skipBlanks} onChange={(e) => setSkipBlanks(e.target.checked)} className="accent-indigo-600" />
          Skip blank lines (don&apos;t number them)
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="One item per line..."
            className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)" }}
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Numbered</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setInput(output)} className="inline-flex items-center gap-1 text-xs text-indigo-700">
                <ArrowDownUp className="w-3 h-3" /> Swap in
              </button>
              <button onClick={copy} disabled={!output} className="inline-flex items-center gap-1 text-xs text-indigo-700 disabled:opacity-50">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-sm bg-gray-50 resize-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>
      </div>
    </div>
  );
}
