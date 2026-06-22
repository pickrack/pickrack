"use client";

import { useState, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import JSZip from "jszip";
import { Upload, Download, Play, X, AlertCircle, Check } from "lucide-react";

type OutputFormat = "png" | "svg" | "both";

const SAMPLE_CSV = `Pickrack home,https://pickrack.com/
QR Generator,https://pickrack.com/tools/calc/qr-generator/
QR Scanner,https://pickrack.com/tools/calc/qr-scanner/
PDF Tools hub,https://pickrack.com/tools/pdf/
Image Tools hub,https://pickrack.com/tools/image/
Methodology,https://pickrack.com/methodology/`;

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuote) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQuote = false;
      else cur += c;
    } else {
      if (c === '"') inQuote = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (c === "\r") { /* skip */ }
      else cur += c;
    }
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((cell) => cell.trim()));
}

function safeFilename(s: string, fallback: string): string {
  const cleaned = (s || "").trim().replace(/\.(png|svg|jpg|jpeg)$/i, "").replace(/[^\w.-]+/g, "_").slice(0, 80);
  return cleaned || fallback;
}

type ParsedRow = { filename: string; content: string };

function detectColumns(rows: string[][]): ParsedRow[] {
  if (rows.length === 0) return [];
  const hasTwoCols = rows.every((r) => r.length >= 2);
  return rows.map((r, idx) => {
    if (hasTwoCols) {
      return {
        filename: safeFilename(r[0], `qr-${String(idx + 1).padStart(3, "0")}`),
        content: r[1].trim(),
      };
    }
    return {
      filename: `qr-${String(idx + 1).padStart(3, "0")}`,
      content: r[0].trim(),
    };
  }).filter((r) => r.content);
}

const MAX_ROWS = 500;

export default function QrBatchPage() {
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [format, setFormat] = useState<OutputFormat>("png");
  const [size, setSize] = useState(400);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [zipName, setZipName] = useState("qr-codes.zip");
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);

  const parsedRows = detectColumns(parseCsv(csvText));
  const tooManyRows = parsedRows.length > MAX_ROWS;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setCsvText(reader.result as string);
    reader.readAsText(file);
  };

  const generate = async () => {
    if (parsedRows.length === 0) {
      setError("No valid rows detected. Paste CSV with content in column 1 (or filename in col 1, content in col 2).");
      return;
    }
    if (tooManyRows) {
      setError(`Limit is ${MAX_ROWS} rows per batch. Split your CSV.`);
      return;
    }
    setError(null);
    setZipUrl(null);
    setRunning(true);
    cancelRef.current = false;
    setProgress({ done: 0, total: parsedRows.length });

    const zip = new JSZip();
    const qr = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: " ",
      margin: 0,
      qrOptions: { errorCorrectionLevel: "M" },
      dotsOptions: { type: "square", color: "#000000" },
      cornersSquareOptions: { type: "square", color: "#000000" },
      cornersDotOptions: { type: "square", color: "#000000" },
      backgroundOptions: { color: "#FFFFFF" },
    });

    try {
      for (let i = 0; i < parsedRows.length; i++) {
        if (cancelRef.current) break;
        const row = parsedRows[i];
        qr.update({ data: row.content });
        if (format === "png" || format === "both") {
          const pngBlob = await qr.getRawData("png");
          if (pngBlob) zip.file(`${row.filename}.png`, pngBlob as Blob);
        }
        if (format === "svg" || format === "both") {
          const svgBlob = await qr.getRawData("svg");
          if (svgBlob) zip.file(`${row.filename}.svg`, svgBlob as Blob);
        }
        setProgress({ done: i + 1, total: parsedRows.length });
        if (i % 5 === 0) await new Promise((r) => setTimeout(r, 0));
      }

      if (cancelRef.current) {
        setRunning(false);
        setProgress(null);
        return;
      }

      const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      const url = URL.createObjectURL(zipBlob);
      setZipUrl(url);
      setZipName(`qr-codes-${new Date().toISOString().slice(0, 10)}.zip`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setRunning(false);
    }
  };

  const cancel = () => {
    cancelRef.current = true;
  };

  const downloadZip = () => {
    if (!zipUrl) return;
    const a = document.createElement("a");
    a.href = zipUrl;
    a.download = zipName;
    a.click();
  };

  const loadSample = () => setCsvText(SAMPLE_CSV);

  const pct = progress ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Free Bulk QR Code Generator</h1>
        <p className="mt-3 text-gray-600">
          Paste a CSV — generate up to 500 QR codes in one click. Download as a ZIP of PNG/SVG files. Browser-side, no upload.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-900">CSV input</label>
          <div className="flex items-center gap-3 text-xs">
            <label className="inline-flex items-center gap-1 text-indigo-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Upload CSV
              <input type="file" accept=".csv,text/csv,text/plain" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </label>
            <button onClick={loadSample} className="inline-flex items-center gap-1 text-indigo-700">
              <Play className="w-3.5 h-3.5" /> Load sample
            </button>
          </div>
        </div>
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder={"filename,content\nhomepage,https://example.com/\nwifi-guest,WIFI:T:WPA;S:GuestNet;P:hello123;;"}
          className="w-full h-48 rounded-lg border px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none resize-none"
          style={{ borderColor: "var(--color-border)" }}
          spellCheck={false}
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className={`${tooManyRows ? "text-red-600" : "text-gray-500"}`}>
            {parsedRows.length} row{parsedRows.length === 1 ? "" : "s"} detected
            {tooManyRows && ` — over ${MAX_ROWS} row limit`}
          </span>
          <span className="text-gray-400">Column 1 = filename (optional), Column 2 = content. 1-col CSV → filenames auto-numbered.</span>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Output format</label>
            <div className="inline-flex rounded-lg border p-1 bg-gray-50 w-full" style={{ borderColor: "var(--color-border)" }}>
              {(["png", "svg", "both"] as OutputFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded uppercase ${format === f ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Size: {size}px</label>
            <input
              type="range"
              min={200}
              max={1000}
              step={100}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
        {!running && !zipUrl && (
          <button
            onClick={generate}
            disabled={parsedRows.length === 0 || tooManyRows}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 text-sm font-semibold disabled:opacity-50"
          >
            Generate {parsedRows.length} QR code{parsedRows.length === 1 ? "" : "s"}
          </button>
        )}

        {running && progress && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-900">
                Rendering {progress.done} / {progress.total}
              </p>
              <button
                onClick={cancel}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {pct}% complete · {progress.total - progress.done} remaining
            </p>
          </div>
        )}

        {zipUrl && !running && (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <Check className="w-4 h-4" />
              Generated {progress?.total ?? parsedRows.length} QR code{(progress?.total ?? parsedRows.length) === 1 ? "" : "s"}
            </div>
            <button
              onClick={downloadZip}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 text-sm font-semibold"
            >
              <Download className="w-4 h-4" /> Download {zipName}
            </button>
            <button
              onClick={() => { setZipUrl(null); setProgress(null); }}
              className="w-full text-xs text-gray-500 hover:text-gray-700"
            >
              Run another batch
            </button>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
