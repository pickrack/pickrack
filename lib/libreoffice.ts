/**
 * LibreOffice headless conversion helper.
 * Spawns `libreoffice --headless --convert-to <format>` in a private temp dir
 * to avoid concurrent profile lock issues.
 */

import { spawn } from "child_process";
import { writeFile, readFile, mkdtemp, rm, readdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const LIBREOFFICE_BIN = process.env.LIBREOFFICE_BIN || "libreoffice";

export type LibreOfficeFormat = "pdf" | "docx" | "doc" | "odt" | "xlsx" | "pptx";

export type LibreOfficeOptions = {
  timeoutMs?: number;
  /** Force input filter (e.g. "writer_pdf_import" for PDF→DOCX text extraction). */
  infilter?: string;
};

/**
 * Convert input buffer to target format via LibreOffice headless.
 * Each invocation gets its own user profile dir to allow parallel calls.
 */
export async function libreofficeConvert(
  inputBuf: Buffer,
  inputExt: string,
  targetFormat: LibreOfficeFormat,
  options: LibreOfficeOptions = {}
): Promise<Buffer> {
  const { timeoutMs = 80_000, infilter } = options;
  const dir = await mkdtemp(join(tmpdir(), "pr-lo-"));
  const profileDir = join(dir, "profile");
  const inputPath = join(dir, `input.${inputExt.replace(/^\./, "")}`);

  try {
    await writeFile(inputPath, inputBuf);

    await new Promise<void>((resolve, reject) => {
      const args = [
        `-env:UserInstallation=file://${profileDir}`,
        "--headless",
        "--norestore",
        "--nologo",
        "--nofirststartwizard",
      ];
      if (infilter) {
        args.push(`--infilter=${infilter}`);
      }
      args.push("--convert-to", targetFormat, "--outdir", dir, inputPath);
      const proc = spawn(LIBREOFFICE_BIN, args, { timeout: timeoutMs });
      let stderr = "";
      proc.stderr.on("data", (d) => { stderr += d.toString(); });
      proc.on("error", reject);
      proc.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(stderr.slice(0, 200) || `libreoffice exit ${code}`));
      });
    });

    // LibreOffice writes output as <basename>.<targetFormat> in --outdir
    const files = await readdir(dir);
    const outputFile = files.find((f) => f.endsWith(`.${targetFormat}`) && f.startsWith("input."));
    if (!outputFile) {
      throw new Error("LibreOffice produced no output file (conversion may have failed silently).");
    }
    return await readFile(join(dir, outputFile));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
