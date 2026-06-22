"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Loader2, Send, FileText, AlertTriangle, RotateCcw } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const MAX_DOC_CHARS = 80_000;
const MAX_BYTES = 30 * 1024 * 1024;

export default function ChatWithPDFPage() {
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pages, setPages] = useState<number>(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [question, setQuestion] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [pdfjsReady, setPdfjsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        if (cancelled) return;
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        setPdfjsReady(true);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? `Failed to load PDF reader: ${e.message}` : "Failed to load PDF reader.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const onFile = async (f: File | null) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("PDF too large (max 30 MB).");
      return;
    }
    if (!pdfjsReady) {
      setError("PDF reader is still loading. Try again in a moment.");
      return;
    }

    setExtracting(true);
    setError(null);
    setMessages([]);
    setPdfText(null);
    setFileName(f.name);
    setPages(0);

    try {
      const pdfjs = await import("pdfjs-dist");
      const buf = await f.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buf }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((it) => ("str" in it ? it.str : ""))
          .filter(Boolean)
          .join(" ");
        text += `\n[Page ${i}]\n${pageText}\n`;
        if (text.length > MAX_DOC_CHARS) {
          text = text.slice(0, MAX_DOC_CHARS) + "\n[...truncated]";
          setPages(i);
          break;
        }
      }
      setPdfText(text.trim());
      if (pages === 0) setPages(pdf.numPages);
    } catch (e) {
      setError(e instanceof Error ? `PDF parse failed: ${e.message}` : "PDF parse failed.");
      setFileName(null);
    } finally {
      setExtracting(false);
    }
  };

  const ask = async () => {
    if (!pdfText) return;
    const q = question.trim();
    if (!q) return;
    setQuestion("");
    const newMessages: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(newMessages);
    setThinking(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/chat-pdf/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: pdfText,
          question: q,
          history: messages, // history excludes the current question
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      setMessages([...newMessages, { role: "assistant", content: data.answer }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chat failed.");
      setMessages(newMessages); // keep user msg, drop pending assistant
    } finally {
      setThinking(false);
    }
  };

  const reset = () => {
    setPdfText(null);
    setFileName(null);
    setMessages([]);
    setPages(0);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Chat with PDF</h1>
        <p className="mt-3 text-gray-600">
          Ask questions about a PDF and get answers from Claude. Text is extracted in your browser — only the extracted text reaches our server.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 flex items-start gap-3 text-sm text-violet-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-violet-600" />
        <div>
          <p className="font-medium">How the privacy split works</p>
          <p className="mt-1 text-violet-800">
            Your PDF is parsed entirely in your browser using pdf.js. We never receive the binary file. Only the extracted plain text plus your question is sent to Anthropic for processing. Anthropic does not train on API inputs. Pickrack stores nothing.
          </p>
        </div>
      </div>

      {!pdfText && (
        <div
          className="rounded-2xl border-2 border-dashed bg-white p-10 text-center hover:border-violet-400 transition cursor-pointer"
          style={{ borderColor: "var(--color-border)" }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFile(e.dataTransfer.files?.[0] ?? null);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          {extracting ? (
            <>
              <Loader2 className="w-12 h-12 mx-auto text-violet-600 mb-3 animate-spin" />
              <p className="text-base font-medium text-gray-900">Extracting text from PDF…</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-base font-medium text-gray-900">Drop a PDF here or click to browse</p>
              <p className="text-sm text-gray-500 mt-1">Up to 30 MB · 30-50 pages of text-based PDF</p>
              {!pdfjsReady && <p className="text-xs text-violet-700 mt-2">Loading PDF reader…</p>}
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {pdfText && (
        <>
          <div className="rounded-xl border bg-white p-4 mb-4 flex items-center justify-between gap-3" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-6 h-6 text-violet-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{fileName}</p>
                <p className="text-xs text-gray-500">
                  {pages} page{pages === 1 ? "" : "s"} · {pdfText.length.toLocaleString()} chars extracted
                </p>
              </div>
            </div>
            <button
              onClick={reset}
              className="text-sm text-gray-500 hover:text-rose-600 flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> New PDF
            </button>
          </div>

          <div
            ref={scrollRef}
            className="rounded-2xl border bg-white p-4 mb-3 min-h-[300px] max-h-[500px] overflow-y-auto space-y-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            {messages.length === 0 && (
              <div className="text-center text-sm text-gray-400 py-8">
                Ask anything about this PDF — &quot;what are the main findings?&quot;, &quot;summarize section 3&quot;, &quot;list the action items&quot;.
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-violet-50 border border-violet-100 ml-12"
                    : "bg-gray-50 border border-gray-100 mr-12"
                }`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${m.role === "user" ? "text-violet-700" : "text-gray-500"}`}>
                  {m.role === "user" ? "You" : "Claude"}
                </p>
                <div className="whitespace-pre-wrap text-gray-900">{m.content}</div>
              </div>
            ))}
            {thinking && (
              <div className="rounded-xl px-4 py-3 text-sm bg-gray-50 border border-gray-100 mr-12 flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Claude is reading the document…
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !thinking) {
                  e.preventDefault();
                  ask();
                }
              }}
              placeholder="Ask a question about the PDF…"
              className="flex-1 rounded-xl border px-4 py-3 text-sm focus:border-violet-500 focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
              disabled={thinking}
            />
            <button
              onClick={ask}
              disabled={thinking || !question.trim()}
              className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
