/**
 * Single source of truth for tool categories.
 * Used by Header dropdown, Footer, homepage cards, hub pages, and SEO/schema.
 */

export type CategoryId = "pdf" | "image" | "ai" | "dev" | "text" | "calc";

export type Category = {
  id: CategoryId;
  /** URL slug used in /tools/<slug>/ */
  slug: string;
  name: string;
  /** Short label for compact UI (header dropdown, cards) */
  shortLabel: string;
  /** One-line description shown on category cards + hub page intro */
  tagline: string;
  /** Longer description (200-300w) shown on hub page below H1 */
  description: string;
  /** Color theme — Tailwind classes */
  iconColor: string;
  bgColor: string;
  borderColor: string;
  /** Lucide icon name for displays */
  iconName:
    | "FileText"
    | "Image"
    | "Sparkles"
    | "Code2"
    | "Type"
    | "Calculator";
};

export const CATEGORIES: Record<CategoryId, Category> = {
  pdf: {
    id: "pdf",
    slug: "pdf",
    name: "PDF Tools",
    shortLabel: "PDF",
    tagline:
      "Merge, split, convert, compress, encrypt, OCR — every PDF workflow.",
    description:
      "Free PDF tools that run in your browser when possible (merge, split, rotate, watermark, jpg-to-pdf, pdf-to-jpg) and on a privacy-respecting server when needed (compress, password, conversion, EPUB, PowerPoint). No upload for browser-side tools, no logging for server-side ones, no watermark or signup ever.",
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    iconName: "FileText",
  },
  image: {
    id: "image",
    slug: "image",
    name: "Image Tools",
    shortLabel: "Image",
    tagline:
      "Compress, convert, resize, remove background — without uploading.",
    description:
      "Free image tools that work directly in your browser using modern WebAssembly engines. Compress JPG/PNG/WebP without quality loss, convert between formats, resize for social or web, and remove backgrounds — all without your photo ever leaving your device. No watermark, no daily quota, no signup.",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconName: "Image",
  },
  ai: {
    id: "ai",
    slug: "ai",
    name: "AI Tools",
    shortLabel: "AI",
    tagline: "Summarize, translate, chat, transcribe — powered by Claude.",
    description:
      "Privacy-respecting AI tools powered by Anthropic Claude. Summarize URLs and articles, translate documents, chat with PDFs, transcribe audio, and check grammar. Inputs are sent directly to Anthropic's API, processed without storage, and results returned to you — no third-party data brokers, no training on your content, no shadow profile.",
    iconColor: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    iconName: "Sparkles",
  },
  dev: {
    id: "dev",
    slug: "dev",
    name: "Developer Tools",
    shortLabel: "Developer",
    tagline:
      "Format, encode, hash, validate — all the daily dev utilities.",
    description:
      "Free developer utilities that run entirely in your browser. JSON formatter, Base64 codec, JWT decoder, hash generator, regex tester, UUID generator, and more — every tool is client-side JavaScript so your tokens, payloads, and secrets never leave your tab. No tracking, no upselling, no account required.",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconName: "Code2",
  },
  text: {
    id: "text",
    slug: "text",
    name: "Text Tools",
    shortLabel: "Text",
    tagline: "Word count, case convert, lorem ipsum, slug, diff.",
    description:
      "Free text utilities for writers, editors, marketers, and anyone working with documents. Count words and characters for SEO articles, convert case (UPPER, lower, Title), generate Lorem Ipsum placeholder text, create URL slugs, and compare two text blocks side-by-side. Browser-side and instant.",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconName: "Type",
  },
  calc: {
    id: "calc",
    slug: "calc",
    name: "Calculators",
    shortLabel: "Calculators",
    tagline: "QR code, password, age, currency, tip, BMI.",
    description:
      "Free everyday calculators and generators. Build QR codes for menus and links, generate strong passwords, compute age and date differences, convert currencies with live rates, calculate tips and BMI. All browser-side and free of ads inside the tool itself.",
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    iconName: "Calculator",
  },
};

export const CATEGORY_ORDER: CategoryId[] = [
  "pdf",
  "image",
  "ai",
  "dev",
  "text",
  "calc",
];

export function getCategory(id: CategoryId): Category {
  return CATEGORIES[id];
}

export function listCategories(): Category[] {
  return CATEGORY_ORDER.map((id) => CATEGORIES[id]);
}
