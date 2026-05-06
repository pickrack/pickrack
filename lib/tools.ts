import type { CategoryId } from "@/lib/categories";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: CategoryId;
  available: boolean;
  comingSoon?: boolean;
  iconColor: string;
};

export const TOOLS: Tool[] = [
  // ─────────── PDF (16) ───────────
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into a single document. Drag, reorder, merge.",
    category: "pdf",
    available: true,
    iconColor: "text-rose-600",
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate one or all pages of a PDF by 90°, 180°, or 270°.",
    category: "pdf",
    available: true,
    iconColor: "text-violet-600",
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Combine JPG, PNG, or WebP images into a single PDF in any order.",
    category: "pdf",
    available: true,
    iconColor: "text-amber-600",
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description: "Extract specific pages from a PDF using a page range like 1-3, 5, 7-10.",
    category: "pdf",
    available: true,
    iconColor: "text-blue-600",
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size — choose low/medium/high compression. Server-side via Ghostscript.",
    category: "pdf",
    available: true,
    iconColor: "text-emerald-600",
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Export each PDF page as a JPG image. ZIP download for multi-page files.",
    category: "pdf",
    available: true,
    iconColor: "text-pink-600",
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    description: "Add a text watermark across every page — diagonal, with adjustable opacity.",
    category: "pdf",
    available: true,
    iconColor: "text-yellow-600",
  },
  {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove password from a PDF (you must know the password).",
    category: "pdf",
    available: true,
    iconColor: "text-teal-600",
  },
  {
    slug: "protect-pdf",
    name: "Protect PDF",
    description: "Add a password to a PDF for read protection.",
    category: "pdf",
    available: true,
    iconColor: "text-indigo-600",
  },
  {
    slug: "pdf-to-markdown",
    name: "PDF to Markdown",
    description: "Extract PDF text with layout preserved — paste into ChatGPT, Claude, or Notion.",
    category: "pdf",
    available: true,
    iconColor: "text-emerald-600",
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert DOCX, DOC, or ODT to PDF using LibreOffice. Preserves formatting, fonts, images.",
    category: "pdf",
    available: true,
    iconColor: "text-blue-600",
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF to editable Word document (.docx). Best for text-based PDFs.",
    category: "pdf",
    available: true,
    iconColor: "text-blue-600",
  },
  {
    slug: "pptx-to-pdf",
    name: "PowerPoint to PDF",
    description: "Convert PPTX, PPT, or ODP presentations to PDF. LibreOffice engine, preserves layout, fonts, animations as static slides.",
    category: "pdf",
    available: true,
    iconColor: "text-orange-600",
  },
  {
    slug: "pdf-to-pptx",
    name: "PDF to PowerPoint",
    description: "Convert PDF to PPTX with each page as a slide image. Preserves layout exactly. Best when editing isn't needed.",
    category: "pdf",
    available: true,
    iconColor: "text-orange-600",
  },
  {
    slug: "epub-to-pdf",
    name: "EPUB to PDF",
    description: "Convert EPUB ebooks to PDF for printing or PDF readers. Server-side Calibre engine with table of contents preserved.",
    category: "pdf",
    available: true,
    iconColor: "text-purple-600",
  },
  {
    slug: "pdf-to-epub",
    name: "PDF to EPUB",
    description: "Convert PDF to EPUB ebook for Kindle, Kobo, Apple Books. Server-side Calibre engine. Best for text-based PDFs.",
    category: "pdf",
    available: true,
    iconColor: "text-purple-600",
  },

  // ─────────── Image (5) ───────────
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize JPG, PNG, WebP images to any dimensions. Browser-side, no upload, no quality loss for downscaling.",
    category: "image",
    available: true,
    iconColor: "text-amber-600",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Compress JPG, PNG, WebP images with adjustable quality. Browser-side, no upload, real-time preview.",
    category: "image",
    available: true,
    iconColor: "text-amber-600",
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    description: "Convert images between PNG, JPG, WebP, AVIF formats. Batch support, browser-side. No upload.",
    category: "image",
    available: true,
    iconColor: "text-amber-600",
  },
  {
    slug: "heic-to-jpg",
    name: "HEIC to JPG",
    description: "Convert iPhone HEIC photos to JPG or PNG. Browser-side, no upload — your photos stay on your device.",
    category: "image",
    available: true,
    iconColor: "text-amber-600",
  },
  {
    slug: "background-remover",
    name: "Background Remover",
    description: "Remove image background using AI in your browser. No upload, no signup, no daily limit. Powered by @imgly/background-removal.",
    category: "image",
    available: true,
    iconColor: "text-amber-600",
  },

  // ─────────── Developer (6) ───────────
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON. Detects errors with line numbers. Browser-side, your data never leaves your device.",
    category: "dev",
    available: true,
    iconColor: "text-blue-600",
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    description: "Encode and decode Base64 strings. Supports text and file modes. Browser-side, instant.",
    category: "dev",
    available: true,
    iconColor: "text-blue-600",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode JWT header and payload to inspect claims. Validates structure and expiry. Browser-side — tokens never leave your tab.",
    category: "dev",
    available: true,
    iconColor: "text-blue-600",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes. Text and file modes. Web Crypto API.",
    category: "dev",
    available: true,
    iconColor: "text-blue-600",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate cryptographic UUID v4 single or in bulk (1-1000). One-click copy. Browser crypto.randomUUID.",
    category: "dev",
    available: true,
    iconColor: "text-blue-600",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions live with match highlighting and capture groups. Supports JavaScript regex flags.",
    category: "dev",
    available: true,
    iconColor: "text-blue-600",
  },

  // ─────────── Text (4) ───────────
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences, paragraphs, and reading time. Live update as you type.",
    category: "text",
    available: true,
    iconColor: "text-emerald-600",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description: "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case.",
    category: "text",
    available: true,
    iconColor: "text-emerald-600",
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate Lorem Ipsum placeholder text — words, sentences, or paragraphs. Adjustable length.",
    category: "text",
    available: true,
    iconColor: "text-emerald-600",
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    description: "Convert any text to URL-friendly slug. Strips diacritics (Vietnamese đ, ư, ê) and special chars.",
    category: "text",
    available: true,
    iconColor: "text-emerald-600",
  },

  // ─────────── Calculators (3) ───────────
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate cryptographically strong passwords. Length, symbols, numbers, exclude similar — all configurable.",
    category: "calc",
    available: true,
    iconColor: "text-indigo-600",
  },
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    description: "Generate QR codes for URLs, text, WiFi, vCards. Adjustable size and error correction. Download PNG/SVG.",
    category: "calc",
    available: true,
    iconColor: "text-indigo-600",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description: "Calculate exact age in years, months, days, hours from a birth date. Detect leap-year birthdays.",
    category: "calc",
    available: true,
    iconColor: "text-indigo-600",
  },

  // ─────────── AI (3 tools) ───────────
  {
    slug: "ai-summarizer",
    name: "AI Summarizer",
    description: "Summarize long text into 2-3 sentences, 4-6 sentences, or detailed bullets. Powered by Claude Haiku 4.5.",
    category: "ai",
    available: true,
    iconColor: "text-violet-600",
  },
  {
    slug: "ai-translator",
    name: "AI Translator",
    description: "Translate text into 20 languages while preserving formatting (markdown, bullets, paragraphs). Claude Haiku 4.5.",
    category: "ai",
    available: true,
    iconColor: "text-violet-600",
  },
  {
    slug: "ai-grammar-checker",
    name: "AI Grammar Checker",
    description: "Fix grammar, spelling, punctuation without changing your voice. See exactly what was changed and why.",
    category: "ai",
    available: true,
    iconColor: "text-violet-600",
  },
];

export function getToolsByCategory(category: CategoryId): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
