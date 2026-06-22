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
    title: "Free QR Code Generator — Custom Logo, Gradient, Crypto + VietQR",
    description:
      "Free QR codes for URL, WiFi, vCard, email, Bitcoin, Ethereum, PayPal, VietQR + 2 more. Custom shapes, gradient, logo, scan-me frame. PNG or SVG. No tracker.",
    keywords: [
      "qr code generator", "free qr code generator", "qr generator online",
      "qr code maker", "custom qr code", "qr code with logo",
      "qr code logo free", "gradient qr code", "qr code rounded dots",
      "qr code eye shape", "qr code frame", "scan me qr code",
      "wifi qr code", "sms qr code", "phone qr code",
      "geo location qr code", "calendar event qr code",
      "qr code no signup", "qr code no tracker", "qr code unlimited free",
    ],
  },
  "qr-scanner": {
    slug: "qr-scanner",
    name: "QR Code Scanner",
    title: "Free QR Code Scanner — Decode from Image or Camera",
    description:
      "Decode QR codes from an image upload or live camera. Detects URL, WiFi, vCard, email, phone, SMS, location, calendar event. Browser-side, no upload, no tracker.",
    keywords: [
      "qr code scanner", "free qr scanner", "qr code reader",
      "qr scanner online", "scan qr from image", "qr code decoder",
      "qr reader online", "scan qr camera", "qr scanner no app",
      "read wifi qr code", "decode vcard qr", "scan qr from photo",
      "qr code scanner web", "browser qr scanner",
    ],
  },
  "qr-batch": {
    slug: "qr-batch",
    name: "Bulk QR Code Generator",
    title: "Free Bulk QR Code Generator — CSV to ZIP, 500 QRs at Once",
    description:
      "Generate up to 500 QR codes from a CSV in one click. Download as a ZIP of PNG / SVG files. Browser-side batch, no upload, no signup, no daily quota.",
    keywords: [
      "bulk qr code generator", "csv to qr code", "batch qr generator",
      "mass qr code maker", "qr code generator csv", "multiple qr codes at once",
      "qr code zip download", "free bulk qr", "qr code batch online",
      "generate many qr codes", "qr code list", "bulk qr no signup",
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
  "tip-calculator": {
    slug: "tip-calculator",
    name: "Tip Calculator",
    title: "Tip Calculator — Split Bill, Add Tip, Round Up (7 Currencies)",
    description:
      "Free tip calculator with bill split, preset and slider tip percentages, round-up, and 7 currencies (USD, EUR, GBP, VND, JPY, AUD, CAD). Browser-side, no signup.",
    keywords: [
      "tip calculator", "split bill calculator", "restaurant tip calculator",
      "bill split tool", "free tip calculator", "tip calculator with split",
      "tip percentage calculator", "group bill calculator", "round up bill",
      "tip calculator online",
    ],
  },
  "bmi-calculator": {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    title: "BMI Calculator — Metric & Imperial, Healthy Range Estimate",
    description:
      "Free BMI calculator with metric (cm/kg) and imperial (ft+in/lb) units. Shows category (underweight, healthy, overweight, obese) plus the healthy weight range for your height. Browser-side.",
    keywords: [
      "bmi calculator", "body mass index calculator", "bmi calculator metric",
      "bmi calculator imperial", "healthy weight calculator", "bmi free",
      "bmi calculator online", "bmi range calculator", "weight range bmi",
      "bmi tool",
    ],
  },
  "currency-converter": {
    slug: "currency-converter",
    name: "Currency Converter",
    title: "Currency Converter — Live Rates, 28 Currencies, Free",
    description:
      "Convert between 28 major currencies with live mid-market rates from exchangerate-api.com. Cached locally for an hour, browser-side, no signup, no upsell.",
    keywords: [
      "currency converter", "live currency rates", "exchange rate calculator",
      "free currency converter", "usd to vnd", "eur to usd",
      "currency converter online", "mid market rates", "currency exchange tool",
      "fx converter",
    ],
  },
  "mortgage-calculator": {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    title: "Free Mortgage Calculator — Monthly Payment + Amortization Schedule",
    description:
      "Calculate monthly mortgage payment (P&I), total interest, and full amortization schedule. Includes extra-payment what-if analysis. Free, browser-side, no signup.",
    keywords: [
      "mortgage calculator", "free mortgage calculator", "monthly mortgage payment",
      "home loan calculator", "amortization schedule", "mortgage amortization calculator",
      "extra payment calculator", "mortgage payoff calculator", "loan calculator",
      "30 year mortgage calculator", "interest calculator", "P&I calculator",
    ],
  },
  "percentage-calculator": {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    title: "Free Percentage Calculator — 5 Modes, Live Result, No Signup",
    description:
      "Calculate X% of Y, X is what % of Y, % change, % increase or decrease — all five common operations in one tool. Live result as you type. Free, browser-side.",
    keywords: [
      "percentage calculator", "free percentage calculator", "percent calculator",
      "percent change calculator", "percent increase calculator", "percent decrease calculator",
      "what percent of x is y", "percentage difference", "discount calculator",
      "markup calculator", "tip percentage", "ratio to percentage",
    ],
  },
  "random-picker": {
    slug: "random-picker",
    name: "Random Picker",
    title: "Free Random Picker / Name Draw — Crypto-Secure, No Bias",
    description:
      "Paste a list, pick N at random. Cryptographically secure RNG via crypto.getRandomValues. With or without replacement. Animated reveal. Free, browser-side, no signup.",
    keywords: [
      "random picker", "random name picker", "free random picker",
      "name draw tool", "raffle picker", "random name generator",
      "pick from list", "random selection tool", "random winner picker",
      "crypto secure random", "name wheel alternative", "decision maker",
    ],
  },
  "pomodoro-timer": {
    slug: "pomodoro-timer",
    name: "Pomodoro Timer",
    title: "Free Pomodoro Timer Online — 25/5 Cycles, Browser Tab Countdown",
    description:
      "25-minute focus + 5-minute break loops with a long break every 4 cycles. Customizable durations, browser notifications, tab title countdown. Free, no signup.",
    keywords: [
      "pomodoro timer", "free pomodoro timer", "online pomodoro timer",
      "25 minute timer", "study timer", "productivity timer",
      "focus timer", "pomodoro technique", "tomato timer",
      "pomodoro app free", "browser pomodoro", "pomodoro no signup",
    ],
  },
  "contrast-checker": {
    slug: "contrast-checker",
    name: "WCAG Contrast Checker",
    title: "Free WCAG Contrast Checker — AA / AAA Rating + Sample Preview",
    description:
      "Check foreground/background color contrast for WCAG AA (4.5:1) and AAA (7:1) compliance. Sample text preview at 5 sizes. Free, browser-side, accessibility audit-ready.",
    keywords: [
      "contrast checker", "wcag contrast checker", "color contrast checker",
      "accessibility contrast tool", "aa contrast", "aaa contrast",
      "wcag color checker", "free contrast checker", "a11y contrast",
      "color accessibility tool", "wcag 2.1 contrast", "contrast ratio calculator",
    ],
  },
  "image-cropper": {
    slug: "image-cropper",
    name: "Image Cropper",
    title: "Image Cropper Online — Free, Preset Ratios, No Upload",
    description:
      "Crop images with preset aspect ratios (1:1, 4:3, 16:9, 9:16, 3:2) or freeform drag handles. Browser-side, no upload, instant export to PNG or JPG. Free, no signup.",
    keywords: [
      "image cropper", "crop image online", "free image cropper",
      "aspect ratio cropper", "instagram crop tool", "square photo crop",
      "image crop no upload", "crop jpg online", "crop png online",
      "image cropper free",
    ],
  },
  "image-upscaler": {
    slug: "image-upscaler",
    name: "Image Upscaler",
    title: "Image Upscaler Online — 2×, 3×, 4× Enlargement Free",
    description:
      "Enlarge images 2×, 3×, or 4× with smooth stepped bicubic resampling. Browser-side, no upload, no signup. Best for moderate enlargements of clean source images. Free.",
    keywords: [
      "image upscaler", "enlarge image online", "image enlarger",
      "upscale image free", "image upscale 4x", "image resize larger",
      "image upscaler no signup", "enlarge photo online", "image upscaler free",
      "browser image upscaler",
    ],
  },
  "color-palette": {
    slug: "color-palette",
    name: "Color Palette Extractor",
    title: "Color Palette Extractor — Dominant Colors from Image, Free",
    description:
      "Extract dominant colors from any image using median-cut quantization. Output as hex, RGB, or CSS array. Adjustable 3-12 swatches. Browser-side, no upload, free.",
    keywords: [
      "color palette extractor", "image color palette", "extract colors from image",
      "dominant color generator", "color picker from image", "palette generator",
      "image to palette", "css color palette", "image colors",
      "color extractor online",
    ],
  },
  "svg-optimizer": {
    slug: "svg-optimizer",
    name: "SVG Optimizer",
    title: "Free SVG Optimizer — Strip Comments, Round Decimals, Shorten Colors",
    description:
      "Optimize SVG markup: strip comments/metadata/whitespace, round path decimals, shorten color codes, remove default attributes. Live preview, size diff. Browser-side, free.",
    keywords: [
      "svg optimizer", "svg minifier", "free svg optimizer",
      "svg compressor", "svgo online", "minify svg",
      "svg cleaner", "remove inkscape metadata", "shrink svg",
      "svg reduce size", "svg optimization tool", "browser svg optimizer",
    ],
  },
  "image-watermark": {
    slug: "image-watermark",
    name: "Image Watermark",
    title: "Free Image Watermark — Text or Logo, 6 Positions, No Upload",
    description:
      "Add text or image watermark to a photo. 6 position presets (corners, center, tiled), opacity + rotation sliders. Canvas API browser-side, no upload.",
    keywords: [
      "image watermark", "watermark photo", "add watermark to image",
      "free watermark tool", "logo on photo", "copyright watermark",
      "watermark generator", "no upload watermark", "tile watermark",
      "diagonal watermark", "transparent watermark", "image watermark online",
    ],
  },
  "favicon-generator": {
    slug: "favicon-generator",
    name: "Favicon Generator",
    title: "Free Favicon Generator — 12 Sizes + ICO + Manifest + HTML Snippet",
    description:
      "Upload 1 image → favicon pack ZIP: 12 PNG sizes (16-512), favicon.ico multi-size, apple-touch-icon, site.webmanifest, HTML snippet. Browser-side, free.",
    keywords: [
      "favicon generator", "free favicon generator", "favicon maker",
      "ico generator", "favicon from image", "apple touch icon generator",
      "pwa manifest generator", "favicon pack", "browser favicon tool",
      "16x16 favicon", "32x32 favicon", "favicon multi size",
    ],
  },
  "gif-maker": {
    slug: "gif-maker",
    name: "GIF Maker",
    title: "Free GIF Maker — Images to Animated GIF, Drag to Reorder, Loop",
    description:
      "Combine multiple images into an animated GIF. Drag to reorder frames, set delay + loop count, resize. Browser-side via gif.js Web Worker. No upload, free.",
    keywords: [
      "gif maker", "free gif maker", "images to gif",
      "animated gif generator", "gif creator online", "frame to gif",
      "gif from photos", "create animated gif", "gif maker no signup",
      "gif maker browser", "online gif converter", "build gif",
    ],
  },
  "exif-reader": {
    slug: "exif-reader",
    name: "EXIF Reader & Stripper",
    title: "Free EXIF Viewer & Stripper — Camera, GPS, Privacy Cleanup",
    description:
      "Read camera EXIF + GPS metadata from photos. Strip metadata before sharing for privacy (location, camera serial, software fingerprint). Browser-side, free.",
    keywords: [
      "exif viewer", "exif reader", "exif stripper",
      "remove exif", "photo metadata reader", "gps from photo",
      "strip image metadata", "exif privacy tool", "camera exif",
      "free exif viewer", "browser exif tool", "metadata remover photo",
    ],
  },
  "youtube-summarizer": {
    slug: "youtube-summarizer",
    name: "YouTube Video Summarizer",
    title: "YouTube Summarizer — AI Video Summary from URL, Free",
    description:
      "Paste a YouTube URL and get a Claude Haiku 4.5 summary of the video transcript. Short, medium, or bullet-structured output. Free, no signup, daily free quota of 10.",
    keywords: [
      "youtube summarizer", "youtube video summarizer", "youtube to summary",
      "ai youtube summary", "claude youtube summarizer", "video summary tool",
      "summarize youtube video", "free youtube summarizer", "youtube transcript summary",
      "youtube summarizer no signup",
    ],
  },
  "chat-with-pdf": {
    slug: "chat-with-pdf",
    name: "Chat with PDF",
    title: "Chat with PDF — Ask Questions, Get Claude Answers, Free",
    description:
      "Ask questions about a PDF and get answers from Claude. PDF parsed in your browser — only the extracted text reaches our server. Free, no signup, daily quota of 30 chat turns.",
    keywords: [
      "chat with pdf", "pdf chat ai", "ask pdf questions", "pdf q&a tool",
      "claude pdf chat", "free pdf chat", "pdf chatbot", "talk to pdf",
      "chat with document", "ai pdf reader",
    ],
  },
  "translate-document": {
    slug: "translate-document",
    name: "Translate Document",
    title: "Translate Document — 20 Languages, Preserve Formatting, Free",
    description:
      "Translate text, markdown, HTML, CSV, JSON, or PDF documents into 20 languages while preserving formatting. Powered by Claude Haiku 4.5. Free, daily quota of 5.",
    keywords: [
      "translate document", "ai document translator", "pdf translator ai",
      "markdown translator", "html translator", "translate preserve format",
      "claude document translator", "free document translation",
      "translate document online", "ai translate docx",
    ],
  },
  "qr-art-generator": {
    slug: "qr-art-generator",
    name: "AI-Art QR Generator",
    title: "AI-Art QR Code Generator — Stable Diffusion + ControlNet",
    description:
      "Generate a scannable QR code blended into a Stable Diffusion artwork. ControlNet QR-monster model on self-hosted GPU. Scan-verified output.",
    keywords: [
      "ai qr code", "ai art qr", "stable diffusion qr code",
      "controlnet qr code", "qr code monster", "artistic qr code",
      "qr art generator", "ai generated qr", "qr code with art",
      "stable diffusion qr generator", "qr code illusion", "ai stylized qr",
    ],
  },
  "ai-image-upscaler": {
    slug: "ai-image-upscaler",
    name: "AI Image Upscaler",
    title: "Free AI Image Upscaler — Swin2SR Transformer 4× Detail Enhancement",
    description:
      "Upscale images 2× or 4× using the Swin2SR transformer (better than bicubic for photos). Detail enhancement built-in. Self-hosted GPU, free, no signup.",
    keywords: [
      "ai image upscaler", "free image upscaler", "swin2sr upscaler",
      "image 4x upscale", "ai photo enhancer", "upscale image online",
      "neural upscaler", "ai photo upscale", "free photo enhancer",
      "image super resolution", "transformer upscaler", "browser ai upscaler",
    ],
  },
  "ai-img2img": {
    slug: "ai-img2img",
    name: "AI Image Stylizer",
    title: "Free AI Image Stylizer — Stable Diffusion Img2Img, 4 Models",
    description:
      "Re-paint any photo in a new style: oil painting, watercolor, anime, cyberpunk, Ghibli. SD img2img with 4 model picker + strength slider. Self-hosted GPU, free.",
    keywords: [
      "ai image stylizer", "free img2img", "stable diffusion img2img",
      "photo to oil painting", "photo to anime", "ai style transfer",
      "ai photo art", "img to img free", "stable diffusion online",
      "photo to watercolor ai", "cyberpunk photo filter", "ghibli photo ai",
    ],
  },
  "screenshot-to-pdf": {
    slug: "screenshot-to-pdf",
    name: "Screenshot to PDF",
    title: "Screenshot to PDF — Paste & Combine into PDF, Free, No Upload",
    description:
      "Paste screenshots with Ctrl/Cmd+V and combine into a single PDF. Drag to reorder, fit-to-image or A4 pages. Browser-side via pdf-lib, free, no signup, no watermark.",
    keywords: [
      "screenshot to pdf", "paste screenshot to pdf", "combine screenshots pdf",
      "screenshots to single pdf", "clipboard to pdf", "screenshot pdf maker",
      "merge screenshots pdf", "free screenshot to pdf", "screenshot to pdf no upload",
      "ctrl v screenshot pdf",
    ],
  },
  "markdown-to-html": {
    slug: "markdown-to-html",
    name: "Markdown to HTML",
    title: "Markdown to HTML — GFM Live Preview, Copy or Download Free",
    description:
      "Convert Markdown to clean HTML with GitHub-Flavored extensions (tables, task lists, strikethrough). Live preview, copy HTML, download .html. Browser-side, free.",
    keywords: [
      "markdown to html", "md to html converter", "markdown converter",
      "gfm to html", "markdown preview", "markdown to html online",
      "convert markdown html", "markdown editor free", "markdown export html",
      "markdown to html no signup",
    ],
  },
  "find-replace": {
    slug: "find-replace",
    name: "Find & Replace",
    title: "Free Find & Replace Online — Regex, Capture Groups, Live Preview",
    description:
      "Find and replace text with full regex support, capture groups ($1 $2), case-insensitive, multiline modes. Live preview, match count. Browser-side, free.",
    keywords: [
      "find and replace", "find replace online", "regex find replace",
      "text find replace", "free find replace tool", "replace string online",
      "regex replace online", "find and replace regex", "string substitution tool",
      "bulk find replace", "find replace text",
    ],
  },
  "sort-lines": {
    slug: "sort-lines",
    name: "Sort Lines",
    title: "Free Sort Lines Online — Alpha, Numeric, Length, Natural + Shuffle",
    description:
      "Sort text lines: alphabetical, numerical, by length, natural (file1, file2, file10), reverse, or shuffle. Optional dedup + blank filter. Browser-side, free.",
    keywords: [
      "sort lines", "sort lines online", "sort text alphabetically",
      "free sort lines tool", "alphabetize lines", "sort by length",
      "natural sort online", "shuffle lines", "sort lines reverse",
      "sort and dedupe", "alphabetical sort tool",
    ],
  },
  "remove-duplicates": {
    slug: "remove-duplicates",
    name: "Remove Duplicate Lines",
    title: "Free Remove Duplicate Lines — Preserve Order, Case-Sensitive Toggle",
    description:
      "Dedupe text lines while preserving original order. Case-sensitive or insensitive, whitespace trimming, keep-first vs keep-last. Browser-side, free.",
    keywords: [
      "remove duplicate lines", "deduplicate text", "remove duplicates online",
      "delete duplicate lines", "unique lines tool", "free dedup tool",
      "remove duplicate rows", "deduplicate list online", "unique entries tool",
      "duplicate line remover", "line dedupe",
    ],
  },
  "word-frequency": {
    slug: "word-frequency",
    name: "Word Frequency Counter",
    title: "Free Word Frequency Counter — Top N, Stopwords Filter, CSV Export",
    description:
      "Count word, character, or line occurrences in any text. Sorted top N, filter by min length, drop English stopwords. Export CSV. Browser-side, free.",
    keywords: [
      "word frequency counter", "word count tool", "word frequency analyzer",
      "free word frequency", "text frequency analysis", "word occurrence counter",
      "most common words tool", "word frequency csv", "term frequency tool",
      "word frequency online", "n-gram free",
    ],
  },
  "line-numberer": {
    slug: "line-numberer",
    name: "Line Numberer",
    title: "Free Line Numberer / Prefix Adder — 12 Presets + Custom Template",
    description:
      "Add numbers, bullets, or custom prefix to each line. 12 presets (1., a., - bullet, [ ], > quote, ...) + template syntax with {n} {a} {r} variables. Free, browser-side.",
    keywords: [
      "line numberer", "add line numbers", "number lines online",
      "add prefix to lines", "free line numberer", "add bullet to lines",
      "markdown list converter", "number text lines", "line prefix tool",
      "indent text tool", "todo list generator",
    ],
  },
  "timestamp-converter": {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    title: "Unix Timestamp Converter — ISO 8601, Timezone-Aware, Free",
    description:
      "Convert between Unix timestamp (seconds or ms), ISO 8601, and human-readable dates across timezones. Live preview, copy any format. Browser-side, free.",
    keywords: [
      "unix timestamp converter", "epoch converter", "timestamp to date",
      "date to timestamp", "iso 8601 converter", "unix time converter",
      "epoch to human readable", "timezone converter timestamp",
      "milliseconds timestamp converter", "free timestamp tool",
    ],
  },
  "diff-checker": {
    slug: "diff-checker",
    name: "Text Diff Checker",
    title: "Text Diff Checker — Compare Two Texts Online, Free, No Upload",
    description:
      "Compare two text blocks line-by-line with LCS algorithm. Color-coded additions, deletions, unchanged. Ignore whitespace or case. Browser-side, free.",
    keywords: [
      "text diff checker", "compare text online", "diff tool",
      "text comparison tool", "online diff checker", "compare two texts",
      "find differences text", "diff viewer", "text diff online free",
      "side by side diff",
    ],
  },
  "gradient-generator": {
    slug: "gradient-generator",
    name: "CSS Gradient Generator",
    title: "CSS Gradient Generator — Linear, Radial, Conic, Multi-Stop",
    description:
      "Build linear, radial, or conic CSS gradients with live preview. Multi-color stops, angle slider, presets, Tailwind v4-ready arbitrary value output. Free.",
    keywords: [
      "css gradient generator", "linear gradient generator", "radial gradient generator",
      "conic gradient generator", "gradient maker", "css gradient builder",
      "tailwind gradient generator", "free gradient generator",
      "color gradient css", "background gradient generator",
    ],
  },
  "color-converter": {
    slug: "color-converter",
    name: "Color Converter",
    title: "Free Color Converter — HEX, RGB, HSL, HSV + WCAG Contrast",
    description:
      "Convert colors between HEX, RGB, HSL, and HSV with live preview. Built-in WCAG contrast check vs white and black for accessibility. Free, browser-side.",
    keywords: [
      "color converter", "hex to rgb", "rgb to hex", "hex to hsl",
      "rgb to hsl", "hsl to rgb", "hsv to rgb", "color picker online",
      "wcag contrast checker", "color contrast tool", "free color converter",
      "color code converter", "color converter online",
    ],
  },
  "url-encoder": {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    title: "Free URL Encoder & Decoder — encodeURIComponent + encodeURI",
    description:
      "Percent-encode URL parameters or decode them. Toggle between encodeURIComponent (full) and encodeURI (URL-safe). Free, browser-side, instant.",
    keywords: [
      "url encoder", "url decoder", "percent encoding tool",
      "encodeuricomponent online", "encodeuri online", "url decode online",
      "url encode online", "free url encoder",
      "uri encoder", "uri decoder", "url escape tool",
    ],
  },
  "html-entity-encoder": {
    slug: "html-entity-encoder",
    name: "HTML Entity Encoder / Decoder",
    title: "Free HTML Entity Encoder & Decoder — Named, Numeric, All",
    description:
      "Escape HTML special chars (& < > \" ') to named (&amp;) or numeric (&#38;) entities, or decode entity strings back. Free, browser-side, instant.",
    keywords: [
      "html entity encoder", "html entity decoder", "html escape tool",
      "html unescape", "ampersand encoder", "named entity encoder",
      "html special characters", "xss escape tool", "html encode online",
      "free html entity encoder", "html decode online",
    ],
  },
  "sql-formatter": {
    slug: "sql-formatter",
    name: "SQL Formatter",
    title: "Free SQL Formatter — MySQL, PostgreSQL, SQLite, BigQuery + 7 More",
    description:
      "Pretty-print SQL across 11 dialects (MySQL, PostgreSQL, SQLite, MS SQL, BigQuery, Snowflake, Redshift, Oracle, Spark...). Indent + keyword case options. Browser-side.",
    keywords: [
      "sql formatter", "sql beautifier", "sql pretty print",
      "mysql formatter", "postgresql formatter", "sqlite formatter",
      "bigquery sql formatter", "snowflake sql formatter",
      "online sql formatter", "free sql formatter",
      "sql indent tool", "format sql query", "sql code formatter",
    ],
  },
  "yaml-json-converter": {
    slug: "yaml-json-converter",
    name: "YAML to JSON Converter",
    title: "Free YAML to JSON Converter — Bidirectional with Inline Errors",
    description:
      "Convert YAML to JSON or JSON to YAML with adjustable indent. Inline error reporting, browser-side parsing — no upload, no signup. Free.",
    keywords: [
      "yaml to json", "json to yaml", "yaml json converter",
      "yaml parser online", "yaml validator", "convert yaml to json",
      "yaml to json online", "free yaml converter", "json to yaml online",
      "yaml editor", "yaml decoder",
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

export function getToolBreadcrumbItems(slug: string): Array<{ label: string; href?: string }> | null {
  const seo = toolSEOMap[slug];
  if (!seo) return null;
  const tool = getTool(slug);
  const category = tool ? getCategory(tool.category) : getCategory("pdf");

  return [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools/" },
    { label: category.name, href: `/tools/${category.slug}/` },
    { label: seo.name },
  ];
}
