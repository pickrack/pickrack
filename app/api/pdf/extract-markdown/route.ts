/**
 * POST /api/pdf/extract-markdown
 * FormData: { file: File (PDF) }
 *
 * Extracts text content from a PDF using pdftotext -layout.
 * Output preserves layout (columns, indentation) for AI/LLM input.
 */

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFile, mkdtemp, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  isPdf,
  qpdfCheck,
  qpdfIsEncrypted,
  INVALID_PDF_ERROR,
  CORRUPTED_PDF_ERROR,
} from "@/lib/file-validation";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_SIZE = 30 * 1024 * 1024;

async function pdftotext(pdfPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("pdftotext", ["-layout", pdfPath, "-"], { timeout: 50000 });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(stderr.slice(0, 200) || `pdftotext exit ${code}`));
    });
  });
}

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "pdf-extract-md", 15, 60_000);
  if (limited) return limited;

  let tmpDir: string | null = null;
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
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
        { error: "Encrypted PDFs cannot be extracted. Unlock first." },
        { status: 400 }
      );
    }
    const check = await qpdfCheck(inputBuf);
    if (!check.ok) {
      return NextResponse.json({ error: CORRUPTED_PDF_ERROR }, { status: 400 });
    }

    tmpDir = await mkdtemp(join(tmpdir(), "pr-extract-md-"));
    const inputPath = join(tmpDir, "input.pdf");
    await writeFile(inputPath, inputBuf);

    const content = await pdftotext(inputPath);

    if (content.trim().length < 10) {
      return NextResponse.json(
        {
          error:
            "No text could be extracted. This PDF may be a scanned image without a text layer. Try OCR first.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ content });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[pdf-extract-md] Error:", msg);
    return NextResponse.json(
      { error: `Extraction failed: ${msg.slice(0, 150)}` },
      { status: 500 }
    );
  } finally {
    if (tmpDir) await rm(tmpDir, { recursive: true, force: true });
  }
}
