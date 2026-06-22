# Screenshot capture checklist

17 screenshots needed across 5 comparison blog posts. Each slot currently has
an SVG placeholder under `public/blog-screenshots/<post>/`. Replace the SVG
with a real PNG (same filename, just change extension) — the `<Figure>`
embed in the MDX automatically picks up the new file when you also remove
the `pending` prop.

## How to capture cleanly

- **Browser**: Chrome 140+ in a private/incognito window (no extensions in the frame).
- **Window size**: 1440×900 viewport (standard laptop). Use Chrome DevTools → toggle device toolbar → Responsive → 1440×900 to lock it.
- **Capture tool**: Cmd+Shift+5 (Mac) or Snipping Tool (Windows). Capture the browser content area only (no Chrome chrome / address bar) so widths stay consistent.
- **Format**: PNG (not JPG — lossless for UI shots).
- **Width**: aim for ~1200-1400px wide. Bigger is fine, smaller is not (looks fuzzy on retina).
- **Filename**: must match exactly what's in the `<Figure src="…">` prop. Replace `.svg` with `.png`.
- **After capture**: open the post's MDX file and change `src="….svg"` → `src="….png"`, and **remove the `pending` prop** so the amber banner disappears.

## Slot list

Total time budget: ~30 min per post × 5 posts = ~2.5 hours.

### Post 1: `pickrack-vs-smallpdf-2026.mdx` (4 slots, ~30 min)

| # | File | What to capture | How |
|---|---|---|---|
| 1 | `smallpdf-quota-hit.png` | The "you've used 2 free tasks, upgrade to Pro" wall | Go to smallpdf.com in incognito. Use any 2 tools back-to-back with small dummy PDFs. On the 3rd tool, capture the quota wall that appears. |
| 2 | `smallpdf-watermark.png` | Smallpdf free-tier watermark on output | Run a free compress on smallpdf.com. Open the result PDF in a viewer. Zoom to bottom-right where the small "smallpdf" mark sits. Crop the relevant region. |
| 3 | `smallpdf-pricing.png` | Smallpdf Pro pricing page | smallpdf.com/pricing. Capture the Pro tier block clearly showing $9/mo (or current price). |
| 4 | `pickrack-devtools-no-upload.png` | Pickrack Merge PDF showing zero uploads in DevTools | Open https://pickrack.com/tools/pdf/merge-pdf/, open DevTools (F12) → Network tab → clear log → drop 3 small PDFs and click Merge → capture the Network tab showing zero outgoing file requests (only the page's own static assets). Important: this is the proof-screenshot of our privacy claim, capture it well. |

### Post 2: `pickrack-vs-ilovepdf-2026.mdx` (3 slots, ~30 min)

| # | File | What to capture | How |
|---|---|---|---|
| 1 | `ilovepdf-quota-hit.png` | iLovePDF free quota / file-size limit message | ilovepdf.com in incognito. Either upload a >200 MB file (size error), or run 30 conversions back-to-back until you hit the daily limit. Capture the error/upgrade prompt. |
| 2 | `ilovepdf-pricing.png` | iLovePDF Premium pricing | ilovepdf.com/pricing. Capture the Premium tier with $9.99/mo or $79.99/year visible. |
| 3 | `merge-side-by-side.png` | Same 3 PDFs merged via Pickrack and iLovePDF | Take the same 3 input PDFs (use any small samples), merge once with Pickrack and once with iLovePDF. Open both result PDFs in a viewer side-by-side (or stack them in a single image editor). Capture the page-1 view of both with the same zoom. |

### Post 3: `free-tinypng-alternatives-2026.mdx` (4 slots, ~30 min)

| # | File | What to capture | How |
|---|---|---|---|
| 1 | `tinypng-500kb-limit.png` | TinyPNG free-tier limit message | tinypng.com in incognito. Try to upload a >5 MB image or upload 21 images in one batch. Capture the limit message. |
| 2 | `tinypng-pricing.png` | TinyPNG Pro pricing | tinypng.com/pricing or tinify.com. Capture the $39/year Pro tier. |
| 3 | `compression-quality-grid.png` | Same source image, 5 compressed versions | Pick one 4 MB source JPG (portrait or landscape, your choice). Compress via TinyPNG, Squoosh, Pickrack, Compressor.io, ImageOptim. In Photoshop / Figma / Canva, lay out the 5 outputs in a 5-column grid at 100% pixel zoom on the same region (e.g., an eye or fabric texture). Save the composite as PNG. |
| 4 | `pickrack-compressor-ui.png` | Pickrack Image Compressor in use | Open https://pickrack.com/tools/image/image-compressor/, upload an image, drag the quality slider to ~80%. Capture the UI showing the slider position + before/after file size deltas. |

### Post 4: `free-removebg-alternatives-2026.mdx` (3 slots, ~30 min)

| # | File | What to capture | How |
|---|---|---|---|
| 1 | `removebg-credit-paywall.png` | Remove.bg credit purchase wall | remove.bg in incognito. Upload a photo, click background-remove. The free preview shows. When you click "Download HD", capture the buy-credits modal that pops up. |
| 2 | `removebg-pricing.png` | Remove.bg pricing | remove.bg/pricing. Capture the pay-as-you-go ($0.20/HD) and subscription tier blocks. |
| 3 | `bgremoval-result-grid.png` | Same portrait, 4 tools' bg-removal outputs | Use the same input portrait (any photo with hair). Run through remove.bg, Pickrack, PhotoRoom, Adobe Express. Lay outputs in 4-column grid in your image editor. Crop a zoomed region around the hair edge in each (where quality differences are visible). |

### Post 5: `free-grammarly-alternatives-2026.mdx` (3 slots, ~30 min)

| # | File | What to capture | How |
|---|---|---|---|
| 1 | `grammarly-premium-popup.png` | Grammarly browser extension Premium upsell | Install Grammarly free extension. Open Gmail/any text field. Type a paragraph with a few intentional errors + style choices. When Grammarly underlines a suggestion that's Premium-only (yellow underline), click → capture the "Upgrade to Premium" popup. |
| 2 | `grammarly-pricing.png` | Grammarly Premium pricing | grammarly.com/premium. Capture the $12/mo + $144/year tier block. |
| 3 | `grammar-comparison-output.png` | Same paragraph corrected by Grammarly, LanguageTool, Pickrack | Pick a paragraph with 3-5 deliberate errors + a strong voice (e.g., short punchy sentences). Run through Grammarly Premium (or screenshot if you have access), LanguageTool free, Pickrack AI Grammar. Open all three results side-by-side in your image editor; highlight what each tool changed. Aim to show: Grammarly rewrote tone, LanguageTool and Pickrack fixed only objective errors. |

## After capture: update each MDX file

For each slot you finished, in the corresponding `posts/<slug>.mdx`:

```mdx
<Figure
  src="/blog-screenshots/<post>/<file>.svg"   ← change .svg to .png
  alt="..."
  caption="..."
  pending                                       ← delete this line
/>
```

The MDX builds fresh on next `npm run build`, so just deploy after.

## Optional polish ideas (not required for AdSense)

- Animate UI screenshots as short GIFs (e.g., the DevTools Network tab during a Pickrack merge). Use Kap (Mac) or LICEcap (free) to record 5-10s clips.
- Annotate screenshots with red boxes + labels for what to look at. Tools: CleanShot X (Mac) or ShareX (Windows). Avoid heavy annotations — one box per screenshot is plenty.
- Compress final PNGs through Pickrack's own image compressor (eat your own dog food) before committing. Typical 1.5 MB UI screenshot → 350 KB without visible quality loss.

## Why this matters

Real screenshots are the strongest EEAT signal Google's evaluators look for in
"comparison" / "best of" content. AI-generated tool review sites cannot
produce authentic screenshots of competitor UIs, so when Google sees them
it's strong evidence the author actually used the products. This is a major
differentiator for AdSense approval after a prior rejection.
