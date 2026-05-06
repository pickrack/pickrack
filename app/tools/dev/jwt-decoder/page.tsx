"use client";

import { useState, useMemo } from "react";
import { Copy, Check, AlertTriangle, ShieldCheck } from "lucide-react";

type JWTParts = {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  raw: { header: string; payload: string; signature: string };
} | { error: string };

function urlSafeB64Decode(s: string): string {
  let normalized = s.replace(/-/g, "+").replace(/_/g, "/");
  while (normalized.length % 4) normalized += "=";
  try {
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  } catch (e) {
    throw new Error(`Invalid Base64 segment: ${e instanceof Error ? e.message : "decode failed"}`);
  }
}

function decodeJWT(token: string): JWTParts {
  const cleaned = token.trim().replace(/^Bearer\s+/i, "");
  const parts = cleaned.split(".");
  if (parts.length !== 3) {
    return { error: `Invalid JWT: expected 3 segments separated by dots, got ${parts.length}.` };
  }
  try {
    const headerStr = urlSafeB64Decode(parts[0]);
    const payloadStr = urlSafeB64Decode(parts[1]);
    const header = JSON.parse(headerStr) as Record<string, unknown>;
    const payload = JSON.parse(payloadStr) as Record<string, unknown>;
    return {
      header,
      payload,
      signature: parts[2],
      raw: { header: parts[0], payload: parts[1], signature: parts[2] },
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to parse JWT" };
  }
}

const STANDARD_CLAIMS: Record<string, string> = {
  iss: "Issuer",
  sub: "Subject",
  aud: "Audience",
  exp: "Expiration",
  nbf: "Not before",
  iat: "Issued at",
  jti: "JWT ID",
};

function formatTimestamp(seconds: unknown): { display: string; status?: "expired" | "future" | "current" } | null {
  if (typeof seconds !== "number") return null;
  const date = new Date(seconds * 1000);
  if (Number.isNaN(date.getTime())) return null;
  const now = Date.now();
  const ms = date.getTime();
  let status: "expired" | "future" | "current" = "current";
  if (ms < now - 60_000) status = "expired";
  else if (ms > now + 60_000) status = "future";
  return { display: date.toISOString().replace("T", " ").replace(".000", "").replace("Z", " UTC"), status };
}

export default function JWTDecoderPage() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState<"header" | "payload" | null>(null);

  const decoded = useMemo(() => (token.trim() ? decodeJWT(token) : null), [token]);

  const copy = async (kind: "header" | "payload", obj: Record<string, unknown>) => {
    await navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">JWT Decoder</h1>
        <p className="mt-3 text-gray-600">Decode JWT header and payload. Browser-side — your token never leaves your tab.</p>
      </div>

      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-start gap-3 text-sm text-blue-900">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
        <div>
          <p className="font-medium">Decode-only — does NOT verify signatures</p>
          <p className="mt-1 text-blue-800">Signature verification needs the secret/public key. Pickrack stays decode-only for safety. Open DevTools to verify zero network calls.</p>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-900 mb-2 block">Paste your JWT</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          spellCheck={false}
          className="w-full rounded-2xl border p-4 font-mono text-xs h-[140px] focus:border-blue-500 focus:outline-none break-all"
          style={{ borderColor: "var(--color-border)" }}
        />
      </div>

      {decoded && "error" in decoded && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">Decode failed</p>
            <p className="text-xs font-mono text-red-700 mt-1">{decoded.error}</p>
          </div>
        </div>
      )}

      {decoded && !("error" in decoded) && decoded.header && decoded.payload && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Header</h2>
              <button
                onClick={() => copy("header", decoded.header!)}
                className="text-xs px-2.5 py-1 rounded-md border bg-white hover:border-blue-400 inline-flex items-center gap-1.5"
                style={{ borderColor: "var(--color-border)" }}
              >
                {copied === "header" ? <><Check className="w-3 h-3 text-blue-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
            <pre className="text-xs font-mono bg-gray-50 rounded-lg p-3 overflow-auto max-h-[300px]">
{JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Payload</h2>
              <button
                onClick={() => copy("payload", decoded.payload!)}
                className="text-xs px-2.5 py-1 rounded-md border bg-white hover:border-blue-400 inline-flex items-center gap-1.5"
                style={{ borderColor: "var(--color-border)" }}
              >
                {copied === "payload" ? <><Check className="w-3 h-3 text-blue-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
            <pre className="text-xs font-mono bg-gray-50 rounded-lg p-3 overflow-auto max-h-[300px]">
{JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>

          <div className="rounded-2xl border bg-white p-5 lg:col-span-2" style={{ borderColor: "var(--color-border)" }}>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Standard claims explained</h2>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              {Object.entries(STANDARD_CLAIMS).map(([key, label]) => {
                const value = decoded.payload![key];
                if (value === undefined) return null;
                const ts = ["exp", "nbf", "iat"].includes(key) ? formatTimestamp(value) : null;
                return (
                  <div key={key} className="flex items-baseline gap-2 py-1 border-b" style={{ borderColor: "var(--color-border)" }}>
                    <span className="font-mono text-blue-700 font-semibold w-12 shrink-0">{key}</span>
                    <span className="text-gray-500 text-xs w-20 shrink-0">{label}</span>
                    {ts ? (
                      <span className={`text-xs ${ts.status === "expired" ? "text-red-600" : ts.status === "future" ? "text-amber-600" : "text-gray-700"}`}>
                        {ts.display} {ts.status === "expired" ? "(expired)" : ts.status === "future" ? "(future)" : ""}
                      </span>
                    ) : (
                      <span className="text-gray-700 text-xs break-all">{JSON.stringify(value)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
