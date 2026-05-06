"use client";

import { useState, useMemo } from "react";

type Match = { fullMatch: string; index: number; groups: { name?: string; value: string }[] };

const PRESETS: { label: string; pattern: string; flags: string; example: string }[] = [
  { label: "Email", pattern: "[\\w.+-]+@[\\w-]+\\.[\\w.-]+", flags: "g", example: "Contact us at hello@pickrack.com or support@example.org" },
  { label: "URL", pattern: "https?://[\\w.-]+(?:\\.[\\w.-]+)+[/\\w._~:?#@!$&'()*+,;=%-]*", flags: "g", example: "Visit https://pickrack.com/tools/dev or http://example.com/page" },
  { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g", example: "Server 192.168.1.1, gateway 10.0.0.1, DNS 8.8.8.8" },
  { label: "Date YYYY-MM-DD", pattern: "\\b\\d{4}-\\d{2}-\\d{2}\\b", flags: "g", example: "Created 2026-05-04, updated 2026-04-29" },
  { label: "Phone US", pattern: "\\+?1?[\\s.-]?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}", flags: "g", example: "Call +1 (555) 123-4567 or 555.987.6543" },
  { label: "Hashtag", pattern: "#\\w+", flags: "g", example: "Loving #pickrack and #productivity!" },
];

const FLAGS = [
  { id: "g", label: "global" },
  { id: "i", label: "ignore case" },
  { id: "m", label: "multiline" },
  { id: "s", label: "dotall" },
  { id: "u", label: "unicode" },
  { id: "y", label: "sticky" },
];

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("[\\w.+-]+@[\\w-]+\\.[\\w.-]+");
  const [flags, setFlags] = useState(new Set(["g"]));
  const [text, setText] = useState("Email me at hello@pickrack.com or support@example.org for help.");

  const result = useMemo(() => {
    if (!pattern) return { ok: true as const, matches: [] as Match[], regex: null, error: null as string | null };
    try {
      const re = new RegExp(pattern, [...flags].join(""));
      const matches: Match[] = [];
      if (flags.has("g") || flags.has("y")) {
        let m: RegExpExecArray | null;
        let safety = 0;
        while ((m = re.exec(text)) !== null && safety++ < 10000) {
          if (m.index === re.lastIndex) re.lastIndex++; // avoid infinite loop on zero-width
          matches.push(parseMatch(m));
        }
      } else {
        const m = re.exec(text);
        if (m) matches.push(parseMatch(m));
      }
      return { ok: true as const, matches, regex: re, error: null };
    } catch (e) {
      return {
        ok: false as const,
        matches: [],
        regex: null,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }, [pattern, flags, text]);

  const toggleFlag = (f: string) => {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  const loadPreset = (idx: number) => {
    const p = PRESETS[idx];
    setPattern(p.pattern);
    setFlags(new Set(p.flags.split("")));
    setText(p.example);
  };

  const highlighted = useMemo(() => {
    if (!result.ok || result.matches.length === 0) return [{ type: "text" as const, text }];
    const segs: ({ type: "text"; text: string } | { type: "match"; text: string; idx: number })[] = [];
    let lastEnd = 0;
    result.matches.forEach((m, i) => {
      if (m.index > lastEnd) segs.push({ type: "text", text: text.slice(lastEnd, m.index) });
      segs.push({ type: "match", text: m.fullMatch, idx: i });
      lastEnd = m.index + m.fullMatch.length;
    });
    if (lastEnd < text.length) segs.push({ type: "text", text: text.slice(lastEnd) });
    return segs;
  }, [result, text]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Regex Tester</h1>
        <p className="mt-3 text-gray-600">Test regex live with match highlighting and capture groups. JavaScript RegExp.</p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4 space-y-3" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-blue-600 font-mono text-lg shrink-0">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern…"
            spellCheck={false}
            className="flex-1 rounded-lg border px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
          <span className="text-blue-600 font-mono text-lg shrink-0">/{[...flags].join("")}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {FLAGS.map((f) => (
            <button
              key={f.id}
              onClick={() => toggleFlag(f.id)}
              title={f.label}
              className={`text-xs px-2.5 py-1 rounded-md border font-mono font-medium transition ${
                flags.has(f.id) ? "border-blue-500 bg-blue-50 text-blue-700" : "bg-white text-gray-500"
              }`}
              style={{ borderColor: flags.has(f.id) ? undefined : "var(--color-border)" }}
            >
              {f.id}
            </button>
          ))}
          <span className="text-xs text-gray-400 self-center ml-2">Hover for flag meaning</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
          <span className="text-xs text-gray-500 mr-1 self-center">Presets:</span>
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => loadPreset(i)}
              className="text-xs px-2.5 py-1 rounded-md border bg-white hover:border-blue-400"
              style={{ borderColor: "var(--color-border)" }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {!result.ok && (
        <p className="mb-4 text-sm font-mono text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {result.error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Test text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text to test against…"
            spellCheck={false}
            className="w-full rounded-2xl border p-4 font-mono text-xs h-[300px] focus:border-blue-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">
            Matches {result.ok && <span className="text-gray-500 font-normal">({result.matches.length})</span>}
          </label>
          <div className="rounded-2xl border bg-gray-50 p-4 font-mono text-xs h-[300px] overflow-auto whitespace-pre-wrap break-all" style={{ borderColor: "var(--color-border)" }}>
            {highlighted.map((seg, i) =>
              seg.type === "match" ? (
                <span key={i} className="bg-blue-200 text-blue-900 rounded px-0.5">{seg.text}</span>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </div>
        </div>
      </div>

      {result.ok && result.matches.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Capture groups by match</h3>
          <div className="space-y-3">
            {result.matches.map((m, i) => (
              <div key={i} className="rounded-xl bg-gray-50 p-3 text-sm">
                <p className="text-xs text-gray-500 mb-1">Match {i + 1} at offset {m.index}</p>
                <code className="font-mono text-blue-700">{m.fullMatch}</code>
                {m.groups.length > 1 && (
                  <ul className="mt-2 space-y-1">
                    {m.groups.slice(1).map((g, gi) => (
                      <li key={gi} className="text-xs">
                        <span className="font-mono text-gray-500">Group {g.name ? `<${g.name}>` : gi + 1}:</span>{" "}
                        <code className="font-mono text-gray-700">{g.value || "(empty)"}</code>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function parseMatch(m: RegExpExecArray): Match {
  const groups: { name?: string; value: string }[] = [];
  for (let i = 0; i < m.length; i++) {
    groups.push({ value: m[i] ?? "" });
  }
  if (m.groups) {
    for (const [name, value] of Object.entries(m.groups)) {
      const idx = m.findIndex((v, i) => i > 0 && v === value);
      if (idx > 0) groups[idx].name = name;
    }
  }
  return { fullMatch: m[0], index: m.index, groups };
}
