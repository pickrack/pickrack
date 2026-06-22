import type { Metadata } from "next";
import CategoryHub from "@/components/CategoryHub";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Free PDF Tools — Merge, Split, Compress, Convert, OCR",
  description:
    "Free online PDF tools. Merge, split, rotate, compress, convert to/from Word/Excel/PowerPoint/EPUB, password protect, extract text. No upload, no signup, no watermark.",
  alternates: { canonical: `${SITE_URL}/tools/pdf/` },
};

const FAQ = [
  {
    q: "Are PDF files actually safe to upload to online tools?",
    a: "Most aren't. In July 2025, over 3.5 million PDFs leaked from misconfigured cloud storage at PDF-handling SaaS providers. Pickrack mitigates this two ways: (1) browser-side tools (merge, split, rotate, watermark, jpg-to-pdf, pdf-to-jpg) never upload at all; (2) server-side tools (compress, password, convert) delete files immediately after response and don't log content.",
  },
  {
    q: "What's the difference between browser-side and server-side PDF tools?",
    a: "Browser-side: pdf-lib runs in your tab. File never uploads, processing is instant, works offline. Limited to operations pdf-lib supports (merge, split, rotate, watermark, simple conversions). Server-side: file uploads over HTTPS, gets processed by qpdf/Ghostscript/LibreOffice/Calibre, returned, then deleted. Used for compression, encryption, format conversion, OCR — operations browsers can't do efficiently.",
  },
  {
    q: "How do these compare to Smallpdf, ILovePDF, Adobe Acrobat?",
    a: "Smallpdf and ILovePDF are server-side with paid tiers ($9/mo+) and free tier limits (Smallpdf 2 task/day). Adobe Acrobat Pro is $19.99/mo (was $14.99 — they raised prices in 2025). Pickrack is free, no quota, no watermark, no signup — sustainable via display advertising and affiliate commissions on unrelated tools.",
  },
  {
    q: "What PDF formats and sizes are supported?",
    a: "All standard PDFs (1.0 through 2.0). Encrypted PDFs require unlock first. File size limits vary by tool: 30-100MB depending on operation. Most tools handle up to 200 pages.",
  },
  {
    q: "Can I do OCR on scanned PDFs?",
    a: "OCR (image PDF → searchable text PDF) is on the roadmap. For now, use Tesseract OCR locally or pdf-to-markdown then manually verify. ABBYY FineReader and Adobe Acrobat OCR are commercial alternatives if you need it today.",
  },
  {
    q: "Are these tools mobile-friendly?",
    a: "Yes, every tool works on Chrome, Safari, Firefox, and Edge on mobile. Browser-side tools may be slower on phones for large files (over 50MB) — desktop is faster for batch work.",
  },
];

const intro = (
  <>
    <h2>How Pickrack&apos;s PDF tools differ from Smallpdf, iLovePDF, and Adobe</h2>
    <p>
      Most online PDF tools are server-side: you upload your file, the site processes it on their hardware, and you download the result. That model has three costs you don&apos;t see at first — your file passes through someone else&apos;s server, you hit daily quotas (Smallpdf gives 2 free tasks per day, iLovePDF puts most things behind a Premium upsell), and you trust the privacy claim with no way to verify it. Adobe Acrobat Pro side-steps the upload concern but charges $19.99 per month. For most people, that math is poor for what is essentially a once-or-twice-a-month task.
    </p>
    <p>
      Pickrack splits its 17 PDF tools into <strong>two paths</strong> depending on what each operation actually requires. Seven tools — merge, split, rotate, watermark, JPG to PDF, PDF to JPG, and screenshot to PDF — run <em>entirely in your browser</em>. Your file is loaded into browser memory using <a href="https://github.com/Hopding/pdf-lib" target="_blank" rel="noopener noreferrer">pdf-lib</a> or <a href="https://github.com/mozilla/pdf.js" target="_blank" rel="noopener noreferrer">PDF.js</a>, processed in JavaScript, and downloaded back. The server never sees the file. You can confirm this by opening DevTools and watching the Network tab while you click the tool button — no upload requests fire.
    </p>
    <p>
      The remaining ten tools — compress, unlock, password-protect (AES-256), Word↔PDF, PPTX↔PDF, EPUB↔PDF, and PDF→Markdown — need a server because they shell out to native binaries that have no browser equivalent. Compression uses <strong>Ghostscript</strong>; unlock and AES-256 protection use <strong>qpdf</strong>; Word and PowerPoint conversion use <strong>LibreOffice headless</strong>; EPUB conversion uses <strong>Calibre&apos;s ebook-convert</strong>. For these, your file is written to a unique <code>/tmp</code> directory, processed, the output streamed back, and the temp directory deleted in a <code>finally</code> block — typically within seconds. No database, no logging of file contents, no leak.
    </p>
    <h2>When to use which Pickrack PDF tool</h2>
    <ul>
      <li><strong>Combining PDFs</strong> (e.g., bank statements into a year-end archive) — use <a href="/tools/pdf/merge-pdf/">Merge PDF</a>. Browser-side, drag-to-reorder, no quality loss.</li>
      <li><strong>Extracting specific pages</strong> — use <a href="/tools/pdf/split-pdf/">Split PDF</a> with notation like <code>1-3, 5, 7-10</code>.</li>
      <li><strong>Reducing file size for email</strong> — use <a href="/tools/pdf/compress-pdf/">Compress PDF</a>. Three quality presets; Medium typically gets you under the 25MB Gmail attachment limit.</li>
      <li><strong>Sharing a contract privately</strong> — use <a href="/tools/pdf/protect-pdf/">Protect PDF</a> for AES-256 password protection.</li>
      <li><strong>Converting a PDF to editable Word</strong> — use <a href="/tools/pdf/pdf-to-word/">PDF to Word</a>. Best results on PDFs with a real text layer; scanned PDFs need OCR first.</li>
      <li><strong>Feeding a long PDF to ChatGPT or Claude</strong> — use <a href="/tools/pdf/pdf-to-markdown/">PDF to Markdown</a>. LLMs understand Markdown structure natively, which gives sharper answers than chat-with-PDF.</li>
    </ul>
    <p>
      Every tool below is free with no daily limit, no signup, no watermark on output, and no upsell. The site is funded by display advertising on text-content pages (this hub, blog posts) and by affiliate commissions on unrelated paid tools we review. We have no premium tier and no plans for one. If you would rather self-host the entire suite, the source is on <a href="https://github.com/pickrack/pickrack" target="_blank" rel="noopener noreferrer">GitHub</a> under MIT license.
    </p>
  </>
);

export default function PDFHubPage() {
  return <CategoryHub categoryId="pdf" intro={intro} faq={FAQ} />;
}
