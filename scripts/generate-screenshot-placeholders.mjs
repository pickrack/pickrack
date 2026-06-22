#!/usr/bin/env node
/**
 * Generate styled SVG placeholders for screenshot slots in comparison blog posts.
 * Each placeholder visually marks itself as "pending capture" so it's obvious
 * which slots still need real screenshots.
 *
 * Run: node scripts/generate-screenshot-placeholders.mjs
 */

import { promises as fs } from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..", "public", "blog-screenshots");

const SLOTS = [
  // ─── pickrack-vs-smallpdf ───
  {
    post: "pickrack-vs-smallpdf",
    file: "smallpdf-quota-hit.png",
    title: "Smallpdf — 2 free tasks reached",
    sub: "smallpdf.com after the 3rd task of the day",
    accent: "#ef4444",
  },
  {
    post: "pickrack-vs-smallpdf",
    file: "smallpdf-watermark.png",
    title: "Smallpdf free-tier watermark on output",
    sub: "Bottom-right corner of a compressed PDF",
    accent: "#f59e0b",
  },
  {
    post: "pickrack-vs-smallpdf",
    file: "smallpdf-pricing.png",
    title: "Smallpdf Pro pricing $9/month",
    sub: "smallpdf.com/pricing as of capture date",
    accent: "#3b82f6",
  },
  {
    post: "pickrack-vs-smallpdf",
    file: "pickrack-devtools-no-upload.png",
    title: "Pickrack Merge PDF — DevTools Network tab shows zero uploads",
    sub: "Chrome DevTools → Network during a 3-file merge",
    accent: "#10b981",
  },

  // ─── pickrack-vs-ilovepdf ───
  {
    post: "pickrack-vs-ilovepdf",
    file: "ilovepdf-quota-hit.png",
    title: "iLovePDF — 200MB / 30 conversions limit reached",
    sub: "ilovepdf.com error after free quota exhausted",
    accent: "#ef4444",
  },
  {
    post: "pickrack-vs-ilovepdf",
    file: "ilovepdf-pricing.png",
    title: "iLovePDF Premium pricing",
    sub: "ilovepdf.com/pricing as of capture date",
    accent: "#3b82f6",
  },
  {
    post: "pickrack-vs-ilovepdf",
    file: "merge-side-by-side.png",
    title: "Same 3-file PDF merge: Pickrack (left) vs iLovePDF (right)",
    sub: "Identical input, same compression, side-by-side outputs",
    accent: "#10b981",
  },

  // ─── free-tinypng-alternatives ───
  {
    post: "free-tinypng-alternatives",
    file: "tinypng-500kb-limit.png",
    title: "TinyPNG — 5MB free-tier ceiling (per file) and 20-image batch",
    sub: "Error or quota message on tinypng.com",
    accent: "#ef4444",
  },
  {
    post: "free-tinypng-alternatives",
    file: "tinypng-pricing.png",
    title: "TinyPNG Pro pricing $39/year",
    sub: "tinify.com/dashboard or tinypng.com/pricing",
    accent: "#3b82f6",
  },
  {
    post: "free-tinypng-alternatives",
    file: "compression-quality-grid.png",
    title: "Same source JPG compressed by 5 tools — visual comparison",
    sub: "TinyPNG vs Squoosh vs Pickrack vs Compressor.io vs Optimizilla",
    accent: "#10b981",
  },
  {
    post: "free-tinypng-alternatives",
    file: "pickrack-compressor-ui.png",
    title: "Pickrack Image Compressor — quality slider + size delta",
    sub: "Browser-side, no upload, file size before/after visible",
    accent: "#10b981",
  },

  // ─── free-removebg-alternatives ───
  {
    post: "free-removebg-alternatives",
    file: "removebg-credit-paywall.png",
    title: "Remove.bg — \"buy credits\" wall after the free preview",
    sub: "remove.bg after attempting full-resolution download",
    accent: "#ef4444",
  },
  {
    post: "free-removebg-alternatives",
    file: "removebg-pricing.png",
    title: "Remove.bg pricing: $0.20/image and subscription tiers",
    sub: "remove.bg/pricing as of capture date",
    accent: "#3b82f6",
  },
  {
    post: "free-removebg-alternatives",
    file: "bgremoval-result-grid.png",
    title: "Same portrait — background removal across 4 free tools",
    sub: "Remove.bg vs Pickrack vs PhotoRoom vs Adobe Express free",
    accent: "#10b981",
  },

  // ─── free-grammarly-alternatives ───
  {
    post: "free-grammarly-alternatives",
    file: "grammarly-premium-popup.png",
    title: "Grammarly free tier — advanced suggestions locked behind Premium",
    sub: "Browser extension popup when clicking a Premium-only suggestion",
    accent: "#ef4444",
  },
  {
    post: "free-grammarly-alternatives",
    file: "grammarly-pricing.png",
    title: "Grammarly Premium pricing $12/month",
    sub: "grammarly.com/premium as of capture date",
    accent: "#3b82f6",
  },
  {
    post: "free-grammarly-alternatives",
    file: "grammar-comparison-output.png",
    title: "Same paragraph corrected by Grammarly, LanguageTool, and Pickrack AI Grammar",
    sub: "Highlighting which tools rewrite voice vs fix objective errors only",
    accent: "#10b981",
  },
];

const SVG_W = 1200;
const SVG_H = 720;

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function svgFor(slot) {
  const { title, sub, accent } = slot;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_W} ${SVG_H}" width="${SVG_W}" height="${SVG_H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>
  <rect width="${SVG_W}" height="${SVG_H}" fill="url(#bg)"/>

  <!-- Browser chrome -->
  <rect x="60" y="60" width="${SVG_W - 120}" height="${SVG_H - 120}" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <rect x="60" y="60" width="${SVG_W - 120}" height="42" rx="12" fill="#f1f5f9"/>
  <circle cx="92" cy="81" r="6" fill="#ef4444"/>
  <circle cx="112" cy="81" r="6" fill="#f59e0b"/>
  <circle cx="132" cy="81" r="6" fill="#10b981"/>
  <rect x="160" y="69" width="${SVG_W - 280}" height="24" rx="12" fill="#e2e8f0"/>

  <!-- Accent ribbon -->
  <rect x="60" y="102" width="6" height="${SVG_H - 162}" fill="${accent}"/>

  <!-- Pending stamp -->
  <g transform="translate(${SVG_W - 280}, 130)">
    <rect width="220" height="38" rx="6" fill="#f59e0b"/>
    <text x="110" y="25" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">SCREENSHOT PENDING</text>
  </g>

  <!-- Title -->
  <text x="100" y="220" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#0f172a">${escapeXml(title)}</text>

  <!-- Sub -->
  <text x="100" y="260" font-family="system-ui, sans-serif" font-size="18" font-weight="400" fill="#475569">${escapeXml(sub)}</text>

  <!-- Mock content lines -->
  <g opacity="0.4">
    <rect x="100" y="310" width="${SVG_W - 200}" height="14" rx="3" fill="#94a3b8"/>
    <rect x="100" y="340" width="${SVG_W - 260}" height="14" rx="3" fill="#94a3b8"/>
    <rect x="100" y="370" width="${SVG_W - 320}" height="14" rx="3" fill="#94a3b8"/>
    <rect x="100" y="420" width="220" height="40" rx="6" fill="${accent}"/>
  </g>

  <!-- Footer hint -->
  <text x="${SVG_W / 2}" y="${SVG_H - 90}" font-family="system-ui, sans-serif" font-size="14" fill="#64748b" text-anchor="middle">Replace this placeholder with a real PNG capture. See SCREENSHOT-CHECKLIST.md for details.</text>
</svg>
`;
}

async function main() {
  for (const slot of SLOTS) {
    const dir = path.join(ROOT, slot.post);
    await fs.mkdir(dir, { recursive: true });
    // Write as .svg first
    const svgPath = path.join(dir, slot.file.replace(/\.png$/, ".svg"));
    await fs.writeFile(svgPath, svgFor(slot));
  }
  console.log(`Wrote ${SLOTS.length} placeholder SVG files under ${ROOT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
