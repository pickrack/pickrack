"use client";

import { useState, useCallback } from "react";
import { Loader2, Download, Lock, AlertTriangle } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

export default function ProtectPDFPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setDownloadUrl(null);
    setError(null);
  }, []);

  const protectPdf = async () => {
    if (files.length === 0) {
      setError("Please select a PDF.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setProcessing(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const fd = new FormData();
      fd.append("file", files[0].file);
      fd.append("password", password);
      const res = await fetch("/api/pdf/protect/", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }
      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Protection failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Protect PDF</h1>
        <p className="mt-3 text-gray-600">
          Add a password to a PDF. Anyone trying to open the file will need to enter it first.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3 text-sm text-amber-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div>
          <p className="font-medium">Server-side processing</p>
          <p className="mt-1 text-amber-800">
            This tool uses qpdf with AES-256 encryption. Your file and password are processed on our server and deleted immediately after the response. Nothing is stored or logged.
          </p>
        </div>
      </div>

      <ToolUploadZone
        accept=".pdf"
        multiple={false}
        maxSizeMB={100}
        onFilesSelected={handleFilesSelected}
        label="Drop a PDF here or click to choose"
        sublabel="Single PDF up to 100MB. Must not already be encrypted."
      />

      {files.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-white p-5 space-y-4" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Password (min 4 chars)</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
              autoComplete="new-password"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="accent-emerald-600"
            />
            Show password
          </label>

          <button
            onClick={protectPdf}
            disabled={processing || !password || !confirm}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition disabled:opacity-50"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Encrypting…</>
            ) : (
              <><Lock className="w-4 h-4" /> Add password</>
            )}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {downloadUrl && (
        <a
          href={downloadUrl}
          download="protected.pdf"
          className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition"
        >
          <Download className="w-4 h-4" /> Download protected.pdf
        </a>
      )}

    </div>
  );
}
