/**
 * POST /api/pdf/pptx-to-pdf
 * FormData: { file: File (.pptx, .ppt, .odp) }
 *
 * Converts presentation to PDF using LibreOffice headless (Impress).
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { libreofficeConvert } from "@/lib/libreoffice";
import { isPptxOrPpt } from "@/lib/file-validation";

export const runtime = "nodejs";
export const maxDuration = 90;

const MAX_SIZE = 50 * 1024 * 1024;

const ALLOWED_EXT: Record<string, "pptx" | "ppt" | "odp"> = {
  pptx: "pptx",
  ppt: "ppt",
  odp: "odp",
};

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "pptx-to-pdf", 6, 60_000);
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
        { error: "Unsupported format. Use .pptx, .ppt, or .odp." },
        { status: 400 }
      );
    }

    const inputBuf = Buffer.from(await file.arrayBuffer());
    if (!isPptxOrPpt(inputBuf, inputExt)) {
      return NextResponse.json(
        { error: "File does not match its extension or is corrupted." },
        { status: 400 }
      );
    }

    const outputBuf = await libreofficeConvert(inputBuf, inputExt, "pdf");

    const outputName = file.name.replace(/\.(pptx|ppt|odp)$/i, ".pdf") || "converted.pdf";
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
    console.error("[pptx-to-pdf] Error:", msg);
    return NextResponse.json(
      { error: `Conversion failed: ${msg.slice(0, 150)}` },
      { status: 500 }
    );
  }
}
