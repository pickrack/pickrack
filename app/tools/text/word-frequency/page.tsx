"use client";

import { useState, useMemo } from "react";
import { BarChart3, Copy, Check, Download } from "lucide-react";

const COMMON_STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "of", "at", "by", "for", "with",
  "about", "against", "between", "into", "through", "during", "before", "after",
  "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over",
  "under", "again", "further", "then", "once", "here", "there", "when", "where",
  "why", "how", "all", "any", "both", "each", "few", "more", "most", "other",
  "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too",
  "very", "s", "t", "can", "will", "just", "don", "should", "now", "is", "am",
  "are", "was", "were", "be", "been", "being", "have", "has", "had", "having",
  "do", "does", "did", "doing", "would", "could", "shall", "may", "might", "must",
  "this", "that", "these", "those", "i", "me", "my", "myself", "we", "our", "ours",
  "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his",
  "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them",
  "their", "theirs", "themselves", "what", "which", "who", "whom", "as",
]);

function tokenize(text: string, splitMode: "words" | "chars" | "lines"): string[] {
  if (splitMode === "chars") {
    return Array.from(text).filter((c) => c.trim().length > 0);
  }
  if (splitMode === "lines") {
    return text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }
  // Words: split on whitespace + punctuation, keep apostrophes
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9'À-ɏḀ-ỿ一-鿿぀-ヿ\s-]/g, " ")
    .split(/[\s]+/)
    .filter((w) => w.length > 0);
}

export default function WordFrequencyPage() {
  const [input, setInput] = useState("");
  const [splitMode, setSplitMode] = useState<"words" | "chars" | "lines">("words");
  const [minLength, setMinLength] = useState(1);
  const [removeStopwords, setRemoveStopwords] = useState(false);
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [topN, setTopN] = useState(50);
  const [copied, setCopied] = useState(false);

  const frequencies = useMemo(() => {
    if (!input) return [] as { word: string; count: number; pct: number }[];
    const tokens = tokenize(input, splitMode);
    const counts = new Map<string, number>();
    let total = 0;
    for (const t of tokens) {
      const key = caseInsensitive && splitMode === "words" ? t.toLowerCase() : t;
      if (key.length < minLength) continue;
      if (splitMode === "words" && removeStopwords && COMMON_STOPWORDS.has(key.toLowerCase())) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
      total++;
    }
    const arr = Array.from(counts.entries())
      .map(([word, count]) => ({ word, count, pct: total > 0 ? (count / total) * 100 : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, topN);
    return arr;
  }, [input, splitMode, minLength, removeStopwords, caseInsensitive, topN]);

  const totalUniqueWords = useMemo(() => {
    if (!input) return 0;
    const tokens = tokenize(input, splitMode);
    return new Set(tokens.map((t) => (caseInsensitive ? t.toLowerCase() : t))).size;
  }, [input, splitMode, caseInsensitive]);

  const copyAsCSV = async () => {
    const csv = "rank,word,count,percentage\n" +
      frequencies.map((f, i) => `${i + 1},"${f.word.replace(/"/g, '""')}",${f.count},${f.pct.toFixed(2)}`).join("\n");
    await navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadCSV = () => {
    const csv = "rank,word,count,percentage\n" +
      frequencies.map((f, i) => `${i + 1},"${f.word.replace(/"/g, '""')}",${f.count},${f.pct.toFixed(2)}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "word-frequency.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxCount = frequencies[0]?.count ?? 1;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <BarChart3 className="w-7 h-7 text-indigo-600" /> Word Frequency Counter
        </h1>
        <p className="mt-3 text-gray-600">
          Count word/character/line occurrences, ranked top N. Filter by length, drop stopwords. Export CSV.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-900">Input text</label>
              {input && <span className="text-xs text-gray-500">{totalUniqueWords.toLocaleString()} unique · {tokenize(input, splitMode).length.toLocaleString()} total</span>}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste any text — an article, essay, transcript, log..."
              className="w-full h-72 rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none resize-none"
              style={{ borderColor: "var(--color-border)" }}
              spellCheck={false}
            />
          </div>

          <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Count mode</label>
              <div className="inline-flex rounded-lg border p-1 bg-gray-50 w-full" style={{ borderColor: "var(--color-border)" }}>
                {(["words", "chars", "lines"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSplitMode(m)}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded capitalize ${splitMode === m ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Min length</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={minLength}
                  onChange={(e) => setMinLength(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full rounded-lg border px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Top N</label>
                <input
                  type="number"
                  min={5}
                  max={500}
                  step={5}
                  value={topN}
                  onChange={(e) => setTopN(Math.max(5, Math.min(500, parseInt(e.target.value, 10) || 50)))}
                  className="w-full rounded-lg border px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} className="accent-indigo-600" />
                Case-insensitive (words mode only)
              </label>
              <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer" title="The, a, of, and, etc.">
                <input type="checkbox" checked={removeStopwords} onChange={(e) => setRemoveStopwords(e.target.checked)} className="accent-indigo-600" />
                Drop English stopwords (the, a, of, ...)
              </label>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border bg-white p-5 sticky top-20" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">Top {Math.min(topN, frequencies.length)}</p>
              <div className="flex items-center gap-2">
                <button onClick={copyAsCSV} disabled={frequencies.length === 0} className="inline-flex items-center gap-1 text-xs text-indigo-700 disabled:opacity-50">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "CSV"}
                </button>
                <button onClick={downloadCSV} disabled={frequencies.length === 0} className="inline-flex items-center gap-1 text-xs text-indigo-700 disabled:opacity-50">
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="max-h-[600px] overflow-y-auto -mx-2 px-2">
              {frequencies.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">Paste text to see frequencies</p>
              ) : (
                <ol className="space-y-1">
                  {frequencies.map((f, i) => (
                    <li key={f.word} className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-gray-400 w-6 shrink-0">{i + 1}.</span>
                      <span className="font-mono flex-1 truncate" title={f.word}>{f.word}</span>
                      <span className="font-mono font-semibold text-gray-700 w-10 text-right">{f.count}</span>
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden shrink-0">
                        <div className="h-full bg-indigo-500" style={{ width: `${(f.count / maxCount) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
