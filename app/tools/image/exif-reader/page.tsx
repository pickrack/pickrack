"use client";

import { useState } from "react";
import ExifReader from "exifreader";
import { Tag, Upload, Download, MapPin, Camera, Calendar, Copy, Check, ShieldOff } from "lucide-react";

type ExifGroup = { name: string; entries: { key: string; value: string }[] };

function formatTagValue(tag: { description?: unknown; value?: unknown }): string {
  if (tag.description !== undefined && tag.description !== null) {
    return String(tag.description);
  }
  if (tag.value !== undefined && tag.value !== null) {
    if (Array.isArray(tag.value)) return tag.value.join(", ");
    return String(tag.value);
  }
  return "";
}

function groupExif(tags: Record<string, unknown>): ExifGroup[] {
  const groups: Record<string, { key: string; value: string }[]> = {
    "Camera": [],
    "Capture settings": [],
    "Date / Time": [],
    "Location (GPS)": [],
    "File info": [],
    "Other": [],
  };

  const cameraKeys = new Set(["Make", "Model", "Software", "LensMake", "LensModel", "BodySerialNumber"]);
  const captureKeys = new Set(["ExposureTime", "FNumber", "ISOSpeedRatings", "FocalLength", "FocalLengthIn35mmFormat", "Flash", "WhiteBalance", "ExposureMode", "MeteringMode", "ExposureProgram"]);
  const dateKeys = new Set(["DateTime", "DateTimeOriginal", "DateTimeDigitized", "OffsetTime", "OffsetTimeOriginal"]);
  const gpsKeys = new Set(["GPSLatitude", "GPSLongitude", "GPSLatitudeRef", "GPSLongitudeRef", "GPSAltitude", "GPSDateStamp", "GPSTimeStamp", "GPSMapDatum"]);
  const fileKeys = new Set(["FileType", "MIMEType", "ImageWidth", "ImageHeight", "ImageDescription", "Orientation", "ColorSpace"]);

  for (const [key, t] of Object.entries(tags)) {
    if (typeof t !== "object" || t === null) continue;
    const value = formatTagValue(t as { description?: unknown; value?: unknown });
    if (!value) continue;
    if (cameraKeys.has(key)) groups["Camera"].push({ key, value });
    else if (captureKeys.has(key)) groups["Capture settings"].push({ key, value });
    else if (dateKeys.has(key)) groups["Date / Time"].push({ key, value });
    else if (gpsKeys.has(key)) groups["Location (GPS)"].push({ key, value });
    else if (fileKeys.has(key)) groups["File info"].push({ key, value });
    else groups["Other"].push({ key, value });
  }

  return Object.entries(groups)
    .filter(([, entries]) => entries.length > 0)
    .map(([name, entries]) => ({ name, entries }));
}

// Strip metadata by re-encoding image via canvas (canvas writes no EXIF)
async function stripMetadata(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("canvas ctx unavailable")); return; }
      ctx.drawImage(img, 0, 0);
      // Use original mime type when possible
      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("toBlob failed")), mimeType, 0.95);
    };
    img.onerror = () => reject(new Error("image load failed"));
    img.src = URL.createObjectURL(file);
  });
}

export default function ExifReaderPage() {
  const [groups, setGroups] = useState<ExifGroup[] | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [strippedSize, setStrippedSize] = useState(0);
  const [strippedUrl, setStrippedUrl] = useState<string | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [working, setWorking] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    setGroups(null);
    setStrippedUrl(null);
    setGpsCoords(null);
    setFilename(file.name);
    setFileObj(file);
    setOriginalSize(file.size);

    try {
      const buffer = await file.arrayBuffer();
      const tags = ExifReader.load(buffer);
      const grouped = groupExif(tags as Record<string, unknown>);
      setGroups(grouped);

      // Extract GPS coordinates if present
      const latTag = tags.GPSLatitude as { description?: number } | undefined;
      const lngTag = tags.GPSLongitude as { description?: number } | undefined;
      if (latTag?.description !== undefined && lngTag?.description !== undefined) {
        setGpsCoords({ lat: Number(latTag.description), lng: Number(lngTag.description) });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read EXIF data");
    }
  };

  const stripAndDownload = async () => {
    if (!fileObj) return;
    setWorking(true);
    try {
      const blob = await stripMetadata(fileObj);
      setStrippedSize(blob.size);
      const url = URL.createObjectURL(blob);
      setStrippedUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Strip failed");
    } finally {
      setWorking(false);
    }
  };

  const download = () => {
    if (!strippedUrl) return;
    const a = document.createElement("a");
    a.href = strippedUrl;
    const base = filename.replace(/\.[^.]+$/, "");
    const ext = fileObj?.type === "image/png" ? "png" : "jpg";
    a.download = `${base || "image"}-stripped.${ext}`;
    a.click();
  };

  const copyAll = async () => {
    if (!groups) return;
    const text = groups.map((g) => `## ${g.name}\n${g.entries.map((e) => `${e.key}: ${e.value}`).join("\n")}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2 justify-center">
          <Tag className="w-7 h-7 text-indigo-600" /> EXIF Reader &amp; Stripper
        </h1>
        <p className="mt-3 text-gray-600">
          Read camera metadata + GPS from photos. Optionally strip metadata before sharing (privacy). Browser-side.
        </p>
      </div>

      {!fileObj ? (
        <label
          className="block border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 transition"
          style={{ borderColor: "var(--color-border)" }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        >
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="font-semibold text-gray-900">Drop or click to upload photo</p>
          <p className="text-xs text-gray-500 mt-1">JPG / HEIC / PNG / TIFF — most camera + smartphone formats. Stays in your browser.</p>
        </label>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
            <div>
              <p className="text-sm font-semibold text-gray-900">{filename}</p>
              <p className="text-xs text-gray-500">{(originalSize / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={() => { setFileObj(null); setGroups(null); setStrippedUrl(null); setGpsCoords(null); }} className="text-xs text-red-600 hover:text-red-700">
              Try another image
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          {gpsCoords && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4" style={{ borderColor: "rgb(253 230 138)" }}>
              <p className="text-sm font-semibold text-amber-900 inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> GPS location embedded
              </p>
              <p className="text-xs text-amber-800 mt-1 font-mono">
                {gpsCoords.lat.toFixed(6)}, {gpsCoords.lng.toFixed(6)}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${gpsCoords.lat},${gpsCoords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-700 underline mt-2"
              >
                Open in Google Maps →
              </a>
              <p className="text-xs text-amber-700 mt-2">
                ⚠ This location ships with the photo wherever you upload it. Use &quot;Strip metadata&quot; below before posting publicly.
              </p>
            </div>
          )}

          {groups && (
            <div className="grid sm:grid-cols-2 gap-4">
              {groups.map((g) => (
                <div key={g.name} className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
                  <h2 className="text-sm font-semibold text-gray-900 mb-3 inline-flex items-center gap-1.5">
                    {g.name === "Camera" && <Camera className="w-4 h-4 text-gray-400" />}
                    {g.name === "Date / Time" && <Calendar className="w-4 h-4 text-gray-400" />}
                    {g.name === "Location (GPS)" && <MapPin className="w-4 h-4 text-amber-500" />}
                    {g.name}
                  </h2>
                  <dl className="space-y-1.5 text-xs">
                    {g.entries.map((e) => (
                      <div key={e.key} className="flex items-baseline gap-2">
                        <dt className="text-gray-500 w-28 shrink-0 font-mono text-[10px]">{e.key}</dt>
                        <dd className="text-gray-900 font-mono break-all flex-1">{e.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}

          {groups && groups.length === 0 && (
            <p className="rounded-lg border bg-white p-5 text-sm text-gray-600 text-center" style={{ borderColor: "var(--color-border)" }}>
              No EXIF metadata found. This image is already privacy-safe.
            </p>
          )}

          {groups && groups.length > 0 && (
            <div className="rounded-2xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-sm font-semibold text-gray-900 inline-flex items-center gap-1.5">
                <ShieldOff className="w-4 h-4 text-indigo-600" /> Strip metadata
              </p>
              <p className="text-xs text-gray-600">
                Re-encode the image without any metadata (EXIF / GPS / camera info removed). Pixel data is preserved.
              </p>
              {!strippedUrl ? (
                <button onClick={stripAndDownload} disabled={working} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
                  {working ? "Stripping..." : "Strip metadata + download clean copy"}
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    Original: {(originalSize / 1024).toFixed(1)} KB · Stripped: {(strippedSize / 1024).toFixed(1)} KB
                    <span className="text-emerald-600 font-semibold ml-1">
                      ({originalSize > strippedSize ? `−${(((originalSize - strippedSize) / originalSize) * 100).toFixed(1)}%` : `+${(((strippedSize - originalSize) / originalSize) * 100).toFixed(1)}%`})
                    </span>
                  </div>
                  <button onClick={download} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-sm font-semibold">
                    <Download className="w-4 h-4" /> Download stripped image
                  </button>
                </div>
              )}
              <button onClick={copyAll} className="inline-flex items-center gap-1 text-xs text-indigo-700">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy all metadata as text"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
