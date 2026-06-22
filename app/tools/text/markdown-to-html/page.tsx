"use client";

import { useState, useEffect, useMemo } from "react";
import { Copy, Check, Eye, Code2, Download } from "lucide-react";

const SAMPLE = `# Markdown to HTML

A **fast** browser-side converter for *Markdown* into clean HTML.

## Features

- GitHub-Flavored Markdown (tables, strikethrough, task lists)
- Live preview as you type
- Copy HTML or download as \`.html\`
- 100% in your browser

## Code

Inline \`code\` and fenced blocks:

\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
greet("Pickrack");
\`\`\`

## Table

| Tool | Browser-side | Free |
|------|--------------|------|
| Pickrack | ✅ | ✅ |
| Some clones | ❌ | ⚠️ |

> "Privacy is a feature, not a paywall."

[Visit Pickrack](https://pickrack.com)
`;

type ParseFn = (src: string) => string;

export default function MarkdownToHtmlPage() {
  const [md, setMd] = useState(SAMPLE);
  const [parse, setParse] = useState<ParseFn | null>(null);
  const [view, setView] = useState<"preview" | "html">("preview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { marked } = await import("marked");
      if (cancelled) return;
      marked.setOptions({ gfm: true, breaks: false });
      // marked.parse returns string | Promise<string>; cast to sync parse helper
      const fn: ParseFn = (src) => (marked.parse(src, { async: false }) as string);
      setParse(() => fn);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const html = useMemo(() => {
    if (!parse) return "";
    try {
      return parse(md);
    } catch {
      return "<p>Parse error.</p>";
    }
  }, [md, parse]);

  const copy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([
      `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Markdown export</title>\n</head>\n<body>\n${html}\n</body>\n</html>\n`,
    ], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "markdown.html";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Markdown to HTML</h1>
        <p className="mt-3 text-gray-600">
          Convert Markdown to clean HTML with GitHub-Flavored extensions. Live preview, browser-side, instant.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Markdown source</label>
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            spellCheck={false}
            className="w-full rounded-2xl border p-4 text-sm leading-relaxed h-[500px] font-mono focus:border-emerald-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="inline-flex rounded-lg border p-0.5 bg-white" style={{ borderColor: "var(--color-border)" }}>
              <button
                onClick={() => setView("preview")}
                className={`px-3 py-1 text-xs font-medium rounded flex items-center gap-1.5 ${
                  view === "preview" ? "bg-emerald-600 text-white" : "text-gray-600"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => setView("html")}
                className={`px-3 py-1 text-xs font-medium rounded flex items-center gap-1.5 ${
                  view === "html" ? "bg-emerald-600 text-white" : "text-gray-600"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> HTML
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-emerald-400"
                style={{ borderColor: "var(--color-border)" }}
              >
                {copied ? <><Check className="w-3.5 h-3.5 text-emerald-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy HTML</>}
              </button>
              <button
                onClick={download}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border bg-white hover:border-emerald-400"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Download className="w-3.5 h-3.5" /> .html
              </button>
            </div>
          </div>

          {view === "preview" ? (
            <div
              className="w-full rounded-2xl border bg-white p-5 text-sm leading-relaxed h-[500px] overflow-y-auto prose prose-sm max-w-none prose-headings:font-semibold prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:before:content-none prose-code:after:content-none"
              style={{ borderColor: "var(--color-border)" }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre
              className="w-full rounded-2xl border bg-gray-900 text-gray-100 p-4 text-xs leading-relaxed h-[500px] overflow-auto font-mono whitespace-pre-wrap break-all"
              style={{ borderColor: "var(--color-border)" }}
            >
              {html}
            </pre>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500 text-center">
        Powered by <a href="https://marked.js.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">marked</a> — MIT licensed, GFM-compliant.
      </p>
    </div>
  );
}
