/**
 * POST /api/pdf/pdf-to-pptx
 * FormData: { file: File (.pdf) }
 *
 * Converts PDF to PPTX (image-per-slide) using pdftoppm + pptxgenjs.
 * Each PDF page becomes a slide with the page rendered as a PNG.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { pdfToPptx } from "@/lib/pdf-to-pptx";
import {
  isPdf,
  qpdfIsEncrypted,
  qpdfCheck,
  INVALID_PDF_ERROR,
  CORRUPTED_PDF_ERROR,
} from "@/lib/file-validation";

export const runtime = "nodejs";
export const maxDuration = 150;

const MAX_SIZE = 30 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "pdf-to-pptx", 6, 60_000);
  if (limited) return limited;

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
        { error: "Encrypted PDFs cannot be converted. Unlock first." },
        { status: 400 }
      );
    }
    const check = await qpdfCheck(inputBuf);
    if (!check.ok) {
      return NextResponse.json({ error: CORRUPTED_PDF_ERROR }, { status: 400 });
    }

    const outputBuf = await pdfToPptx(inputBuf);

    const outputName = file.name.replace(/\.pdf$/i, ".pptx") || "converted.pptx";
    return new NextResponse(new Uint8Array(outputBuf), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${outputName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[pdf-to-pptx] Error:", msg);
    return NextResponse.json(
      { error: `Conversion failed: ${msg.slice(0, 150)}` },
      { status: 500 }
    );
  }
}
