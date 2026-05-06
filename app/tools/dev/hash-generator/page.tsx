"use client";

import { useState, useEffect } from "react";
import { Copy, Check, FileText, Type as TypeIcon } from "lucide-react";

type Mode = "text" | "file";

const ALGOS: { id: string; label: string; webcrypto?: "SHA-1" | "SHA-256" | "SHA-512" | "SHA-384" }[] = [
  { id: "MD5", label: "MD5" },
  { id: "SHA-1", label: "SHA-1", webcrypto: "SHA-1" },
  { id: "SHA-256", label: "SHA-256", webcrypto: "SHA-256" },
  { id: "SHA-512", label: "SHA-512", webcrypto: "SHA-512" },
];

function bytesToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Pure-JS MD5 (legacy). Source: simplified implementation.
// Public-domain MD5 derived from RFC 1321, kept short. Not cryptographically secure.
function md5(input: Uint8Array): string {
  const r = (n: number, s: number) => ((n << s) | (n >>> (32 - s))) >>> 0;
  const add32 = (a: number, b: number) => ((a + b) & 0xffffffff) >>> 0;
  const toBytes = (str: Uint8Array): number[] => {
    const padded: number[] = Array.from(str);
    const origLen = padded.length;
    padded.push(0x80);
    while (padded.length % 64 !== 56) padded.push(0);
    const bitLen = origLen * 8;
    for (let i = 0; i < 8; i++) padded.push((bitLen >>> (i * 8)) & 0xff);
    return padded;
  };
  const K = new Int32Array([
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
  ]);
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const bytes = toBytes(input);
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  for (let i = 0; i < bytes.length; i += 64) {
    const M = new Int32Array(16);
    for (let j = 0; j < 16; j++) {
      M[j] = bytes[i + j * 4] | (bytes[i + j * 4 + 1] << 8) | (bytes[i + j * 4 + 2] << 16) | (bytes[i + j * 4 + 3] << 24);
    }
    let aa = a, bb = b, cc = c, dd = d;
    for (let j = 0; j < 64; j++) {
      let f = 0, g = 0;
      if (j < 16) { f = (bb & cc) | (~bb & dd); g = j; }
      else if (j < 32) { f = (dd & bb) | (~dd & cc); g = (5 * j + 1) % 16; }
      else if (j < 48) { f = bb ^ cc ^ dd; g = (3 * j + 5) % 16; }
      else { f = cc ^ (bb | ~dd); g = (7 * j) % 16; }
      const temp = dd;
      dd = cc;
      cc = bb;
      bb = add32(bb, r(add32(add32(add32(aa, f), K[j]), M[g]), S[j]));
      aa = temp;
    }
    a = add32(a, aa); b = add32(b, bb); c = add32(c, cc); d = add32(d, dd);
  }
  const toHex = (n: number) => {
    let s = "";
    for (let i = 0; i < 4; i++) s += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0");
    return s;
  };
  return toHex(a) + toHex(b) + toHex(c) + toHex(d);
}

async function computeHashes(bytes: Uint8Array): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  out["MD5"] = md5(bytes);
  for (const algo of ["SHA-1", "SHA-256", "SHA-512"] as const) {
    const buf = await crypto.subtle.digest(algo, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer);
    out[algo] = bytesToHex(buf);
  }
  return out;
}

export default function HashGeneratorPage() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Live hash for text mode (debounced)
  useEffect(() => {
    if (mode !== "text") return;
    if (!text) {
      setHashes({});
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const bytes = new TextEncoder().encode(text);
        setHashes(await computeHashes(bytes));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Hash failed");
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [text, mode]);

  const hashFile = async (f: File) => {
    if (f.size > 100 * 1024 * 1024) {
      setError("File too large. Max 100MB.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const buf = await f.arrayBuffer();
      const bytes = new Uint8Array(buf);
      setHashes(await computeHashes(bytes));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hash failed");
    } finally {
      setProcessing(false);
    }
  };

  const copy = async (algo: string, hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopied(algo);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Hash Generator</h1>
        <p className="mt-3 text-gray-600">Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or files. Browser-side, no upload.</p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-4" style={{ borderColor: "var(--color-border)" }}>
        <div className="inline-flex rounded-lg border bg-gray-50 p-1 mb-4" style={{ borderColor: "var(--color-border)" }}>
          {(["text", "file"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setHashes({}); setError(null); }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition inline-flex items-center gap-1.5 ${
                mode === m ? "bg-white text-blue-700 shadow-sm" : "text-gray-600"
              }`}
            >
              {m === "text" ? <><TypeIcon className="w-3.5 h-3.5" /> Text</> : <><FileText className="w-3.5 h-3.5" /> File</>}
            </button>
          ))}
        </div>

        {mode === "text" ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste any text…"
            spellCheck={false}
            className="w-full rounded-xl border p-3 text-sm h-[150px] focus:border-blue-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        ) : (
          <div>
            <input
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setFile(f); hashFile(f); }
              }}
              className="w-full text-sm"
            />
            {file && <p className="text-xs text-gray-500 mt-2">{file.name} · {(file.size / 1024).toFixed(1)} KB</p>}
            {processing && <p className="text-xs text-blue-600 mt-2">Hashing…</p>}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">{error}</p>}

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-2">
          {ALGOS.map((a) => (
            <div key={a.id} className="rounded-xl border bg-white p-4 flex items-center gap-3" style={{ borderColor: "var(--color-border)" }}>
              <span className="font-mono text-xs font-semibold text-blue-700 w-20 shrink-0">{a.label}</span>
              <code className="font-mono text-xs text-gray-700 flex-1 break-all">{hashes[a.id]}</code>
              <button
                onClick={() => copy(a.id, hashes[a.id])}
                className="text-xs px-2.5 py-1 rounded-md border bg-white hover:border-blue-400 inline-flex items-center gap-1.5 shrink-0"
                style={{ borderColor: "var(--color-border)" }}
              >
                {copied === a.id ? <><Check className="w-3 h-3 text-blue-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
