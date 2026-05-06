/**
 * POST /api/pdf/word-to-pdf
 * FormData: { file: File (.docx, .doc, .odt) }
 *
 * Converts Word document to PDF using LibreOffice headless.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { libreofficeConvert } from "@/lib/libreoffice";

export const runtime = "nodejs";
export const maxDuration = 90;

const MAX_SIZE = 30 * 1024 * 1024;

const ALLOWED_EXT: Record<string, "docx" | "doc" | "odt"> = {
  docx: "docx",
  doc: "doc",
  odt: "odt",
};

/** DOCX = ZIP magic (PK\x03\x04). DOC = OLE2 magic (D0 CF 11 E0). ODT = ZIP. */
function isAcceptedWordDoc(buf: Buffer, ext: string): boolean {
  if (buf.length < 4) return false;
  if (ext === "docx" || ext === "odt") {
    return buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04;
  }
  if (ext === "doc") {
    return buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0;
  }
  return false;
}

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "word-to-pdf", 8, 60_000);
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
    const inputExt = ALLOWED_EXT[ext];
    if (!inputExt) {
      return NextResponse.json(
        { error: "Unsupported format. Use .docx, .doc, or .odt." },
        { status: 400 }
      );
    }

    const inputBuf = Buffer.from(await file.arrayBuffer());
    if (!isAcceptedWordDoc(inputBuf, inputExt)) {
      return NextResponse.json(
        { error: "File does not match its extension or is corrupted." },
        { status: 400 }
      );
    }

    const outputBuf = await libreofficeConvert(inputBuf, inputExt, "pdf");

    const outputName = file.name.replace(/\.(docx|doc|odt)$/i, ".pdf") || "converted.pdf";
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
    console.error("[word-to-pdf] Error:", msg);
    return NextResponse.json(
      { error: `Conversion failed: ${msg.slice(0, 150)}` },
      { status: 500 }
    );
  }
}
