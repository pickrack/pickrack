/**
 * Magic bytes validation — check actual file content, not just extension.
 * Defends against attacker uploading a non-PDF disguised as .pdf to exploit a parser CVE.
 */

import { spawn } from "child_process";
import { writeFile, mkdtemp, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

export const INVALID_PDF_ERROR = "File is not a valid PDF.";
export const CORRUPTED_PDF_ERROR = "PDF appears corrupted. Try re-saving from Adobe Reader and upload again.";
export const ENCRYPTED_PDF_ERROR_GENERIC = "This PDF is password-protected.";

/** PDF magic: starts with %PDF- (5 bytes) somewhere in the first 1024 bytes (some PDFs have small junk prefix). */
export function isPdf(b: Uint8Array | Buffer): boolean {
  if (b.length < 5) return false;
  const head = Buffer.from(b.slice(0, Math.min(b.length, 1024))).toString("latin1");
  return head.includes("%PDF-");
}

/** qpdf integrity check. Exit 0 = ok, 2 = warnings (still usable), >=3 = errors. */
export async function qpdfCheck(buf: Buffer): Promise<{ ok: boolean }> {
  const dir = await mkdtemp(join(tmpdir(), "pr-qpdf-check-"));
  const path = join(dir, "in.pdf");
  try {
    await writeFile(path, buf);
    return await new Promise((resolve) => {
      const proc = spawn("qpdf", ["--check", path], { timeout: 10000 });
      proc.on("close", (code) => {
        if (code === 0 || code === 2) resolve({ ok: true });
        else resolve({ ok: false });
      });
      proc.on("error", () => resolve({ ok: true })); // qpdf missing → skip
    });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** ZIP magic: PK\x03\x04 (DOCX, PPTX, ODT, ODP, XLSX, EPUB are all ZIP-based). */
export function isZip(b: Uint8Array | Buffer): boolean {
  if (b.length < 4) return false;
  return b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;
}

/** PPTX/PPT detector: PPTX = ZIP magic; PPT = OLE2 (D0 CF 11 E0). */
export function isPptxOrPpt(b: Uint8Array | Buffer, ext: string): boolean {
  if (b.length < 4) return false;
  if (ext === "pptx" || ext === "odp") return isZip(b);
  if (ext === "ppt") return b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0;
  return false;
}

/**
 * EPUB detector: ZIP magic + "mimetype" entry containing "application/epub+zip".
 * The mimetype file must be the first entry, uncompressed, per EPUB spec.
 * Cheap check: bytes 30..50 should contain "mimetypeapplication/epub+zip".
 */
export function isEpub(b: Uint8Array | Buffer): boolean {
  if (!isZip(b)) return false;
  if (b.length < 60) return false;
  const head = Buffer.from(b.slice(0, Math.min(b.length, 200))).toString("latin1");
  return head.includes("mimetypeapplication/epub+zip");
}

/** qpdf encryption check. Exit 0 = encrypted, 2 = not encrypted. */
export async function qpdfIsEncrypted(buf: Buffer): Promise<boolean> {
  const dir = await mkdtemp(join(tmpdir(), "pr-qpdf-enc-"));
  const path = join(dir, "in.pdf");
  try {
    await writeFile(path, buf);
    return await new Promise((resolve) => {
      const proc = spawn("qpdf", ["--is-encrypted", path], { timeout: 5000 });
      proc.on("close", (code) => resolve(code === 0));
      proc.on("error", () => resolve(false));
    });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
