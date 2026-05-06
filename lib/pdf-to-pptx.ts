/**
 * PDF → PPTX pipeline.
 *
 * 1. Extract each PDF page as a PNG via pdftoppm (Poppler).
 * 2. Build a PPTX with one slide per page; each slide contains the PNG fitted
 *    to the slide canvas. This is image-only (text not editable) — the same
 *    approach used by Smallpdf, ILovePDF, and most online PDF→PPTX tools.
 *    Editable text-extraction PDF→PPTX is unreliable across LibreOffice and
 *    most commercial tools, so this honest approach is preferred.
 */

import { spawn } from "child_process";
import { writeFile, readFile, readdir, mkdtemp, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import pptxgen from "pptxgenjs";

const PDFTOPPM_BIN = process.env.PDFTOPPM_BIN || "pdftoppm";

const DEFAULT_DPI = 144;
/** Hard cap: prevents abuse via huge PDFs that would generate 1000+ slides. */
const MAX_PAGES = 200;

/** Standard PowerPoint widescreen 16:9 in inches. */
const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

export type PdfToPptxOptions = {
  dpi?: number;
  timeoutMs?: number;
};

export async function pdfToPptx(pdfBuf: Buffer, options: PdfToPptxOptions = {}): Promise<Buffer> {
  const { dpi = DEFAULT_DPI, timeoutMs = 120_000 } = options;
  const dir = await mkdtemp(join(tmpdir(), "pr-p2p-"));
  const inputPath = join(dir, "input.pdf");
  const pageRoot = join(dir, "page");

  try {
    await writeFile(inputPath, pdfBuf);

    // Stage 1: PDF → PNG per page
    await new Promise<void>((resolve, reject) => {
      const proc = spawn(
        PDFTOPPM_BIN,
        ["-r", String(dpi), "-png", inputPath, pageRoot],
        { timeout: timeoutMs }
      );
      let stderr = "";
      proc.stderr.on("data", (d) => { stderr += d.toString(); });
      proc.on("error", reject);
      proc.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(stderr.slice(0, 200) || `pdftoppm exit ${code}`));
      });
    });

    const allFiles = await readdir(dir);
    const pngFiles = allFiles
      .filter((f) => f.startsWith("page-") && f.endsWith(".png"))
      .sort((a, b) => {
        // page-1.png, page-10.png — natural numeric sort
        const ai = parseInt(a.match(/page-(\d+)\.png/)?.[1] ?? "0", 10);
        const bi = parseInt(b.match(/page-(\d+)\.png/)?.[1] ?? "0", 10);
        return ai - bi;
      });

    if (pngFiles.length === 0) {
      throw new Error("pdftoppm produced no pages.");
    }
    if (pngFiles.length > MAX_PAGES) {
      throw new Error(`PDF has ${pngFiles.length} pages — max ${MAX_PAGES} for PPTX conversion.`);
    }

    // Stage 2: Build PPTX
    const pres = new pptxgen();
    pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches (16:9)
    pres.title = "Converted from PDF";

    for (const fname of pngFiles) {
      const pngPath = join(dir, fname);
      const pngBuf = await readFile(pngPath);
      const dataUrl = `data:image/png;base64,${pngBuf.toString("base64")}`;
      const slide = pres.addSlide();
      slide.background = { color: "FFFFFF" };
      slide.addImage({
        data: dataUrl,
        x: 0,
        y: 0,
        w: SLIDE_W,
        h: SLIDE_H,
        sizing: { type: "contain", w: SLIDE_W, h: SLIDE_H },
      });
    }

    const out = await pres.write({ outputType: "nodebuffer" });
    if (!Buffer.isBuffer(out)) {
      throw new Error("pptxgenjs returned unexpected output type.");
    }
    return out;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
