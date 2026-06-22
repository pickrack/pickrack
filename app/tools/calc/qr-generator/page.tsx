"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import QRCodeStyling from "qr-code-styling";
import type {
  Options,
  DotType,
  CornerSquareType,
  CornerDotType,
  GradientType,
} from "qr-code-styling";
import {
  Download,
  QrCode,
  Wifi,
  User,
  Mail,
  Link as LinkIcon,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Upload,
  X,
  Wallet,
} from "lucide-react";

type ContentType =
  | "url"
  | "text"
  | "wifi"
  | "vcard"
  | "email"
  | "tel"
  | "sms"
  | "geo"
  | "event"
  | "payment";

type PaymentMethod = "bitcoin" | "ethereum" | "lightning" | "paypal" | "vietqr";

const VIET_BANKS: { bin: string; name: string }[] = [
  { bin: "970436", name: "Vietcombank (VCB)" },
  { bin: "970407", name: "Techcombank (TCB)" },
  { bin: "970418", name: "BIDV" },
  { bin: "970422", name: "MB Bank (MBB)" },
  { bin: "970415", name: "VietinBank (CTG)" },
  { bin: "970405", name: "Agribank" },
  { bin: "970416", name: "ACB" },
  { bin: "970403", name: "Sacombank" },
  { bin: "970432", name: "VPBank" },
  { bin: "970423", name: "TPBank" },
  { bin: "970441", name: "VIB" },
  { bin: "970443", name: "SHB" },
  { bin: "970437", name: "HDBank" },
  { bin: "970431", name: "Eximbank" },
  { bin: "970449", name: "LPBank" },
  { bin: "970426", name: "MSB" },
  { bin: "970448", name: "OCB" },
  { bin: "970454", name: "Viet Capital Bank" },
];

function tlv(id: string, value: string): string {
  return id + value.length.toString().padStart(2, "0") + value;
}

function crc16ccitt(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function buildVietQR(bin: string, account: string, amount: string, message: string): string {
  if (!bin || !account) return "";
  const beneficiary = tlv("00", bin) + tlv("01", account);
  const merchantInfo = tlv("00", "A000000727") + tlv("01", beneficiary) + tlv("02", "QRIBFTTA");
  const amt = (amount || "").trim();
  const msg = (message || "").trim();
  let payload =
    tlv("00", "01") +
    tlv("01", amt ? "12" : "11") +
    tlv("38", merchantInfo) +
    tlv("53", "704") +
    (amt ? tlv("54", amt) : "") +
    tlv("58", "VN") +
    (msg ? tlv("62", tlv("08", msg)) : "");
  payload += "6304";
  return payload + crc16ccitt(payload);
}
type ECLevel = "L" | "M" | "Q" | "H";
type FrameStyle = "none" | "border" | "caption" | "scan-me";

const EC_LABEL: Record<ECLevel, string> = {
  L: "Low (~7%)",
  M: "Medium (~15%)",
  Q: "Quartile (~25%)",
  H: "High (~30%)",
};

const DOT_STYLES: { id: DotType; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "dots", label: "Dots" },
  { id: "classy", label: "Classy" },
  { id: "classy-rounded", label: "Classy-R" },
  { id: "extra-rounded", label: "X-Rounded" },
];

const EYE_FRAME_STYLES: { id: CornerSquareType; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "extra-rounded", label: "Rounded" },
  { id: "dot", label: "Dot" },
];

const EYE_BALL_STYLES: { id: CornerDotType; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "dot", label: "Dot" },
];

const FRAME_STYLES: { id: FrameStyle; label: string }[] = [
  { id: "none", label: "None" },
  { id: "border", label: "Border" },
  { id: "caption", label: "Caption" },
  { id: "scan-me", label: "Scan-me" },
];

function toICalDate(dt: string): string {
  if (!dt) return "";
  return dt.replace(/[-:]/g, "") + "00";
}

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
    case "vcard": {
      const adrParts = ["", "", fields.adrStreet || "", fields.adrCity || "", fields.adrRegion || "", fields.adrPostal || "", fields.adrCountry || ""];
      const hasAdr = adrParts.slice(2).some((p) => p);
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${fields.name || ""}`,
        fields.org ? `ORG:${fields.org}` : "",
        fields.title ? `TITLE:${fields.title}` : "",
        fields.email ? `EMAIL:${fields.email}` : "",
        fields.emailWork ? `EMAIL;TYPE=WORK:${fields.emailWork}` : "",
        fields.phone ? `TEL;TYPE=CELL:${fields.phone}` : "",
        fields.phoneWork ? `TEL;TYPE=WORK:${fields.phoneWork}` : "",
        fields.url ? `URL:${fields.url}` : "",
        fields.linkedin ? `URL;TYPE=LinkedIn:${fields.linkedin}` : "",
        fields.twitter ? `URL;TYPE=Twitter:${fields.twitter}` : "",
        fields.github ? `URL;TYPE=GitHub:${fields.github}` : "",
        hasAdr ? `ADR;TYPE=WORK:${adrParts.join(";")}` : "",
        fields.bday ? `BDAY:${fields.bday}` : "",
        fields.note ? `NOTE:${fields.note.replace(/\n/g, "\\n")}` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    }
    case "tel":
      return `tel:${fields.phone || ""}`;
    case "sms":
      return `SMSTO:${fields.phone || ""}:${fields.message || ""}`;
    case "geo": {
      const lat = fields.lat || "0";
      const lng = fields.lng || "0";
      return fields.label
        ? `geo:${lat},${lng}?q=${encodeURIComponent(fields.label)}`
        : `geo:${lat},${lng}`;
    }
    case "event":
      return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:${fields.title || ""}`,
        fields.location ? `LOCATION:${fields.location}` : "",
        fields.start ? `DTSTART:${toICalDate(fields.start)}` : "",
        fields.end ? `DTEND:${toICalDate(fields.end)}` : "",
        fields.description ? `DESCRIPTION:${fields.description}` : "",
        "END:VEVENT",
        "END:VCALENDAR",
      ].filter(Boolean).join("\n");
    case "payment": {
      const method = (fields.payMethod || "bitcoin") as PaymentMethod;
      if (method === "bitcoin" || method === "ethereum") {
        const scheme = method === "bitcoin" ? "bitcoin" : "ethereum";
        const addr = (fields.payAddress || "").trim();
        if (!addr) return "";
        const params: string[] = [];
        if (fields.payAmount) params.push(`${method === "ethereum" ? "value" : "amount"}=${encodeURIComponent(fields.payAmount)}`);
        if (fields.payLabel) params.push(`label=${encodeURIComponent(fields.payLabel)}`);
        if (fields.payMessage) params.push(`message=${encodeURIComponent(fields.payMessage)}`);
        return `${scheme}:${addr}${params.length ? `?${params.join("&")}` : ""}`;
      }
      if (method === "lightning") {
        const invoice = (fields.payInvoice || "").trim();
        if (!invoice) return "";
        return `lightning:${invoice.replace(/^lightning:/i, "")}`;
      }
      if (method === "paypal") {
        const username = (fields.payUsername || "").trim().replace(/^@/, "");
        if (!username) return "";
        const amt = (fields.payAmount || "").trim();
        const ccy = (fields.payCurrency || "USD").trim().toUpperCase();
        if (amt) return `https://www.paypal.me/${username}/${amt}${ccy !== "USD" ? `?currency_code=${ccy}` : ""}`;
        return `https://www.paypal.me/${username}`;
      }
      if (method === "vietqr") {
        return buildVietQR(
          fields.payBank || "",
          fields.payAccount || "",
          fields.payAmount || "",
          fields.payMessage || "",
        );
      }
      return "";
    }
    default:
      return "";
  }
}

export default function QRGeneratorPage() {
  // Content
  const [type, setType] = useState<ContentType>("url");
  const [fields, setFields] = useState<Record<string, string>>({ value: "https://pickrack.com/" });
  const [vcardAdvanced, setVcardAdvanced] = useState(false);

  // QR core
  const [size, setSize] = useState(400);
  const [ec, setEc] = useState<ECLevel>("M");

  // Colors + gradient
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#FFFFFF");
  const [useGradient, setUseGradient] = useState(false);
  const [gradientColor, setGradientColor] = useState("#6366F1");
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [gradientRotation, setGradientRotation] = useState(0);

  // Design
  const [dotStyle, setDotStyle] = useState<DotType>("square");
  const [eyeFrameStyle, setEyeFrameStyle] = useState<CornerSquareType>("square");
  const [eyeBallStyle, setEyeBallStyle] = useState<CornerDotType>("square");

  // Logo
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  // Frame
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("none");
  const [frameText, setFrameText] = useState("SCAN ME");
  const [frameColor, setFrameColor] = useState("#111827");

  const [svgString, setSvgString] = useState<string | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const qrRef = useRef<QRCodeStyling | null>(null);

  const payload = buildPayload(type, fields);
  const effectiveEc: ECLevel = logoSrc ? "H" : ec;

  const qrOptions = useMemo<Options>(() => {
    const dotsColorBlock = useGradient
      ? {
          gradient: {
            type: gradientType,
            rotation: (gradientRotation * Math.PI) / 180,
            colorStops: [
              { offset: 0, color: darkColor },
              { offset: 1, color: gradientColor },
            ],
          },
        }
      : { color: darkColor };

    return {
      width: size,
      height: size,
      type: "svg",
      data: payload || " ",
      margin: 0,
      qrOptions: { errorCorrectionLevel: effectiveEc },
      backgroundOptions: { color: lightColor },
      dotsOptions: { type: dotStyle, ...dotsColorBlock },
      cornersSquareOptions: { type: eyeFrameStyle, color: darkColor },
      cornersDotOptions: { type: eyeBallStyle, color: darkColor },
      image: logoSrc || undefined,
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.3,
        margin: 4,
        crossOrigin: "anonymous",
      },
    };
  }, [
    payload, size, effectiveEc, darkColor, lightColor,
    useGradient, gradientColor, gradientType, gradientRotation,
    dotStyle, eyeFrameStyle, eyeBallStyle, logoSrc,
  ]);

  useEffect(() => {
    let cancelled = false;
    const frameOpts = { style: frameStyle, text: frameText, color: frameColor, bg: lightColor };

    const render = async () => {
      if (!payload) {
        setSvgString(null);
        setPngUrl(null);
        return;
      }

      // Step 1: SVG generation — critical for preview + SVG download
      try {
        if (!qrRef.current) {
          qrRef.current = new QRCodeStyling(qrOptions);
        } else {
          qrRef.current.update(qrOptions);
        }
        const svgBlob = await qrRef.current.getRawData("svg");
        if (cancelled || !svgBlob) return;
        const rawSvg = await (svgBlob as Blob).text();
        const wrappedSvg = frameStyle === "none"
          ? rawSvg
          : wrapFrame(rawSvg, frameOpts);
        if (cancelled) return;
        setSvgString(wrappedSvg);
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "QR generation failed");
          setSvgString(null);
          setPngUrl(null);
        }
        return;
      }

      // Step 2: PNG generation — non-critical, silently skip if it fails
      try {
        const pngBlob = await qrRef.current!.getRawData("png");
        if (cancelled || !pngBlob) return;
        const basePng = await blobToDataUrl(pngBlob as Blob);
        const finalPng = frameStyle === "none"
          ? basePng
          : await compositeFrameOnPng(basePng, size, frameOpts);
        if (!cancelled) setPngUrl(finalPng);
      } catch {
        if (!cancelled) setPngUrl(null);
      }
    };

    render();
    return () => { cancelled = true; };
  }, [qrOptions, payload, frameStyle, frameText, frameColor, lightColor, size]);

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

  const setField = (key: string, value: string) =>
    setFields((p) => ({ ...p, [key]: value }));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetColors = () => {
    setDarkColor("#000000");
    setLightColor("#FFFFFF");
    setUseGradient(false);
    setGradientColor("#6366F1");
  };

  const TYPES: { id: ContentType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "url", label: "URL", icon: LinkIcon },
    { id: "text", label: "Text", icon: QrCode },
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "vcard", label: "vCard", icon: User },
    { id: "email", label: "Email", icon: Mail },
    { id: "tel", label: "Phone", icon: Phone },
    { id: "sms", label: "SMS", icon: MessageSquare },
    { id: "geo", label: "Location", icon: MapPin },
    { id: "event", label: "Event", icon: Calendar },
    { id: "payment", label: "Payment", icon: Wallet },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Free QR Code Generator</h1>
        <p className="mt-3 text-gray-600">
          10 content types incl. crypto + VietQR · custom shapes + gradient · logo overlay · scan-me frame · PNG or SVG. No signup, no tracker.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Section title="Content type">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
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
          </Section>

          <Section>
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
                <Field label="Mobile phone" value={fields.phone || ""} onChange={(v) => setField("phone", v)} placeholder="+1 555 123 4567" />
                <Field label="Website" value={fields.url || ""} onChange={(v) => setField("url", v)} placeholder="https://example.com" />
                <button
                  onClick={() => setVcardAdvanced(!vcardAdvanced)}
                  className="text-xs font-medium text-indigo-700 hover:underline self-start"
                >
                  {vcardAdvanced ? "− Hide advanced fields" : "+ Show advanced fields (work contact, social, address, birthday, note)"}
                </button>
                {vcardAdvanced && (
                  <div className="space-y-3 pt-1 border-t" style={{ borderColor: "var(--color-border)" }}>
                    <Field label="Work email" value={fields.emailWork || ""} onChange={(v) => setField("emailWork", v)} placeholder="work@example.com" />
                    <Field label="Work phone" value={fields.phoneWork || ""} onChange={(v) => setField("phoneWork", v)} placeholder="+1 555 999 8888" />
                    <Field label="LinkedIn URL" value={fields.linkedin || ""} onChange={(v) => setField("linkedin", v)} placeholder="https://linkedin.com/in/username" />
                    <Field label="Twitter / X URL" value={fields.twitter || ""} onChange={(v) => setField("twitter", v)} placeholder="https://twitter.com/username" />
                    <Field label="GitHub URL" value={fields.github || ""} onChange={(v) => setField("github", v)} placeholder="https://github.com/username" />
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-1 block">Address</label>
                      <div className="space-y-2">
                        <Field label="" value={fields.adrStreet || ""} onChange={(v) => setField("adrStreet", v)} placeholder="123 Main St" />
                        <div className="grid grid-cols-2 gap-2">
                          <Field label="" value={fields.adrCity || ""} onChange={(v) => setField("adrCity", v)} placeholder="City" />
                          <Field label="" value={fields.adrRegion || ""} onChange={(v) => setField("adrRegion", v)} placeholder="State / Region" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Field label="" value={fields.adrPostal || ""} onChange={(v) => setField("adrPostal", v)} placeholder="Postal code" />
                          <Field label="" value={fields.adrCountry || ""} onChange={(v) => setField("adrCountry", v)} placeholder="Country" />
                        </div>
                      </div>
                    </div>
                    <Field label="Birthday (YYYY-MM-DD)" value={fields.bday || ""} onChange={(v) => setField("bday", v)} placeholder="1990-05-14" />
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-1 block">Note</label>
                      <textarea
                        value={fields.note || ""}
                        onChange={(e) => setField("note", e.target.value)}
                        placeholder="Free-form note attached to the contact card"
                        rows={2}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none resize-none"
                        style={{ borderColor: "var(--color-border)" }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      vCard 3.0 format. Long URLs (LinkedIn, etc.) push the QR size up — keep critical fields short or test the scan first.
                    </p>
                  </div>
                )}
              </>
            )}
            {type === "tel" && (
              <Field label="Phone number" value={fields.phone || ""} onChange={(v) => setField("phone", v)} placeholder="+1 555 123 4567" />
            )}
            {type === "sms" && (
              <>
                <Field label="Phone number" value={fields.phone || ""} onChange={(v) => setField("phone", v)} placeholder="+1 555 123 4567" />
                <Field label="Message (optional)" value={fields.message || ""} onChange={(v) => setField("message", v)} placeholder="Hi from QR" />
              </>
            )}
            {type === "geo" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Latitude" value={fields.lat || ""} onChange={(v) => setField("lat", v)} placeholder="37.3382" />
                  <Field label="Longitude" value={fields.lng || ""} onChange={(v) => setField("lng", v)} placeholder="-121.8863" />
                </div>
                <Field label="Label (optional)" value={fields.label || ""} onChange={(v) => setField("label", v)} placeholder="San Jose, CA" />
              </>
            )}
            {type === "event" && (
              <>
                <Field label="Event title" value={fields.title || ""} onChange={(v) => setField("title", v)} placeholder="Pickrack launch party" />
                <div className="grid grid-cols-2 gap-3">
                  <DateTimeField label="Start" value={fields.start || ""} onChange={(v) => setField("start", v)} />
                  <DateTimeField label="End" value={fields.end || ""} onChange={(v) => setField("end", v)} />
                </div>
                <Field label="Location (optional)" value={fields.location || ""} onChange={(v) => setField("location", v)} placeholder="123 Main St" />
                <Field label="Description (optional)" value={fields.description || ""} onChange={(v) => setField("description", v)} placeholder="Cake + tools demos" />
              </>
            )}
            {type === "payment" && (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">Payment method</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(["bitcoin", "ethereum", "lightning", "paypal", "vietqr"] as PaymentMethod[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setField("payMethod", m)}
                        className={`p-2 rounded-lg border text-xs font-medium transition capitalize ${
                          (fields.payMethod || "bitcoin") === m
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "bg-white"
                        }`}
                        style={{ borderColor: (fields.payMethod || "bitcoin") === m ? undefined : "var(--color-border)" }}
                      >
                        {m === "vietqr" ? "VietQR" : m}
                      </button>
                    ))}
                  </div>
                </div>

                {(fields.payMethod || "bitcoin") === "bitcoin" && (
                  <>
                    <Field label="Bitcoin address" value={fields.payAddress || ""} onChange={(v) => setField("payAddress", v)} placeholder="bc1q... or 1A... or 3J..." />
                    <Field label="Amount in BTC (optional)" value={fields.payAmount || ""} onChange={(v) => setField("payAmount", v)} placeholder="0.001" />
                    <Field label="Label (optional)" value={fields.payLabel || ""} onChange={(v) => setField("payLabel", v)} placeholder="Coffee for Alice" />
                    <Field label="Message (optional)" value={fields.payMessage || ""} onChange={(v) => setField("payMessage", v)} placeholder="Thanks!" />
                    <p className="text-xs text-gray-500">BIP-21 URI. Compatible with most BTC wallets.</p>
                  </>
                )}

                {fields.payMethod === "ethereum" && (
                  <>
                    <Field label="Ethereum address (0x...)" value={fields.payAddress || ""} onChange={(v) => setField("payAddress", v)} placeholder="0x..." />
                    <Field label="Amount in wei (optional)" value={fields.payAmount || ""} onChange={(v) => setField("payAmount", v)} placeholder="1000000000000000000 (= 1 ETH)" />
                    <p className="text-xs text-gray-500">EIP-681 URI. Amount in wei (1 ETH = 10^18 wei). Most wallets prompt for amount on scan.</p>
                  </>
                )}

                {fields.payMethod === "lightning" && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-1 block">BOLT11 invoice</label>
                      <textarea
                        value={fields.payInvoice || ""}
                        onChange={(e) => setField("payInvoice", e.target.value)}
                        placeholder="lnbc1..."
                        rows={3}
                        className="w-full rounded-lg border px-3 py-2 font-mono text-xs focus:border-indigo-500 focus:outline-none resize-none"
                        style={{ borderColor: "var(--color-border)" }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Paste a BOLT11 invoice from your Lightning wallet. Pickrack wraps it as <code>lightning:&lt;invoice&gt;</code>.</p>
                  </>
                )}

                {fields.payMethod === "paypal" && (
                  <>
                    <Field label="PayPal.me username" value={fields.payUsername || ""} onChange={(v) => setField("payUsername", v)} placeholder="yourname (without @)" />
                    <Field label="Amount (optional)" value={fields.payAmount || ""} onChange={(v) => setField("payAmount", v)} placeholder="25.00" />
                    <Field label="Currency" value={fields.payCurrency || "USD"} onChange={(v) => setField("payCurrency", v.toUpperCase())} placeholder="USD" />
                    <p className="text-xs text-gray-500">PayPal.me link. Scanner opens the payment page in browser/app.</p>
                  </>
                )}

                {fields.payMethod === "vietqr" && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-1 block">Bank</label>
                      <select
                        value={fields.payBank || ""}
                        onChange={(e) => setField("payBank", e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        <option value="">— Choose bank —</option>
                        {VIET_BANKS.map((b) => (
                          <option key={b.bin} value={b.bin}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <Field label="Account number" value={fields.payAccount || ""} onChange={(v) => setField("payAccount", v)} placeholder="1234567890" />
                    <Field label="Amount in VND (optional)" value={fields.payAmount || ""} onChange={(v) => setField("payAmount", v)} placeholder="50000" />
                    <Field label="Reference message (optional)" value={fields.payMessage || ""} onChange={(v) => setField("payMessage", v)} placeholder="Order #123" />
                    <p className="text-xs text-gray-500">NAPAS 2.0 format (VietQR). Scannable by every Vietnamese banking app — Vietcombank, Techcombank, MB, etc.</p>
                  </>
                )}
              </>
            )}
          </Section>

          <Section title="Design">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Dot style</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {DOT_STYLES.map((s) => (
                  <Pill key={s.id} active={dotStyle === s.id} onClick={() => setDotStyle(s.id)}>{s.label}</Pill>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Eye frame</label>
                <div className="grid grid-cols-3 gap-2">
                  {EYE_FRAME_STYLES.map((s) => (
                    <Pill key={s.id} active={eyeFrameStyle === s.id} onClick={() => setEyeFrameStyle(s.id)}>{s.label}</Pill>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Eye ball</label>
                <div className="grid grid-cols-2 gap-2">
                  {EYE_BALL_STYLES.map((s) => (
                    <Pill key={s.id} active={eyeBallStyle === s.id} onClick={() => setEyeBallStyle(s.id)}>{s.label}</Pill>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Colors">
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Foreground" value={darkColor} onChange={setDarkColor} />
              <ColorField label="Background" value={lightColor} onChange={setLightColor} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useGradient}
                  onChange={(e) => setUseGradient(e.target.checked)}
                  className="accent-indigo-600"
                />
                Use gradient
              </label>
              <button onClick={resetColors} className="text-xs text-indigo-600 hover:underline">Reset</button>
            </div>
            {useGradient && (
              <div className="space-y-3 pt-1 border-t" style={{ borderColor: "var(--color-border)" }}>
                <ColorField label="Gradient end color" value={gradientColor} onChange={setGradientColor} />
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Gradient type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Pill active={gradientType === "linear"} onClick={() => setGradientType("linear")}>Linear</Pill>
                    <Pill active={gradientType === "radial"} onClick={() => setGradientType("radial")}>Radial</Pill>
                  </div>
                </div>
                {gradientType === "linear" && (
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Rotation: {gradientRotation}°</label>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      step={15}
                      value={gradientRotation}
                      onChange={(e) => setGradientRotation(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500">Keep strong contrast so scanners can read the pattern.</p>
          </Section>

          <Section title="Logo overlay">
            {logoSrc ? (
              <div className="flex items-center gap-3">
                <img src={logoSrc} alt="Logo preview" className="w-12 h-12 object-contain border rounded bg-white" style={{ borderColor: "var(--color-border)" }} />
                <button
                  onClick={() => setLogoSrc(null)}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  <X className="w-3.5 h-3.5" /> Remove logo
                </button>
              </div>
            ) : (
              <label className="inline-flex items-center gap-2 text-sm border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
                <Upload className="w-4 h-4" />
                <span>Upload logo</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            )}
            <p className="text-xs text-gray-500">
              Centered ~30% of QR size. Error correction is forced to High so the QR still scans.
            </p>
          </Section>

          <Section title="Frame">
            <div className="grid grid-cols-4 gap-2">
              {FRAME_STYLES.map((s) => (
                <Pill key={s.id} active={frameStyle === s.id} onClick={() => setFrameStyle(s.id)}>{s.label}</Pill>
              ))}
            </div>
            {frameStyle !== "none" && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {(frameStyle === "caption" || frameStyle === "scan-me") && (
                  <Field label="Caption text" value={frameText} onChange={setFrameText} placeholder="SCAN ME" />
                )}
                <ColorField label="Frame color" value={frameColor} onChange={setFrameColor} />
              </div>
            )}
          </Section>

          <Section title="Size + correction">
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
              <label className="text-sm font-semibold text-gray-900 mb-2 block">
                Error correction {logoSrc && <span className="text-xs font-normal text-amber-700">(forced High for logo)</span>}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(EC_LABEL) as ECLevel[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setEc(l)}
                    disabled={!!logoSrc}
                    className={`p-2 rounded-lg border text-xs font-medium transition ${
                      effectiveEc === l ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-white"
                    } ${logoSrc ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{ borderColor: effectiveEc === l ? undefined : "var(--color-border)" }}
                  >
                    <div className="font-mono font-bold">{l}</div>
                    <div className="text-xs text-gray-500">{EC_LABEL[l].split(" ")[1]}</div>
                  </button>
                ))}
              </div>
            </div>
          </Section>
        </div>

        <div>
          <div className="rounded-2xl border bg-white p-5 sticky top-20" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-sm font-semibold text-gray-900 mb-3">Preview</p>
            {error ? (
              <div className="aspect-square bg-red-50 border border-red-200 rounded-xl flex items-center justify-center p-4">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            ) : (
              <div
                className="bg-white p-4 rounded-xl border flex items-center justify-center"
                style={{ borderColor: "var(--color-border)" }}
              >
                {svgString ? (
                  <div
                    className="max-w-full"
                    style={{ width: "100%", maxWidth: 400 }}
                    dangerouslySetInnerHTML={{ __html: svgString }}
                  />
                ) : (
                  <div className="aspect-square w-full bg-gray-50 rounded animate-pulse" />
                )}
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

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
      {title && <label className="text-sm font-semibold text-gray-900 block">{title}</label>}
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg border text-xs font-medium transition ${
        active ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-white"
      }`}
      style={{ borderColor: active ? undefined : "var(--color-border)" }}
    >
      {children}
    </button>
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

function DateTimeField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-900 mb-1 block">{label}</label>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        style={{ borderColor: "var(--color-border)" }}
      />
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-700 mb-1 block">{label}</label>
      <div className="flex items-center gap-2 border rounded-lg px-2 py-1.5" style={{ borderColor: "var(--color-border)" }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 cursor-pointer rounded border-0 bg-transparent p-0"
          aria-label={`${label} color picker`}
        />
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          className="flex-1 font-mono text-xs bg-transparent focus:outline-none uppercase min-w-0"
        />
      </div>
    </div>
  );
}

function wrapFrame(
  qrSvg: string,
  opts: { style: FrameStyle; text: string; color: string; bg: string },
): string {
  const m = qrSvg.match(/viewBox="([\d.\-\s]+)"/);
  if (!m) return qrSvg;
  const parts = m[1].split(/\s+/).map(Number);
  if (parts.length < 4) return qrSvg;
  const [, , qrW, qrH] = parts;

  const inner = qrSvg
    .replace(/<\?xml[^?]*\?>/, "")
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")
    .trim();

  const pad = qrW * 0.06;
  const captionH = opts.style === "border" ? 0 : qrH * 0.16;
  const totalW = qrW + pad * 2;
  const totalH = qrH + pad * 2 + captionH;
  const qrX = pad;
  const qrY = pad;
  const borderRadius = qrW * 0.03;
  const borderWidth = Math.max(2, qrW * 0.008);

  const border = `<rect x="${borderWidth / 2}" y="${borderWidth / 2}" width="${totalW - borderWidth}" height="${qrH + pad * 2 - borderWidth}" rx="${borderRadius}" fill="none" stroke="${opts.color}" stroke-width="${borderWidth}"/>`;

  let captionShape = "";
  let captionText = "";
  if (opts.style === "caption" && captionH > 0) {
    captionShape = `<rect x="0" y="${qrH + pad * 2}" width="${totalW}" height="${captionH}" rx="${captionH * 0.2}" fill="${opts.color}"/>`;
    captionText = `<text x="${totalW / 2}" y="${qrH + pad * 2 + captionH * 0.66}" text-anchor="middle" fill="${opts.bg}" font-family="Arial, sans-serif" font-size="${captionH * 0.5}" font-weight="800" letter-spacing="2">${escapeXml(opts.text)}</text>`;
  } else if (opts.style === "scan-me" && captionH > 0) {
    const arrowH = captionH * 0.25;
    const arrowW = totalW * 0.08;
    const baseY = qrH + pad * 2 + arrowH;
    const tipX = totalW / 2;
    captionShape = `<path d="M 0 ${baseY} L ${tipX - arrowW} ${baseY} L ${tipX} ${baseY - arrowH} L ${tipX + arrowW} ${baseY} L ${totalW} ${baseY} L ${totalW} ${totalH} L 0 ${totalH} Z" fill="${opts.color}"/>`;
    captionText = `<text x="${totalW / 2}" y="${baseY + (captionH - arrowH) * 0.66}" text-anchor="middle" fill="${opts.bg}" font-family="Arial, sans-serif" font-size="${captionH * 0.42}" font-weight="800" letter-spacing="2">${escapeXml(opts.text)}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
<rect width="${totalW}" height="${totalH}" fill="${opts.bg}"/>
${border}
${captionShape}
${captionText}
<g transform="translate(${qrX} ${qrY})">${inner}</g>
</svg>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Blob read failed"));
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src;
  });
}

async function compositeFrameOnPng(
  basePng: string,
  qrSize: number,
  opts: { style: FrameStyle; text: string; color: string; bg: string },
): Promise<string> {
  const qrImg = await loadImage(basePng);
  const pad = qrSize * 0.06;
  const captionH = opts.style === "border" ? 0 : qrSize * 0.16;
  const totalW = qrSize + pad * 2;
  const totalH = qrSize + pad * 2 + captionH;
  const borderRadius = qrSize * 0.03;
  const borderWidth = Math.max(2, qrSize * 0.008);

  const canvas = document.createElement("canvas");
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // Background
  ctx.fillStyle = opts.bg;
  ctx.fillRect(0, 0, totalW, totalH);

  // Border around the QR region only (excludes caption strip)
  ctx.strokeStyle = opts.color;
  ctx.lineWidth = borderWidth;
  roundedRect(
    ctx,
    borderWidth / 2,
    borderWidth / 2,
    totalW - borderWidth,
    qrSize + pad * 2 - borderWidth,
    borderRadius,
  );
  ctx.stroke();

  // QR image
  ctx.drawImage(qrImg, pad, pad, qrSize, qrSize);

  // Caption shape + text
  if (opts.style === "caption" && captionH > 0) {
    const captionY = qrSize + pad * 2;
    ctx.fillStyle = opts.color;
    roundedRect(ctx, 0, captionY, totalW, captionH, captionH * 0.2);
    ctx.fill();
    drawCaptionText(ctx, opts, totalW, captionY + captionH * 0.66, captionH * 0.5);
  } else if (opts.style === "scan-me" && captionH > 0) {
    const arrowH = captionH * 0.25;
    const arrowW = totalW * 0.08;
    const baseY = qrSize + pad * 2 + arrowH;
    const tipX = totalW / 2;
    ctx.fillStyle = opts.color;
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(tipX - arrowW, baseY);
    ctx.lineTo(tipX, baseY - arrowH);
    ctx.lineTo(tipX + arrowW, baseY);
    ctx.lineTo(totalW, baseY);
    ctx.lineTo(totalW, totalH);
    ctx.lineTo(0, totalH);
    ctx.closePath();
    ctx.fill();
    drawCaptionText(ctx, opts, totalW, baseY + (captionH - arrowH) * 0.66, captionH * 0.42);
  }

  return canvas.toDataURL("image/png");
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCaptionText(
  ctx: CanvasRenderingContext2D,
  opts: { text: string; bg: string },
  totalW: number,
  baselineY: number,
  fontSize: number,
) {
  ctx.fillStyle = opts.bg;
  ctx.font = `800 ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(opts.text, totalW / 2, baselineY);
}
