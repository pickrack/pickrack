/**
 * POST /api/pdf/compress
 * FormData: { file: File, level: "low" | "medium" | "high" }
 *
 * Compress PDF using Ghostscript with PDFSETTINGS preset.
 * - low    → /printer  (300 dpi, modest reduction)
 * - medium → /ebook    (150 dpi, balanced)
 * - high   → /screen   (72 dpi, maximum compression)
 */

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFile, readFile, mkdtemp, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { checkRateLimit } from "@/lib/rate-limit";
import { isPdf, INVALID_PDF_ERROR, qpdfIsEncrypted } from "@/lib/file-validation";

export const runtime = "nodejs";
export const maxDuration = 90;

const MAX_SIZE = 100 * 1024 * 1024;

const PRESET_MAP: Record<string, string> = {
  low: "/printer",
  medium: "/ebook",
  high: "/screen",
};

async function ghostscriptCompress(inputBuf: Buffer, preset: string): Promise<Buffer> {
  const dir = await mkdtemp(join(tmpdir(), "pr-compress-"));
  const inputPath = join(dir, "in.pdf");
  const outputPath = join(dir, "out.pdf");
  try {
    await writeFile(inputPath, inputBuf);
    await new Promise<void>((resolve, reject) => {
      const proc = spawn(
        "gs",
        [
          "-sDEVICE=pdfwrite",
          "-dCompatibilityLevel=1.4",
          `-dPDFSETTINGS=${preset}`,
          "-dNOPAUSE",
          "-dQUIET",
          "-dBATCH",
          `-sOutputFile=${outputPath}`,
          inputPath,
        ],
        { timeout: 80000 }
      );
      let stderr = "";
      proc.stderr.on("data", (d) => { stderr += d.toString(); });
      proc.on("error", reject);
      proc.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(stderr.slice(0, 200) || `gs exit ${code}`));
      });
    });
    return await readFile(outputPath);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "pdf-compress", 8, 60_000);
  if (limited) return limited;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const level = formData.get("level");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    const preset = typeof level === "string" ? PRESET_MAP[level] : null;
    if (!preset) {
      return NextResponse.json(
        { error: "Invalid compression level. Choose low, medium, or high." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max ${MAX_SIZE / 1024 / 1024}MB.` },
        { status: 413 }
      );
    }

    const inputBuf = Buffer.from(await file.arrayBuffer());
    if (!isPdf(inputBuf)) {
      return NextResponse.json({ error: INVALID_PDF_ERROR }, { status: 400 });
    }
    if (await qpdfIsEncrypted(inputBuf)) {
      return NextResponse.json(
        { error: "Encrypted PDFs cannot be compressed. Unlock first." },
        { status: 400 }
      );
    }

    const outputBuf = await ghostscriptCompress(inputBuf, preset);

    return new NextResponse(new Uint8Array(outputBuf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="compressed.pdf"',
        "X-Original-Size": String(inputBuf.length),
        "X-Compressed-Size": String(outputBuf.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[pdf-compress] Error:", msg);
    return NextResponse.json(
      { error: `Compression failed: ${msg.slice(0, 150)}` },
      { status: 500 }
    );
  }
}
