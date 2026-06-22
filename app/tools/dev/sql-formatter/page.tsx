"use client";

import { useState, useMemo } from "react";
import { format, type FormatOptionsWithLanguage } from "sql-formatter";
import { Copy, Check, Play } from "lucide-react";

type Dialect = NonNullable<FormatOptionsWithLanguage["language"]>;
type KeywordCase = "upper" | "lower" | "preserve";

const DIALECTS: { id: Dialect; label: string }[] = [
  { id: "sql", label: "Standard SQL" },
  { id: "mysql", label: "MySQL" },
  { id: "mariadb", label: "MariaDB" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "sqlite", label: "SQLite" },
  { id: "transactsql", label: "MS SQL" },
  { id: "bigquery", label: "BigQuery" },
  { id: "snowflake", label: "Snowflake" },
  { id: "redshift", label: "Redshift" },
  { id: "plsql", label: "Oracle PL/SQL" },
  { id: "spark", label: "Spark" },
];

const SAMPLE = `SELECT u.id, u.name, COUNT(o.id) AS orders FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE u.active = 1 AND u.created_at >= '2026-01-01' GROUP BY u.id, u.name HAVING COUNT(o.id) > 0 ORDER BY orders DESC LIMIT 10;`;

export default function SqlFormatterPage() {
  const [input, setInput] = useState(SAMPLE);
  const [dialect, setDialect] = useState<Dialect>("sql");
  const [tabWidth, setTabWidth] = useState(2);
  const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");
  const [copied, setCopied] = useState(false);

  const result = useMemo<{ ok: true; out: string } | { ok: false; err: string }>(() => {
    if (!input.trim()) return { ok: true, out: "" };
    try {
      const out = format(input, {
        language: dialect,
        tabWidth,
        keywordCase,
      });
      return { ok: true, out };
    } catch (e) {
      return { ok: false, err: e instanceof Error ? e.message : "SQL parse failed" };
    }
  }, [input, dialect, tabWidth, keywordCase]);

  const copy = async () => {
    if (!result.ok || !result.out) return;
    await navigator.clipboard.writeText(result.out);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadSample = () => setInput(SAMPLE);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">SQL Formatter</h1>
        <p className="mt-3 text-gray-600">
          Pretty-print SQL across 11 dialects (MySQL, PostgreSQL, SQLite, BigQuery, Snowflake...). Browser-side, instant.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Dialect</label>
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value as Dialect)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
              style={{ borderColor: "var(--color-border)" }}
            >
              {DIALECTS.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Indent width</label>
            <select
              value={tabWidth}
              onChange={(e) => setTabWidth(parseInt(e.target.value, 10))}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
              style={{ borderColor: "var(--color-border)" }}
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Keyword case</label>
            <select
              value={keywordCase}
              onChange={(e) => setKeywordCase(e.target.value as KeywordCase)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
              style={{ borderColor: "var(--color-border)" }}
            >
              <option value="upper">UPPER</option>
              <option value="lower">lower</option>
              <option value="preserve">Preserve</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Input SQL</label>
            <button
              onClick={loadSample}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700"
            >
              <Play className="w-3.5 h-3.5" /> Load sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SELECT * FROM users WHERE ..."
            className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">Formatted</label>
            <button
              onClick={copy}
              disabled={!result.ok || !result.out}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          {result.ok ? (
            <textarea
              value={result.out}
              readOnly
              placeholder="Formatted SQL will appear here"
              className="w-full h-96 rounded-lg border px-3 py-2 font-mono text-sm bg-gray-50 resize-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          ) : (
            <div className="h-96 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 overflow-auto">
              <p className="font-semibold mb-1">Parse error</p>
              <pre className="font-mono text-xs whitespace-pre-wrap">{result.err}</pre>
              <p className="mt-3 text-xs text-red-600">
                Tip: check for missing semicolons, unmatched parentheses, or syntax that doesn&apos;t match the selected dialect.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
