/**
 * POST /api/pdf/epub-to-pdf
 * FormData: { file: File (.epub) }
 *
 * Converts EPUB ebook to PDF using Calibre ebook-convert.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { calibreConvert } from "@/lib/calibre";
import { isEpub } from "@/lib/file-validation";

export const runtime = "nodejs";
export const maxDuration = 150;

const MAX_SIZE = 50 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "epub-to-pdf", 6, 60_000);
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

    const ext = file.name.toLowerCase().split(".").pop() || "";
    if (ext !== "epub") {
      return NextResponse.json({ error: "Only .epub files supported." }, { status: 400 });
    }

    const inputBuf = Buffer.from(await file.arrayBuffer());
    if (!isEpub(inputBuf)) {
      return NextResponse.json(
        { error: "File is not a valid EPUB." },
        { status: 400 }
      );
    }

    const outputBuf = await calibreConvert(inputBuf, "epub", "pdf");

    const outputName = file.name.replace(/\.epub$/i, ".pdf") || "converted.pdf";
    return new NextResponse(new Uint8Array(outputBuf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${outputName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[epub-to-pdf] Error:", msg);
    return NextResponse.json(
      { error: `Conversion failed: ${msg.slice(0, 150)}` },
      { status: 500 }
    );
  }
}
