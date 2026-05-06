"use client";

import { useState, useCallback } from "react";
import { Loader2, Download, Unlock, AlertTriangle } from "lucide-react";
import ToolUploadZone, { type UploadedFile } from "@/components/ToolUploadZone";

export default function UnlockPDFPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((uploaded: UploadedFile[]) => {
    setFiles(uploaded);
    setDownloadUrl(null);
    setError(null);
  }, []);

  const unlock = async () => {
    if (files.length === 0) {
      setError("Please select a PDF.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }
    setProcessing(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const fd = new FormData();
      fd.append("file", files[0].file);
      fd.append("password", password);
      const res = await fetch("/api/pdf/unlock/", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }
      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unlock failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Unlock PDF</h1>
        <p className="mt-3 text-gray-600">
          Remove password protection from a PDF. You must know the password.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3 text-sm text-amber-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div>
          <p className="font-medium">Server-side processing</p>
          <p className="mt-1 text-amber-800">
            This tool uses qpdf on our server to decrypt the file. The file is sent over HTTPS, processed, and deleted immediately. We never store your PDF or password.
          </p>
        </div>
      </div>

      <ToolUploadZone
        accept=".pdf"
        multiple={false}
        maxSizeMB={100}
        onFilesSelected={handleFilesSelected}
        label="Drop a password-protected PDF here"
        sublabel="Single PDF up to 100MB"
      />

      {files.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
          <label className="block text-sm font-semibold text-gray-900 mb-2">PDF password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter the password you used to protect this PDF"
            className="w-full rounded-xl border px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
            style={{ borderColor: "var(--color-border)" }}
            autoComplete="off"
          />
          <p className="text-xs text-gray-500 mt-2">
            Password is sent to the server only to decrypt this file. Not logged, not stored.
          </p>

          <button
            onClick={unlock}
            disabled={processing || !password}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition disabled:opacity-50"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Unlocking…</>
            ) : (
              <><Unlock className="w-4 h-4" /> Remove password</>
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
          download="unlocked.pdf"
          className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 transition"
        >
          <Download className="w-4 h-4" /> Download unlocked.pdf
        </a>
      )}

    </div>
  );
}
