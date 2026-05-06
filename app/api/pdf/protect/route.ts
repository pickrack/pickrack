/**
 * POST /api/pdf/protect
 * FormData: { file: File, password: string }
 *
 * Adds password protection to a PDF using qpdf with AES-256.
 * Same password used for user (open) and owner (modify) — simpler UX for free tool.
 */

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFile, readFile, mkdtemp, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { checkRateLimit } from "@/lib/rate-limit";
import { isPdf, INVALID_PDF_ERROR, qpdfIsEncrypted } from "@/lib/file-validation";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_SIZE = 100 * 1024 * 1024;

async function qpdfEncrypt(inputBuf: Buffer, password: string): Promise<Buffer> {
  const dir = await mkdtemp(join(tmpdir(), "pr-protect-"));
  const inputPath = join(dir, "in.pdf");
  const outputPath = join(dir, "out.pdf");
  try {
    await writeFile(inputPath, inputBuf);
    await new Promise<void>((resolve, reject) => {
      const proc = spawn(
        "qpdf",
        ["--encrypt", password, password, "256", "--", inputPath, outputPath],
        { timeout: 50000 }
      );
      let stderr = "";
      proc.stderr.on("data", (d) => { stderr += d.toString(); });
      proc.on("error", reject);
      proc.on("close", (code) => {
        if (code === 0 || code === 3) resolve();
        else reject(new Error(stderr.slice(0, 200) || `qpdf exit ${code}`));
      });
    });
    return await readFile(outputPath);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "pdf-protect", 10, 60_000);
  if (limited) return limited;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const password = formData.get("password");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (typeof password !== "string" || password.length === 0) {
      return NextResponse.json({ error: "Password required." }, { status: 400 });
    }
    if (password.length < 4) {
      return NextResponse.json({ error: "Password must be at least 4 characters." }, { status: 400 });
    }
    if (password.length > 256) {
      return NextResponse.json({ error: "Password too long." }, { status: 400 });
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
        { error: "This PDF is already encrypted. Unlock it first if you want to change the password." },
        { status: 400 }
      );
    }

    const outputBuf = await qpdfEncrypt(inputBuf, password);

    return new NextResponse(new Uint8Array(outputBuf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="protected.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[pdf-protect] Error:", msg);
    return NextResponse.json(
      { error: `Protection failed: ${msg.slice(0, 150)}` },
      { status: 500 }
    );
  }
}
