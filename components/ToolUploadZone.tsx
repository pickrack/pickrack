"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

export interface UploadedFile {
  file: File;
  id: string;
}

interface Props {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFilesSelected: (files: UploadedFile[]) => void;
  label?: string;
  sublabel?: string;
}

export default function ToolUploadZone({
  accept = ".pdf",
  multiple = true,
  maxSizeMB = 100,
  onFilesSelected,
  label = "Click to choose file or drag-drop here",
  sublabel,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const ext = accept.toUpperCase().replace(".", "").split(",")[0];
  const sub = sublabel ?? (multiple
    ? `${ext} files up to ${maxSizeMB}MB — multiple files supported`
    : `${ext} file up to ${maxSizeMB}MB`);

  const processFiles = useCallback(
    (rawFiles: FileList | File[]) => {
      setError(null);
      const arr = Array.from(rawFiles);
      const maxBytes = maxSizeMB * 1024 * 1024;
      const oversized = arr.find((f) => f.size > maxBytes);
      if (oversized) {
        setError(`File "${oversized.name}" exceeds ${maxSizeMB}MB limit.`);
        return;
      }
      const uploaded: UploadedFile[] = arr.map((f) => ({
        file: f,
        id: `${f.name}-${Date.now()}-${Math.random()}`,
      }));
      const next = multiple ? [...files, ...uploaded] : uploaded;
      setFiles(next);
      onFilesSelected(next);
    },
    [files, maxSizeMB, multiple, onFilesSelected]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const removeFile = (id: string) => {
    const next = files.filter((f) => f.id !== id);
    setFiles(next);
    onFilesSelected(next);
  };

  return (
    <div className="w-full">
      <label
        className={`relative flex flex-col items-center justify-center w-full min-h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-gray-50 hover:border-emerald-500 ${
          isDragging ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
          <div className={`p-4 rounded-full transition-colors ${isDragging ? "bg-emerald-100" : "bg-white border border-gray-200"}`}>
            <Upload className={`w-8 h-8 ${isDragging ? "text-emerald-600" : "text-gray-400"}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-500 mt-1">{sub}</p>
          </div>
          <span className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-full font-medium transition-colors">
            Choose file
          </span>
        </div>
      </label>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between rounded-xl px-4 py-3 border bg-white"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-gray-900">{f.file.name}</p>
                  <p className="text-xs text-gray-500">{(f.file.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.preventDefault(); removeFile(f.id); }}
                className="ml-3 p-1 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
