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
    a: "Yes, every tool works on Chrome, Safari, Firefox, and Edge on mobile. Browser-side tools may be slower on phones for large files (>50MB) — desktop is faster for batch work.",
  },
];

export default function PDFHubPage() {
  return <CategoryHub categoryId="pdf" faq={FAQ} />;
}
