"use client";

import { useState, useMemo } from "react";
import { GitCompare } from "lucide-react";

type DiffOp = { type: "equal" | "add" | "del"; leftLine: number | null; rightLine: number | null; text: string };

/**
 * Line-level diff via LCS (longest common subsequence).
 * O(n*m) time and memory — fine for inputs up to a few thousand lines.
 */
function diffLines(aLines: string[], bLines: string[]): DiffOp[] {
  const n = aLines.length;
  const m = bLines.length;
  // dp[i][j] = LCS length of aLines[i..] and bLines[j..]
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = aLines[i] === bLines[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops: DiffOp[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (aLines[i] === bLines[j]) {
      ops.push({ type: "equal", leftLine: i + 1, rightLine: j + 1, text: aLines[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "del", leftLine: i + 1, rightLine: null, text: aLines[i] });
      i++;
    } else {
      ops.push({ type: "add", leftLine: null, rightLine: j + 1, text: bLines[j] });
      j++;
    }
  }
  while (i < n) {
    ops.push({ type: "del", leftLine: i + 1, rightLine: null, text: aLines[i] });
    i++;
  }
  while (j < m) {
    ops.push({ type: "add", leftLine: null, rightLine: j + 1, text: bLines[j] });
    j++;
  }
  return ops;
}

export default function DiffCheckerPage() {
  const [left, setLeft] = useState("Hello world\nThe quick brown fox\njumps over the lazy dog\nEnd");
  const [right, setRight] = useState("Hello world\nThe slow brown fox\njumps over the lazy dog\nGoodbye\nEnd");
  const [ignoreWs, setIgnoreWs] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const { ops, additions, deletions, unchanged } = useMemo(() => {
    const norm = (s: string) =>
      s.split("\n").map((line) => {
        let v = line;
        if (ignoreWs) v = v.replace(/\s+/g, " ").trim();
        if (ignoreCase) v = v.toLowerCase();
        return v;
      });
    const a = norm(left);
    const b = norm(right);
    const rawA = left.split("\n");
    const rawB = right.split("\n");

    const operations = diffLines(a, b);
    // Map normalized ops back to raw text for display
    const display = operations.map((op) => ({
      ...op,
      text:
        op.type === "del"
          ? rawA[(op.leftLine ?? 1) - 1] ?? op.text
          : op.type === "add"
          ? rawB[(op.rightLine ?? 1) - 1] ?? op.text
          : rawA[(op.leftLine ?? 1) - 1] ?? op.text,
    }));

    let adds = 0, dels = 0, eq = 0;
    for (const op of display) {
      if (op.type === "add") adds++;
      else if (op.type === "del") dels++;
      else eq++;
    }
    return { ops: display, additions: adds, deletions: dels, unchanged: eq };
  }, [left, right, ignoreWs, ignoreCase]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Text Diff Checker</h1>
        <p className="mt-3 text-gray-600">
          Compare two text blocks line-by-line. LCS algorithm, browser-side, no upload.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Original (A)</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            spellCheck={false}
            className="w-full rounded-2xl border p-4 text-sm leading-relaxed h-[260px] font-mono focus:border-blue-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Modified (B)</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            spellCheck={false}
            className="w-full rounded-2xl border p-4 text-sm leading-relaxed h-[260px] font-mono focus:border-blue-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
          <input type="checkbox" checked={ignoreWs} onChange={(e) => setIgnoreWs(e.target.checked)} className="accent-blue-600 w-4 h-4" />
          Ignore whitespace
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
          <input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} className="accent-blue-600 w-4 h-4" />
          Ignore case
        </label>
        <div className="ml-auto flex gap-3 text-xs">
          <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">+{additions} added</span>
          <span className="px-2 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200">−{deletions} removed</span>
          <span className="px-2 py-1 rounded bg-gray-50 text-gray-700 border border-gray-200">={unchanged} unchanged</span>
        </div>
      </div>

      <div
        className="rounded-2xl border bg-white overflow-hidden"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="px-4 py-2 border-b bg-gray-50 text-xs font-semibold text-gray-600 flex items-center gap-2" style={{ borderColor: "var(--color-border)" }}>
          <GitCompare className="w-3.5 h-3.5" /> Diff result
        </div>
        <div className="max-h-[500px] overflow-auto">
          <table className="w-full text-xs font-mono">
            <tbody>
              {ops.map((op, idx) => (
                <tr
                  key={idx}
                  className={
                    op.type === "add"
                      ? "bg-emerald-50"
                      : op.type === "del"
                      ? "bg-rose-50"
                      : ""
                  }
                >
                  <td className="px-2 py-0.5 text-right text-gray-400 select-none w-12 border-r" style={{ borderColor: "var(--color-border)" }}>
                    {op.leftLine ?? ""}
                  </td>
                  <td className="px-2 py-0.5 text-right text-gray-400 select-none w-12 border-r" style={{ borderColor: "var(--color-border)" }}>
                    {op.rightLine ?? ""}
                  </td>
                  <td className="px-2 py-0.5 text-center select-none w-6 text-gray-500">
                    {op.type === "add" ? "+" : op.type === "del" ? "−" : " "}
                  </td>
                  <td className="px-3 py-0.5 whitespace-pre-wrap break-all">
                    {op.text || <span className="text-gray-300">(empty line)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
