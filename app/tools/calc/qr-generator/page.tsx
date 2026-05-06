"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Download, QrCode, Wifi, User, Mail, Link as LinkIcon } from "lucide-react";

type ContentType = "url" | "text" | "wifi" | "vcard" | "email";
type ECLevel = "L" | "M" | "Q" | "H";

const EC_LABEL: Record<ECLevel, string> = {
  L: "Low (~7%)",
  M: "Medium (~15%)",
  Q: "Quartile (~25%)",
  H: "High (~30%)",
};

function buildPayload(type: ContentType, fields: Record<string, string>): string {
  switch (type) {
    case "url":
    case "text":
      return fields.value || "";
    case "email":
      return `mailto:${fields.email || ""}${fields.subject ? `?subject=${encodeURIComponent(fields.subject)}` : ""}`;
    case "wifi": {
      const enc = fields.encryption || "WPA";
      return `WIFI:T:${enc};S:${fields.ssid || ""};P:${fields.password || ""};${fields.hidden === "true" ? "H:true;" : ""};`;
    }
    case "vcard":
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${fields.name || ""}`,
        fields.org ? `ORG:${fields.org}` : "",
        fields.title ? `TITLE:${fields.title}` : "",
        fields.email ? `EMAIL:${fields.email}` : "",
        fields.phone ? `TEL:${fields.phone}` : "",
        fields.url ? `URL:${fields.url}` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    default:
      return "";
  }
}

export default function QRGeneratorPage() {
  const [type, setType] = useState<ContentType>("url");
  const [fields, setFields] = useState<Record<string, string>>({ value: "https://pickrack.com/" });
  const [size, setSize] = useState(400);
  const [ec, setEc] = useState<ECLevel>("M");
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const payload = buildPayload(type, fields);

  useEffect(() => {
    if (!payload || !canvasRef.current) {
      setPngUrl(null);
      setSvgString(null);
      return;
    }
    QRCode.toCanvas(canvasRef.current, payload, {
      width: size,
      errorCorrectionLevel: ec,
      margin: 2,
    })
      .then(() => {
        setPngUrl(canvasRef.current?.toDataURL("image/png") ?? null);
        return QRCode.toString(payload, { type: "svg", errorCorrectionLevel: ec, margin: 2, width: size });
      })
      .then((svg) => {
        setSvgString(svg);
        setError(null);
      })
      .catch((e: Error) => {
        setError(e.message || "QR generation failed");
        setPngUrl(null);
        setSvgString(null);
      });
  }, [payload, size, ec]);

  const downloadPng = () => {
    if (!pngUrl) return;
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = "qr-code.png";
    a.click();
  };

  const downloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const setField = (key: string, value: string) => setFields((p) => ({ ...p, [key]: value }));

  const TYPES: { id: ContentType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "url", label: "URL", icon: LinkIcon },
    { id: "text", label: "Text", icon: QrCode },
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "vcard", label: "vCard", icon: User },
    { id: "email", label: "Email", icon: Mail },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">QR Code Generator</h1>
        <p className="mt-3 text-gray-600">URLs, text, WiFi, vCards, email. Browser-side. Download PNG or SVG.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Content type</label>
            <div className="grid grid-cols-5 gap-2">
              {TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setType(t.id); setFields({}); }}
                    className={`p-2 rounded-lg border text-xs font-medium transition flex flex-col items-center gap-1 ${
                      type === t.id ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-white"
                    }`}
                    style={{ borderColor: type === t.id ? undefined : "var(--color-border)" }}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            {(type === "url" || type === "text") && (
              <Field label={type === "url" ? "URL" : "Text"} value={fields.value || ""} onChange={(v) => setField("value", v)} placeholder={type === "url" ? "https://example.com" : "Any text"} />
            )}
            {type === "email" && (
              <>
                <Field label="Email address" value={fields.email || ""} onChange={(v) => setField("email", v)} placeholder="hello@example.com" />
                <Field label="Subject (optional)" value={fields.subject || ""} onChange={(v) => setField("subject", v)} placeholder="Hello from QR" />
              </>
            )}
            {type === "wifi" && (
              <>
                <Field label="Network name (SSID)" value={fields.ssid || ""} onChange={(v) => setField("ssid", v)} placeholder="MyNetwork" />
                <Field label="Password" value={fields.password || ""} onChange={(v) => setField("password", v)} placeholder="password123" />
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">Encryption</label>
                  <div className="flex gap-2">
                    {(["WPA", "WEP", "nopass"] as const).map((e) => (
                      <button
                        key={e}
                        onClick={() => setField("encryption", e)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                          (fields.encryption || "WPA") === e ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-white"
                        }`}
                        style={{ borderColor: (fields.encryption || "WPA") === e ? undefined : "var(--color-border)" }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            {type === "vcard" && (
              <>
                <Field label="Full name" value={fields.name || ""} onChange={(v) => setField("name", v)} placeholder="John Doe" />
                <Field label="Organization" value={fields.org || ""} onChange={(v) => setField("org", v)} placeholder="Pickrack" />
                <Field label="Title" value={fields.title || ""} onChange={(v) => setField("title", v)} placeholder="Founder" />
                <Field label="Email" value={fields.email || ""} onChange={(v) => setField("email", v)} placeholder="hello@example.com" />
                <Field label="Phone" value={fields.phone || ""} onChange={(v) => setField("phone", v)} placeholder="+1 555 123 4567" />
                <Field label="Website" value={fields.url || ""} onChange={(v) => setField("url", v)} placeholder="https://example.com" />
              </>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Size: {size}px</label>
              <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Error correction</label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(EC_LABEL) as ECLevel[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setEc(l)}
                    className={`p-2 rounded-lg border text-xs font-medium transition ${
                      ec === l ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-white"
                    }`}
                    style={{ borderColor: ec === l ? undefined : "var(--color-border)" }}
                  >
                    <div className="font-mono font-bold">{l}</div>
                    <div className="text-xs text-gray-500">{EC_LABEL[l].split(" ")[1]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border bg-white p-5 sticky top-20" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-sm font-semibold text-gray-900 mb-3">Preview</p>
            {error ? (
              <div className="aspect-square bg-red-50 border border-red-200 rounded-xl flex items-center justify-center p-4">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl border flex items-center justify-center" style={{ borderColor: "var(--color-border)" }}>
                <canvas ref={canvasRef} className="max-w-full" />
              </div>
            )}
            {pngUrl && !error && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={downloadPng}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm font-medium transition"
                >
                  <Download className="w-4 h-4" /> PNG
                </button>
                <button
                  onClick={downloadSvg}
                  disabled={!svgString}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:border-indigo-400 disabled:opacity-50"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <Download className="w-4 h-4" /> SVG
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-900 mb-1 block">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        style={{ borderColor: "var(--color-border)" }}
      />
    </div>
  );
}
