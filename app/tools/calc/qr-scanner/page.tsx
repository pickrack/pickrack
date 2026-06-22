"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import jsQR from "jsqr";
import {
  Upload, Camera, X, Copy, Check, ExternalLink, Phone, Mail, MessageSquare,
  MapPin, Calendar, Wifi, User, QrCode, Download, AlertCircle,
} from "lucide-react";

type ParsedType = "url" | "wifi" | "vcard" | "email" | "tel" | "sms" | "geo" | "event" | "text";

type Parsed = {
  type: ParsedType;
  raw: string;
  fields: Record<string, string>;
};

function parseDecoded(text: string): Parsed {
  const t = text.trim();
  if (/^https?:\/\//i.test(t)) return { type: "url", raw: text, fields: { url: t } };
  if (/^mailto:/i.test(t)) {
    try {
      const u = new URL(t);
      return { type: "email", raw: text, fields: { email: decodeURIComponent(u.pathname), subject: u.searchParams.get("subject") || "" } };
    } catch { return { type: "text", raw: text, fields: { text: t } }; }
  }
  if (/^tel:/i.test(t)) return { type: "tel", raw: text, fields: { phone: t.slice(4) } };
  if (/^SMSTO:/i.test(t)) {
    const rest = t.slice(6);
    const idx = rest.indexOf(":");
    return { type: "sms", raw: text, fields: { phone: idx >= 0 ? rest.slice(0, idx) : rest, message: idx >= 0 ? rest.slice(idx + 1) : "" } };
  }
  if (/^sms:/i.test(t)) {
    try {
      const u = new URL(t);
      return { type: "sms", raw: text, fields: { phone: u.pathname, message: u.searchParams.get("body") || "" } };
    } catch { return { type: "text", raw: text, fields: { text: t } }; }
  }
  if (/^geo:/i.test(t)) {
    const rest = t.slice(4);
    const [coords, query] = rest.split("?");
    const [lat, lng] = coords.split(",");
    let label = "";
    if (query) {
      try { label = new URLSearchParams(query).get("q") || ""; } catch { /* ignore */ }
    }
    return { type: "geo", raw: text, fields: { lat: lat || "", lng: lng || "", label } };
  }
  if (/^WIFI:/i.test(t)) {
    const f: Record<string, string> = {};
    t.slice(5).split(";").forEach((part) => {
      const m = part.match(/^([A-Z]):(.*)$/);
      if (m) f[m[1]] = m[2];
    });
    return { type: "wifi", raw: text, fields: { ssid: f.S || "", password: f.P || "", encryption: f.T || "WPA", hidden: f.H === "true" ? "true" : "false" } };
  }
  if (/^BEGIN:VCARD/i.test(t)) {
    const f: Record<string, string> = {};
    t.split(/\r?\n/).forEach((line) => {
      const idx = line.indexOf(":");
      if (idx <= 0) return;
      const key = line.slice(0, idx);
      const value = line.slice(idx + 1);
      const baseKey = key.split(";")[0];
      if (!f[baseKey]) f[baseKey] = value;
    });
    return { type: "vcard", raw: text, fields: f };
  }
  if (/^BEGIN:VCALENDAR/i.test(t)) {
    const f: Record<string, string> = {};
    t.split(/\r?\n/).forEach((line) => {
      const idx = line.indexOf(":");
      if (idx <= 0) return;
      const key = line.slice(0, idx).split(";")[0];
      if (["SUMMARY", "LOCATION", "DTSTART", "DTEND", "DESCRIPTION"].includes(key)) {
        f[key] = line.slice(idx + 1);
      }
    });
    return { type: "event", raw: text, fields: f };
  }
  return { type: "text", raw: text, fields: { text: t } };
}

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function QRScannerPage() {
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [history, setHistory] = useState<Parsed[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const handleDecoded = useCallback((text: string) => {
    const p = parseDecoded(text);
    setParsed(p);
    setError(null);
    setShowPassword(false);
    setHistory((h) => {
      const dedup = h.filter((x) => x.raw !== text);
      return [p, ...dedup].slice(0, 5);
    });
  }, []);

  const decodeImageBitmap = (bitmap: ImageBitmap | HTMLImageElement, w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    return jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "attemptBoth" });
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const code = decodeImageBitmap(img, img.naturalWidth, img.naturalHeight);
      URL.revokeObjectURL(url);
      if (code) handleDecoded(code.data);
      else setError("No QR code detected in this image. Try a sharper or higher-contrast picture.");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Could not read the file as an image.");
    };
    img.src = url;
  };

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  const scanLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
        if (code) {
          handleDecoded(code.data);
          stopCamera();
          return;
        }
      }
    }
    rafRef.current = requestAnimationFrame(scanLoop);
  }, [handleDecoded, stopCamera]);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      rafRef.current = requestAnimationFrame(scanLoop);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Camera unavailable";
      setError(`Camera access denied: ${msg}. Try uploading an image instead.`);
    }
  };

  useEffect(() => () => stopCamera(), [stopCamera]);

  const copyRaw = async () => {
    if (!parsed) return;
    await navigator.clipboard.writeText(parsed.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => {
    setParsed(null);
    setError(null);
    setShowPassword(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Free QR Code Scanner</h1>
        <p className="mt-3 text-gray-600">
          Upload an image or use your camera. Decodes URL, WiFi, vCard, email, phone, SMS, location, calendar event. Browser-side, no upload, no tracker.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 mb-6" style={{ borderColor: "var(--color-border)" }}>
        <div className="inline-flex rounded-lg border p-1 bg-gray-50 mb-4" style={{ borderColor: "var(--color-border)" }}>
          <button
            onClick={() => { setMode("upload"); stopCamera(); }}
            className={`px-3 py-1.5 text-sm font-medium rounded inline-flex items-center gap-1.5 ${mode === "upload" ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
          >
            <Upload className="w-4 h-4" /> Upload image
          </button>
          <button
            onClick={() => setMode("camera")}
            className={`px-3 py-1.5 text-sm font-medium rounded inline-flex items-center gap-1.5 ${mode === "camera" ? "bg-white shadow-sm text-indigo-700" : "text-gray-600"}`}
          >
            <Camera className="w-4 h-4" /> Use camera
          </button>
        </div>

        {mode === "upload" && (
          <label
            className="block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition"
            style={{ borderColor: "var(--color-border)" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-900">Drag a QR code image here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP. Image stays in your browser.</p>
          </label>
        )}

        {mode === "camera" && (
          <div>
            <div className="relative aspect-square max-w-md mx-auto bg-black rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? "" : "hidden"}`}
              />
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                  <Camera className="w-12 h-12 mb-3" />
                  <button
                    onClick={startCamera}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium"
                  >
                    Start camera
                  </button>
                  <p className="text-xs text-gray-400 mt-3">Browser will ask for camera permission.</p>
                </div>
              )}
              {cameraActive && (
                <button
                  onClick={stopCamera}
                  className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-lg bg-black/60 text-white text-xs px-3 py-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Stop
                </button>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
            {cameraActive && (
              <p className="text-xs text-center text-gray-500 mt-3">Point the camera at a QR code. Scanning live.</p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {parsed && (
        <div className="rounded-2xl border bg-white p-5 mb-6" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50">
                <Check className="w-3.5 h-3.5" />
              </span>
              Decoded · {parsed.type.toUpperCase()}
            </div>
            <button
              onClick={reset}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Scan another
            </button>
          </div>

          <ResultCard parsed={parsed} showPassword={showPassword} setShowPassword={setShowPassword} />

          <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-xs text-gray-500 font-mono truncate max-w-[60%]" title={parsed.raw}>{parsed.raw}</p>
            <button
              onClick={copyRaw}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy raw"}
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-900">Recent scans</p>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <ul className="space-y-2">
            {history.map((h, i) => (
              <li key={i}>
                <button
                  onClick={() => { setParsed(h); setShowPassword(false); }}
                  className="w-full text-left flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span className="text-xs font-mono font-bold uppercase text-indigo-600 w-12 shrink-0">{h.type}</span>
                  <span className="font-mono text-xs text-gray-700 truncate">{h.raw}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-3">History is session-only — cleared when you close this tab.</p>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  parsed, showPassword, setShowPassword,
}: { parsed: Parsed; showPassword: boolean; setShowPassword: (v: boolean) => void }) {
  const { type, fields, raw } = parsed;

  if (type === "url") {
    return (
      <div>
        <FieldRow icon={<ExternalLink className="w-4 h-4" />} label="URL" value={fields.url} mono />
        <div className="mt-3 flex gap-2">
          <a
            href={fields.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" /> Open URL
          </a>
        </div>
      </div>
    );
  }

  if (type === "wifi") {
    return (
      <div className="space-y-2">
        <FieldRow icon={<Wifi className="w-4 h-4" />} label="SSID" value={fields.ssid} />
        <div className="flex items-start gap-3 px-3 py-2 rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
          <span className="text-xs font-semibold text-gray-700 w-20 shrink-0 pt-0.5">Password</span>
          <span className="font-mono text-sm flex-1 break-all">
            {showPassword ? fields.password : "•".repeat(Math.max(8, fields.password.length))}
          </span>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-indigo-700 shrink-0"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          <CopyButton value={fields.password} label="Copy" />
        </div>
        <FieldRow icon={<Wifi className="w-4 h-4" />} label="Encryption" value={fields.encryption || "WPA"} />
      </div>
    );
  }

  if (type === "vcard") {
    const lines: { k: string; v: string; icon?: React.ReactNode }[] = [];
    if (fields.FN) lines.push({ k: "Name", v: fields.FN, icon: <User className="w-4 h-4" /> });
    if (fields.ORG) lines.push({ k: "Organization", v: fields.ORG });
    if (fields.TITLE) lines.push({ k: "Title", v: fields.TITLE });
    if (fields.EMAIL) lines.push({ k: "Email", v: fields.EMAIL, icon: <Mail className="w-4 h-4" /> });
    if (fields.TEL) lines.push({ k: "Phone", v: fields.TEL, icon: <Phone className="w-4 h-4" /> });
    if (fields.URL) lines.push({ k: "Website", v: fields.URL, icon: <ExternalLink className="w-4 h-4" /> });
    if (fields.ADR) lines.push({ k: "Address", v: fields.ADR.replace(/;/g, ", ").replace(/(^,\s*|,\s*$)/g, ""), icon: <MapPin className="w-4 h-4" /> });
    if (fields.BDAY) lines.push({ k: "Birthday", v: fields.BDAY });
    if (fields.NOTE) lines.push({ k: "Note", v: fields.NOTE });
    return (
      <div className="space-y-2">
        {lines.map((l) => <FieldRow key={l.k} icon={l.icon} label={l.k} value={l.v} />)}
        <div className="pt-2 flex gap-2 flex-wrap">
          <button
            onClick={() => downloadText(raw, `${(fields.FN || "contact").replace(/[^\w]+/g, "-")}.vcf`, "text/vcard")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm font-medium"
          >
            <Download className="w-4 h-4" /> Download .vcf
          </button>
          {fields.EMAIL && (
            <a href={`mailto:${fields.EMAIL}`} className="inline-flex items-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:border-indigo-400" style={{ borderColor: "var(--color-border)" }}>
              <Mail className="w-4 h-4" /> Email
            </a>
          )}
          {fields.TEL && (
            <a href={`tel:${fields.TEL}`} className="inline-flex items-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:border-indigo-400" style={{ borderColor: "var(--color-border)" }}>
              <Phone className="w-4 h-4" /> Call
            </a>
          )}
        </div>
      </div>
    );
  }

  if (type === "email") {
    return (
      <div className="space-y-2">
        <FieldRow icon={<Mail className="w-4 h-4" />} label="Email" value={fields.email} />
        {fields.subject && <FieldRow label="Subject" value={fields.subject} />}
        <div className="pt-2">
          <a
            href={raw}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm font-medium"
          >
            <Mail className="w-4 h-4" /> Send email
          </a>
        </div>
      </div>
    );
  }

  if (type === "tel") {
    return (
      <div className="space-y-2">
        <FieldRow icon={<Phone className="w-4 h-4" />} label="Phone" value={fields.phone} mono />
        <div className="pt-2">
          <a
            href={raw}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm font-medium"
          >
            <Phone className="w-4 h-4" /> Call
          </a>
        </div>
      </div>
    );
  }

  if (type === "sms") {
    return (
      <div className="space-y-2">
        <FieldRow icon={<MessageSquare className="w-4 h-4" />} label="Phone" value={fields.phone} mono />
        {fields.message && <FieldRow label="Message" value={fields.message} />}
        <div className="pt-2">
          <a
            href={raw}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm font-medium"
          >
            <MessageSquare className="w-4 h-4" /> Send SMS
          </a>
        </div>
      </div>
    );
  }

  if (type === "geo") {
    const mapsUrl = fields.label
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fields.label)}`
      : `https://www.google.com/maps/search/?api=1&query=${fields.lat},${fields.lng}`;
    return (
      <div className="space-y-2">
        <FieldRow icon={<MapPin className="w-4 h-4" />} label="Coordinates" value={`${fields.lat}, ${fields.lng}`} mono />
        {fields.label && <FieldRow label="Label" value={fields.label} />}
        <div className="pt-2 flex gap-2">
          <a
            href={raw}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm font-medium"
          >
            <MapPin className="w-4 h-4" /> Open native Maps
          </a>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:border-indigo-400"
            style={{ borderColor: "var(--color-border)" }}
          >
            <ExternalLink className="w-4 h-4" /> Google Maps
          </a>
        </div>
      </div>
    );
  }

  if (type === "event") {
    return (
      <div className="space-y-2">
        {fields.SUMMARY && <FieldRow icon={<Calendar className="w-4 h-4" />} label="Title" value={fields.SUMMARY} />}
        {fields.DTSTART && <FieldRow label="Start" value={formatIcalDate(fields.DTSTART)} />}
        {fields.DTEND && <FieldRow label="End" value={formatIcalDate(fields.DTEND)} />}
        {fields.LOCATION && <FieldRow icon={<MapPin className="w-4 h-4" />} label="Location" value={fields.LOCATION} />}
        {fields.DESCRIPTION && <FieldRow label="Description" value={fields.DESCRIPTION} />}
        <div className="pt-2">
          <button
            onClick={() => downloadText(raw, `${(fields.SUMMARY || "event").replace(/[^\w]+/g, "-")}.ics`, "text/calendar")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm font-medium"
          >
            <Download className="w-4 h-4" /> Download .ics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FieldRow icon={<QrCode className="w-4 h-4" />} label="Text" value={fields.text} />
    </div>
  );
}

function FieldRow({ icon, label, value, mono }: { icon?: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3 px-3 py-2 rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
      {icon && <span className="text-gray-400 shrink-0 mt-0.5">{icon}</span>}
      <span className="text-xs font-semibold text-gray-700 w-20 shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm flex-1 break-all ${mono ? "font-mono" : ""}`}>{value || "—"}</span>
      <CopyButton value={value} label="Copy" />
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-xs text-indigo-700 shrink-0"
      disabled={!value}
    >
      {copied ? <Check className="w-3.5 h-3.5 inline" /> : label}
    </button>
  );
}

function formatIcalDate(s: string): string {
  // 20260514T123000 → 2026-05-14 12:30
  const m = s.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/);
  if (!m) return s;
  const date = `${m[1]}-${m[2]}-${m[3]}`;
  const time = m[4] && m[5] ? ` ${m[4]}:${m[5]}` : "";
  return date + time;
}
