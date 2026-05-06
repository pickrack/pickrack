/**
 * Calibre ebook-convert helper.
 * Spawns `ebook-convert input.<ext> output.<ext>` in a private temp dir.
 * Used for EPUB <-> PDF conversion. Calibre supports many other ebook formats
 * but pickrack only exposes EPUB and PDF for now.
 */

import { spawn } from "child_process";
import { writeFile, readFile, mkdtemp, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const CALIBRE_BIN = process.env.EBOOK_CONVERT_BIN || "ebook-convert";

export type CalibreFormat = "pdf" | "epub";

export type CalibreOptions = {
  timeoutMs?: number;
  /** Extra CLI args appended after input/output. e.g. ["--pdf-page-margin-left", "36"] */
  extraArgs?: string[];
};

export async function calibreConvert(
  inputBuf: Buffer,
  inputExt: string,
  targetFormat: CalibreFormat,
  options: CalibreOptions = {}
): Promise<Buffer> {
  const { timeoutMs = 120_000, extraArgs = [] } = options;
  const dir = await mkdtemp(join(tmpdir(), "pr-cal-"));
  const inExt = inputExt.replace(/^\./, "");
  const inputPath = join(dir, `input.${inExt}`);
  const outputPath = join(dir, `output.${targetFormat}`);

  try {
    await writeFile(inputPath, inputBuf);

    await new Promise<void>((resolve, reject) => {
      const args = [inputPath, outputPath, ...extraArgs];
      const proc = spawn(CALIBRE_BIN, args, { timeout: timeoutMs });
      let stderr = "";
      proc.stderr.on("data", (d) => { stderr += d.toString(); });
      proc.stdout.on("data", () => {}); // drain progress lines
      proc.on("error", reject);
      proc.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(stderr.slice(0, 200) || `ebook-convert exit ${code}`));
      });
    });

    return await readFile(outputPath);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
