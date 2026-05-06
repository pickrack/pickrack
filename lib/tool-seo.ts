import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";
import { getTool } from "@/lib/tools";
import { getCategory } from "@/lib/categories";

export type ToolSEO = {
  slug: string;
  name: string;
  title: string;
  description: string;
  keywords: string[];
};

/** Build canonical URL for a tool, using its category to construct the path. */
function toolUrl(slug: string): string {
  const tool = getTool(slug);
  // Default to PDF if not found (backward compat for tools registered before category field)
  const categorySlug = tool ? getCategory(tool.category).slug : "pdf";
  return `${SITE_URL}/tools/${categorySlug}/${slug}/`;
}

export const toolSEOMap: Record<string, ToolSEO> = {
  "merge-pdf": {
    slug: "merge-pdf",
    name: "Merge PDF",
    title: "Merge PDF Online — Combine PDF Files Free, No Watermark",
    description:
      "Combine multiple PDF files into a single document. Drag to reorder, browser-side processing, no upload, no signup, no watermark. Free PDF merger that works offline once loaded.",
    keywords: [
      "merge pdf", "combine pdf", "merge pdf online", "combine pdf files",
      "merge pdf free", "join pdf", "pdf merger", "merge multiple pdfs",
      "combine pdfs no watermark", "merge pdf without signup",
    ],
  },
  "split-pdf": {
    slug: "split-pdf",
    name: "Split PDF",
    title: "Split PDF Online — Extract Pages Free, No Upload",
    description:
      "Split a PDF by extracting specific pages or page ranges (e.g., 1-3, 5, 7-10). Browser-side, your file stays on your device. Free, no signup, no watermark.",
    keywords: [
      "split pdf", "extract pages from pdf", "pdf splitter", "split pdf online free",
      "split pdf by pages", "extract pdf pages", "divide pdf",
      "split pdf no watermark", "pdf page extractor",
    ],
  },
  "rotate-pdf": {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    title: "Rotate PDF Online — Fix Sideways PDF Pages Free",
    description:
      "Rotate PDF pages by 90, 180, or 270 degrees. Fix sideways scans and upside-down pages. Browser-side, no upload, no signup, no watermark, no quality loss.",
    keywords: [
      "rotate pdf", "rotate pdf pages", "pdf rotator", "fix sideways pdf",
      "rotate pdf online free", "turn pdf 90 degrees", "rotate pdf permanently",
      "rotate pdf no watermark",
    ],
  },
  "watermark-pdf": {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    title: "Add Watermark to PDF — CONFIDENTIAL, DRAFT, Custom Text",
    description:
      "Add a text watermark to every page of a PDF. CONFIDENTIAL, DRAFT, your name — adjustable opacity, size, and position. Browser-side, free, no upload.",
    keywords: [
      "watermark pdf", "add watermark to pdf", "pdf watermark online",
      "confidential watermark", "draft watermark pdf", "text watermark pdf",
      "stamp pdf", "watermark pdf free",
    ],
  },
  "jpg-to-pdf": {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    title: "JPG to PDF — Combine Images into PDF Free",
    description:
      "Convert JPG, PNG images into a single PDF document. Drag to reorder, choose A4, US Letter, or fit-to-image page size. Browser-side, free, no upload, no watermark.",
    keywords: [
      "jpg to pdf", "image to pdf", "convert jpg to pdf", "png to pdf",
      "photos to pdf", "combine images pdf", "jpg to pdf free",
      "jpeg to pdf converter",
    ],
  },
  "pdf-to-jpg": {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    title: "PDF to JPG — Convert PDF Pages to Images Free",
    description:
      "Export each page of a PDF as a JPG image. Single page → JPG, multi-page → ZIP archive. Quality presets, browser-side, no upload, no watermark.",
    keywords: [
      "pdf to jpg", "convert pdf to jpg", "pdf to image", "pdf pages to jpg",
      "pdf to jpeg", "pdf to png", "extract images from pdf", "pdf to image free",
    ],
  },
  "compress-pdf": {
    slug: "compress-pdf",
    name: "Compress PDF",
    title: "Compress PDF — Reduce PDF File Size Free, No Watermark",
    description:
      "Reduce PDF file size with low/medium/high compression levels. Server-side Ghostscript engine, free, no signup. Typical reduction: 30-80% for image-heavy PDFs.",
    keywords: [
      "compress pdf", "reduce pdf size", "shrink pdf", "pdf compressor",
      "compress pdf online", "pdf size reducer", "compress pdf free",
      "make pdf smaller", "reduce pdf file size",
    ],
  },
  "pdf-to-markdown": {
    slug: "pdf-to-markdown",
    name: "PDF to Markdown",
    title: "PDF to Markdown — Extract for ChatGPT, Claude, Notion",
    description:
      "Extract PDF text with layout preserved. Paste into ChatGPT, Claude, Notion, or any LLM for sharper, more accurate AI responses. Free, server-side pdftotext.",
    keywords: [
      "pdf to markdown", "pdf to text", "extract pdf for ai",
      "pdf for chatgpt", "pdf for claude", "pdf to markdown converter",
      "pdf text extraction", "rag pdf converter", "pdf to md",
    ],
  },
  "unlock-pdf": {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    title: "Unlock PDF — Remove PDF Password Free (Password Required)",
    description:
      "Remove password protection from a PDF you own. Server-side qpdf, free, no logging. You must know the password — this tool does not crack unknown passwords.",
    keywords: [
      "unlock pdf", "remove pdf password", "decrypt pdf", "pdf password remover",
      "unlock pdf online", "pdf decrypt online", "remove password from pdf",
      "unlock pdf free",
    ],
  },
  "protect-pdf": {
    slug: "protect-pdf",
    name: "Protect PDF",
    title: "Password Protect PDF — Encrypt with AES-256 Free",
    description:
      "Add password protection to a PDF using AES-256 encryption. Server-side qpdf, no logging, no signup. Works in Adobe Reader, Foxit, Preview, all modern viewers.",
    keywords: [
      "protect pdf", "password protect pdf", "encrypt pdf", "add password to pdf",
      "pdf security", "lock pdf", "pdf password protection", "secure pdf",
      "encrypt pdf aes-256",
    ],
  },
  "word-to-pdf": {
    slug: "word-to-pdf",
    name: "Word to PDF",
    title: "Word to PDF — Convert DOCX, DOC, ODT to PDF Free Online",
    description:
      "Convert Word documents (DOCX, DOC, ODT) to PDF online. LibreOffice engine preserves formatting, fonts, images, tables. Free, no signup, no watermark.",
    keywords: [
      "word to pdf", "docx to pdf", "convert word to pdf", "word to pdf converter",
      "doc to pdf", "odt to pdf", "free word to pdf", "word to pdf online",
      "convert docx to pdf", "word to pdf free no watermark",
    ],
  },
  "pdf-to-word": {
    slug: "pdf-to-word",
    name: "PDF to Word",
    title: "PDF to Word — Convert PDF to Editable DOCX Free Online",
    description:
      "Convert PDF to editable Word document (.docx). LibreOffice engine, free, no signup, no watermark. Best for text-based PDFs; scanned PDFs need OCR first.",
    keywords: [
      "pdf to word", "convert pdf to word", "pdf to docx", "pdf to word converter",
      "free pdf to word", "pdf to word free", "pdf to word online", "convert pdf to docx",
      "pdf to doc", "pdf to word no watermark",
    ],
  },
  "pptx-to-pdf": {
    slug: "pptx-to-pdf",
    name: "PowerPoint to PDF",
    title: "PowerPoint to PDF — Convert PPTX, PPT, ODP to PDF Free Online",
    description:
      "Convert PowerPoint presentations (PPTX, PPT, ODP) to PDF online. LibreOffice engine preserves layout, fonts, images, and slide order. Free, no signup, no watermark.",
    keywords: [
      "pptx to pdf", "powerpoint to pdf", "ppt to pdf", "convert pptx to pdf",
      "pptx to pdf converter", "powerpoint to pdf free", "pptx to pdf online",
      "odp to pdf", "ppt to pdf converter", "presentation to pdf",
    ],
  },
  "pdf-to-pptx": {
    slug: "pdf-to-pptx",
    name: "PDF to PowerPoint",
    title: "PDF to PowerPoint — Convert PDF to PPTX Free Online",
    description:
      "Convert PDF to PowerPoint (PPTX) with each page as an image-based slide. Layout preserved exactly. 16:9 widescreen output. Free, no signup, no watermark.",
    keywords: [
      "pdf to pptx", "pdf to powerpoint", "convert pdf to pptx", "pdf to ppt",
      "pdf to powerpoint converter", "pdf to pptx free", "pdf to powerpoint online",
      "pdf to slides", "convert pdf to ppt",
    ],
  },
  "epub-to-pdf": {
    slug: "epub-to-pdf",
    name: "EPUB to PDF",
    title: "EPUB to PDF — Convert Ebooks to PDF Free Online",
    description:
      "Convert EPUB ebooks to PDF for printing, sharing, or offline reading. Calibre engine preserves table of contents, chapters, and formatting. Free, no signup, no watermark.",
    keywords: [
      "epub to pdf", "convert epub to pdf", "ebook to pdf", "epub to pdf converter",
      "epub to pdf free", "epub to pdf online", "convert ebook to pdf",
      "epub to pdf no watermark",
    ],
  },
  "pdf-to-epub": {
    slug: "pdf-to-epub",
    name: "PDF to EPUB",
    title: "PDF to EPUB — Convert PDF to Ebook for Kindle, Kobo Free Online",
    description:
      "Convert PDF to EPUB ebook for Kindle, Kobo, Apple Books, or any reader. Calibre engine produces reflowable text with adjustable font size. Free, no signup.",
    keywords: [
      "pdf to epub", "convert pdf to epub", "pdf to ebook", "pdf to epub converter",
      "pdf to kindle", "pdf to epub free", "pdf to epub online",
      "pdf to kobo", "pdf to epub no watermark",
    ],
  },

  // ─────────── Image ───────────
  "image-compressor": {
    slug: "image-compressor",
    name: "Image Compressor",
    title: "Image Compressor — Compress JPG, PNG, WebP Free, No Upload",
    description:
      "Compress JPG, PNG, WebP images with adjustable quality. Browser-side, your image never uploads. Real-time before/after preview. Free, no signup, no watermark.",
    keywords: [
      "image compressor", "compress image online", "compress jpg", "compress png",
      "image size reducer", "reduce image size", "image compression online",
      "free image compressor", "compress image no upload", "tinypng alternative",
    ],
  },
  "image-converter": {
    slug: "image-converter",
    name: "Image Converter",
    title: "Image Converter — PNG to JPG, JPG to WebP, AVIF Online Free",
    description:
      "Convert images between PNG, JPG, WebP, AVIF formats. Batch support, browser-side processing. Free, no signup, no upload, no watermark.",
    keywords: [
      "image converter", "png to jpg", "jpg to png", "webp converter",
      "convert image format", "png to webp", "jpg to webp", "avif converter",
      "image format converter free", "online image converter no upload",
    ],
  },
  "heic-to-jpg": {
    slug: "heic-to-jpg",
    name: "HEIC to JPG Converter",
    title: "HEIC to JPG Converter — Convert iPhone Photos Free, Browser-Side",
    description:
      "Convert iPhone HEIC photos to JPG or PNG. Browser-side — your photos never upload. Free, no signup, batch supported. Works on Windows, Mac, Linux.",
    keywords: [
      "heic to jpg", "heic to png", "iphone photo converter", "heic converter",
      "convert heic", "heic to jpeg", "iphone heic to jpg",
      "free heic converter", "heic to jpg no upload",
    ],
  },
  "background-remover": {
    slug: "background-remover",
    name: "Background Remover",
    title: "Background Remover — AI in Your Browser, Free, No Upload",
    description:
      "Remove image background using AI directly in your browser. No upload, no signup, no daily limit. Free alternative to remove.bg. Powered by @imgly/background-removal.",
    keywords: [
      "background remover", "remove background", "ai background remover",
      "background remove online", "remove.bg alternative", "free background remover",
      "remove image background", "transparent background", "background eraser",
      "background remover no upload",
    ],
  },
  "image-resizer": {
    slug: "image-resizer",
    name: "Image Resizer",
    title: "Image Resizer Online — Resize JPG, PNG, WebP Free, No Upload",
    description:
      "Resize JPG, PNG, WebP, and AVIF images to any width or height. Browser-side, your image never uploads. Free, no signup, no watermark, no quality loss for downscaling.",
    keywords: [
      "image resizer", "resize image", "resize jpg", "resize png", "image resizer online",
      "free image resizer", "resize photo online", "resize image free",
      "image resizer no watermark", "image resizer no upload",
    ],
  },

  // ─────────── Developer ───────────
  "base64-encoder": {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    title: "Base64 Encoder & Decoder Online — Free, Browser-Side",
    description:
      "Encode text to Base64 or decode Base64 back to text. Supports file mode for images and binary. Browser-side — your strings never upload. Free, no signup.",
    keywords: [
      "base64 encoder", "base64 decoder", "base64 encode online",
      "base64 decode online", "free base64 tool", "base64 string converter",
      "base64 to text", "text to base64", "base64 file encoder",
    ],
  },
  "jwt-decoder": {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    title: "JWT Decoder Online — Inspect Token Header & Payload Free",
    description:
      "Decode and inspect JWT header, payload, and expiry. Browser-side, your token never leaves your tab. Validates structure. Free, no signup.",
    keywords: [
      "jwt decoder", "jwt parser", "decode jwt online", "jwt inspector",
      "jwt token decoder", "jwt debugger", "free jwt decoder",
      "jwt no upload", "jwt parse online",
    ],
  },
  "hash-generator": {
    slug: "hash-generator",
    name: "Hash Generator",
    title: "Hash Generator — MD5, SHA-1, SHA-256, SHA-512 Online Free",
    description:
      "Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or files. Browser-side using Web Crypto API. Free, no signup, no upload.",
    keywords: [
      "hash generator", "md5 hash", "sha256 generator", "sha1 hash",
      "sha512 hash", "hash text online", "file hash calculator",
      "checksum generator", "free hash tool",
    ],
  },
  "uuid-generator": {
    slug: "uuid-generator",
    name: "UUID Generator",
    title: "UUID Generator Online — Random UUID v4, Bulk Generation",
    description:
      "Generate cryptographic UUID v4 — single or up to 1000 in bulk. Copy, download as text. Browser crypto.randomUUID, no server roundtrip.",
    keywords: [
      "uuid generator", "guid generator", "uuid v4", "random uuid online",
      "bulk uuid generator", "free uuid tool", "uuid creator",
      "generate guid online",
    ],
  },
  "regex-tester": {
    slug: "regex-tester",
    name: "Regex Tester",
    title: "Regex Tester Online — Live Match, Capture Groups, JavaScript Flags",
    description:
      "Test regular expressions live with highlighted matches and capture groups. Supports g, i, m, s, u, y flags. Browser-side, instant feedback. Free.",
    keywords: [
      "regex tester", "regex online", "regular expression tester",
      "regex debugger", "javascript regex tester", "regex match online",
      "regex pattern tester", "free regex tool",
    ],
  },
  "json-formatter": {
    slug: "json-formatter",
    name: "JSON Formatter",
    title: "JSON Formatter & Validator — Free, Browser-Side, No Tracking",
    description:
      "Format, validate, and minify JSON instantly in your browser. Detects syntax errors with line numbers. Your data never uploads or logs. Free, no signup.",
    keywords: [
      "json formatter", "json validator", "format json", "json beautifier",
      "json pretty print", "json minifier", "validate json online",
      "json formatter free", "json formatter no upload", "json parser online",
    ],
  },

  // ─────────── Text ───────────
  "case-converter": {
    slug: "case-converter",
    name: "Case Converter",
    title: "Case Converter — UPPER, lower, Title, camelCase, snake_case",
    description:
      "Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, CONSTANT_CASE. Live preview. Free.",
    keywords: [
      "case converter", "uppercase converter", "lowercase converter",
      "title case converter", "camelcase converter", "snake case converter",
      "kebab case converter", "text case changer", "free case converter",
    ],
  },
  "lorem-ipsum": {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    title: "Lorem Ipsum Generator — Free Placeholder Text, Words, Sentences",
    description:
      "Generate Lorem Ipsum placeholder text in words, sentences, or paragraphs. Adjustable length, copy with one click. Free, no signup.",
    keywords: [
      "lorem ipsum generator", "lorem ipsum", "placeholder text generator",
      "lipsum generator", "dummy text generator", "free lorem ipsum",
      "lorem ipsum copy", "lorem ipsum online",
    ],
  },
  "slug-generator": {
    slug: "slug-generator",
    name: "Slug Generator",
    title: "URL Slug Generator — Strip Diacritics, Vietnamese Support",
    description:
      "Convert any text to URL-friendly slug. Strips Vietnamese diacritics (đ→d, ư→u, ê→e), special characters, and spaces. Free, browser-side.",
    keywords: [
      "slug generator", "url slug", "url friendly text", "permalink generator",
      "vietnamese slug", "remove diacritics", "url slugify",
      "free slug generator",
    ],
  },
  "word-counter": {
    slug: "word-counter",
    name: "Word Counter",
    title: "Word Counter — Count Words, Characters, Reading Time Free",
    description:
      "Count words, characters with and without spaces, sentences, paragraphs, and reading time. Live update as you type. Browser-side, free, no signup.",
    keywords: [
      "word counter", "character counter", "word count", "online word counter",
      "free word counter", "count words", "reading time calculator",
      "essay word counter", "seo word counter", "word counter no signup",
    ],
  },

  // ─────────── AI ───────────
  "ai-summarizer": {
    slug: "ai-summarizer",
    name: "AI Summarizer",
    title: "AI Summarizer — Summarize Articles, Documents Free with Claude",
    description:
      "Free AI summarizer powered by Claude Haiku 4.5. Paste any article, document, or notes and get a concise summary in seconds. Short, medium, or detailed bullet output. No signup.",
    keywords: [
      "ai summarizer", "summarize article", "ai summary tool", "claude summarizer",
      "free ai summarizer", "text summarizer ai", "summarize text online",
      "ai article summarizer", "summarize pdf", "haiku summarizer",
    ],
  },
  "ai-translator": {
    slug: "ai-translator",
    name: "AI Translator",
    title: "AI Translator — Free Document Translation with Format Preserved",
    description:
      "Free AI translator powered by Claude Haiku 4.5. Translate text into 20 languages while preserving markdown, bullets, and paragraph structure. No signup, daily free quota.",
    keywords: [
      "ai translator", "ai translation", "free ai translator", "claude translator",
      "translate document online", "ai translation tool", "translate preserve format",
      "ai translator vietnamese", "ai translator markdown", "translate text ai",
    ],
  },
  "ai-grammar-checker": {
    slug: "ai-grammar-checker",
    name: "AI Grammar Checker",
    title: "AI Grammar Checker — Fix Errors Without Changing Your Voice",
    description:
      "Free AI grammar checker powered by Claude Haiku 4.5. Fixes grammar, spelling, punctuation while preserving your writing voice. See exactly what changed and why.",
    keywords: [
      "ai grammar checker", "grammar checker free", "ai spell checker",
      "free grammar checker", "ai writing checker", "grammar checker no signup",
      "claude grammar checker", "ai proofreader", "grammar fix tool",
    ],
  },

  // ─────────── Calculators ───────────
  "qr-generator": {
    slug: "qr-generator",
    name: "QR Code Generator",
    title: "QR Code Generator Online — Free, Custom Size, Download PNG/SVG",
    description:
      "Generate QR codes for URLs, text, WiFi credentials, and vCards. Adjustable size and error correction. Download as PNG or SVG. Free, no signup.",
    keywords: [
      "qr code generator", "free qr generator", "qr code maker",
      "qr generator online", "qr code creator", "url to qr code",
      "wifi qr code", "qr code download", "qr code no signup",
    ],
  },
  "age-calculator": {
    slug: "age-calculator",
    name: "Age Calculator",
    title: "Age Calculator Online — Years, Months, Days, Hours, Minutes",
    description:
      "Calculate exact age from a birth date — years, months, days, hours, minutes. Detect leap-year birthdays. Free, browser-side, no signup.",
    keywords: [
      "age calculator", "calculate age online", "exact age calculator",
      "age in years months days", "birthday calculator", "age from date of birth",
      "free age calculator", "age calculator no signup",
    ],
  },
  "password-generator": {
    slug: "password-generator",
    name: "Password Generator",
    title: "Password Generator — Strong, Random, Cryptographically Secure",
    description:
      "Generate strong random passwords with adjustable length, symbols, numbers, and similar-character exclusion. Browser-side using crypto.getRandomValues — never sent to a server.",
    keywords: [
      "password generator", "strong password generator", "random password generator",
      "secure password generator", "free password generator", "password creator",
      "password generator online", "password generator no signup",
    ],
  },
};

export function buildToolMetadata(slug: string): Metadata | null {
  const seo = toolSEOMap[slug];
  if (!seo) return null;
  const url = toolUrl(slug);
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    alternates: { canonical: url },
  };
}

export function buildToolJsonLd(slug: string): {
  softwareApp: Record<string, unknown>;
  breadcrumb: Record<string, unknown>;
} | null {
  const seo = toolSEOMap[slug];
  if (!seo) return null;
  const url = toolUrl(slug);
  const tool = getTool(slug);
  const category = tool ? getCategory(tool.category) : getCategory("pdf");

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seo.name,
    url,
    description: seo.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools/` },
      { "@type": "ListItem", position: 3, name: category.name, item: `${SITE_URL}/tools/${category.slug}/` },
      { "@type": "ListItem", position: 4, name: seo.name, item: url },
    ],
  };

  return { softwareApp, breadcrumb };
}
