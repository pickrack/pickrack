# Pickrack

> Free online tools that respect your privacy. Most run entirely in your browser — files never leave your device.

[**Live demo → pickrack.com**](https://pickrack.com)

56 free tools across 6 categories: PDF, Image, AI, Developer, Text, Calculators. No signup, no daily limit, no watermark. Server-side tools (compression, conversion, AI) are explicitly labeled and delete inputs immediately after the response.

---

## Why Pickrack exists

Most free online tools are bait-and-switch:

- **Smallpdf** caps free users at **2 tasks/day**, then upsells $9/mo.
- **iLovePDF** limits **200MB per task** and pushes a $9.99/mo tier.
- **Sejda** allows **3 tasks/hour**, then $7.50/mo.
- **remove.bg** gives **1 free image/month**, then charges $0.20/image.
- **Adobe Acrobat Pro** is **$19.99/mo** ($239.88/year).

Pickrack offers no daily quota, no watermark, no signup. Most tools (39 of 56) run entirely in your browser using Canvas, WebAssembly, or Web Crypto APIs — your files never upload. Server-side tools that need it (Ghostscript compression, LibreOffice conversion, Calibre EPUB, AI via Anthropic Claude, live FX rates) are clearly labeled and delete inputs immediately.

The site is sustained by display advertising and affiliate commissions on **unrelated** products (premium tools we test and recommend in our blog). Tool functionality is fully unrestricted.

---

## Tools (56)

### 📄 PDF (17, mixed browser + server)

`merge-pdf` · `split-pdf` · `rotate-pdf` · `watermark-pdf` · `jpg-to-pdf` · `pdf-to-jpg` · `screenshot-to-pdf` · `compress-pdf` · `unlock-pdf` · `protect-pdf` · `pdf-to-markdown` · `word-to-pdf` · `pdf-to-word` · `pptx-to-pdf` · `pdf-to-pptx` · `epub-to-pdf` · `pdf-to-epub`

Engines: [pdf-lib](https://github.com/Hopding/pdf-lib) (browser), [qpdf](https://github.com/qpdf/qpdf) (server, AES-256), [Ghostscript](https://www.ghostscript.com) (compression), [pdftotext / pdftoppm](https://poppler.freedesktop.org) (Poppler), [LibreOffice](https://www.libreoffice.org) headless (Office formats), [Calibre ebook-convert](https://calibre-ebook.com) (EPUB), [pptxgenjs](https://github.com/gitbrent/PptxGenJS) (PDF→PPTX image-per-slide).

### 🖼️ Image (8, all browser-side)

`image-resizer` · `image-compressor` · `image-converter` · `image-cropper` · `image-upscaler` · `heic-to-jpg` · `background-remover` · `color-palette`

Engines: Canvas API for resize/compress/convert/crop/upscale, [heic2any](https://github.com/alexcorvi/heic2any) for HEIC, [@imgly/background-removal](https://github.com/imgly/background-removal-js) for AI background removal (~30MB ONNX model, downloaded once and cached), k-means clustering on Canvas pixel data for color-palette.

### 🤖 AI (6, server-side via Anthropic Claude)

`ai-summarizer` · `ai-translator` · `ai-grammar-checker` · `translate-document` · `chat-with-pdf` · `youtube-summarizer`

Powered by Claude Haiku 4.5. Anthropic's commercial API agreement excludes API inputs from training. Pickrack does not log inputs or outputs. Free tier: 10 requests per IP per day (covers 99% of casual use). `chat-with-pdf` and `translate-document` extract text via Poppler/LibreOffice server-side, then chunk + stream through Claude. `youtube-summarizer` pulls the transcript from YouTube's caption track and summarizes the chunked output.

### 💻 Developer (14, all browser-side)

`json-formatter` · `base64-encoder` · `jwt-decoder` · `hash-generator` (MD5/SHA-1/SHA-256/SHA-512) · `uuid-generator` (1-1000 bulk) · `regex-tester` (live match + capture groups + 6 presets) · `diff-checker` (line + word diff, side-by-side) · `timestamp-converter` (Unix ↔ ISO ↔ human, multi-timezone) · `gradient-generator` (CSS linear/radial/conic with code export) · `color-converter` (HEX ↔ RGB ↔ HSL ↔ HSV with live WCAG contrast vs white/black) · `url-encoder` (encodeURIComponent / encodeURI toggle, decode mode) · `html-entity-encoder` (named, numeric, or all-non-ASCII output; decodes hex + decimal) · `sql-formatter` (11 dialects: MySQL / PostgreSQL / SQLite / MS SQL / BigQuery / Snowflake / Redshift / Oracle PL/SQL / MariaDB / Spark / standard SQL — indent + keyword case) · `yaml-json-converter` (bidirectional, anchor resolution on YAML → JSON, inline parse errors)

Library engines: [sql-formatter](https://github.com/sql-formatter-org/sql-formatter) for SQL pretty-print, [js-yaml](https://github.com/nodeca/js-yaml) for YAML parse/serialize. All other dev tools are pure JavaScript / Web Crypto.

### ✏️ Text (5, all browser-side)

`word-counter` · `case-converter` (9 variants) · `lorem-ipsum` · `slug-generator` (Vietnamese diacritic stripping) · `markdown-to-html` (live preview, GitHub-flavored, copy-as-HTML)

### 🧮 Calculators (6, 5 browser-side + 1 server-side)

`password-generator` (crypto.getRandomValues, entropy meter) · `qr-generator` (URL/text/WiFi/vCard/email, PNG+SVG) · `age-calculator` (Y/M/D/h/m + leap-year handling) · `bmi-calculator` (metric + imperial, WHO categories) · `tip-calculator` (multi-person split, tax-inclusive) · `currency-converter` (live rates from exchangerate-api, server-side proxy to keep the API key out of the client)

---

## Privacy guarantees

| Tool category | Where data is processed | Data retention |
|---|---|---|
| Browser-side (39 of 56) | Your browser only | Never sent anywhere |
| Server-side PDF (qpdf, gs, pdftotext, LibreOffice, Calibre) | Your file uploads to our server, processed in a temp dir, deleted immediately on response | Zero retention |
| Server-side AI (Anthropic) | Your text sent to api.anthropic.com over HTTPS | Anthropic retains 30 days for abuse monitoring, then deletes; not used for training |
| Server-side FX (exchangerate-api) | Only the currency codes are sent — no user data | None |
| Site analytics | Google Analytics 4 page views (anonymous) | Per Google's policy |
| Display ads | Google AdSense (non-personalized where possible) | Per Google's policy |

For paranoid users: clone this repo, `npm install`, set up your own `.env.production`, deploy locally — zero data leaves your machine for browser-side tools, and you control where server-side tools run.

---

## Tech stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- **Styling**: [Tailwind v4](https://tailwindcss.com) (PostCSS, no config file)
- **Icons**: [Lucide](https://lucide.dev)
- **Deploy**: PM2 + Cloudflare Tunnel on a single home server (works on any Node 20+ host)
- **PDF browser**: pdf-lib + pdfjs-dist + jszip
- **PDF server**: qpdf + Ghostscript + Poppler + LibreOffice + Calibre + pptxgenjs
- **AI**: Anthropic API (Claude Haiku 4.5) via `lib/anthropic.ts` (direct fetch, no SDK weight)
- **Image WASM**: @imgly/background-removal + heic2any
- **Schema**: Schema.org markup (WebApplication, FAQPage, HowTo, BreadcrumbList, CollectionPage, ItemList) on every tool and hub page
- **MDX blog**: next-mdx-remote/rsc + frontmatter (faq + howTo arrays auto-injected as JSON-LD)

---

## Self-hosting

### 1. Clone and install

```bash
git clone https://github.com/pickrack/pickrack.git
cd pickrack
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local — only ANTHROPIC_API_KEY is required if you want AI tools.
# All other tools work without any environment variables.
```

### 3. (Optional) Install server-side binaries

If you want server-side PDF tools (compress, password, conversion, EPUB) and PowerPoint tools, install on the host:

```bash
# Debian/Ubuntu
sudo apt-get install -y \
  qpdf ghostscript poppler-utils \
  libreoffice-writer libreoffice-impress libreoffice-calc \
  calibre

# Verify
qpdf --version
gs --version
pdftotext -v
libreoffice --version
ebook-convert --version
```

If these binaries are missing, the corresponding API routes return a clear error. Browser-side tools (most of pickrack) work without any system dependencies.

### 4. Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

The site runs on `localhost:3000` by default. For production, run behind a reverse proxy (nginx, Caddy, Cloudflare Tunnel) with HTTPS.

---

## Architecture decisions

### Why browser-side first

PDF and image processing libraries (pdf-lib, Canvas API, heic2any, @imgly/background-removal) have matured enough since ~2022 that most everyday operations can run entirely in the browser. The performance gap with server-side processing is small (typically <2x slower for typical files), but the privacy and infrastructure-cost win is enormous: zero upload bandwidth, zero server CPU per user, zero data retention concern.

When we use server-side processing (PDF compression with Ghostscript, format conversion with LibreOffice, EPUB with Calibre, AI with Claude), it's because no browser-side equivalent exists at acceptable quality.

### Why no premium tier

Premium tiers create incentive misalignment: free users get worse UX (watermarks, quotas, hidden upsells) so they upgrade. We sustain costs via display ads (auto-loading, never inside the tool itself) and affiliate commissions on premium tools we honestly review in our blog. If you'd like to support development, see "Sponsoring" below.

### Why a single repo for 56 tools

Keeps the entire codebase auditable in one place. Each tool is roughly 200-400 lines of code under `app/tools/<category>/<slug>/`. Shared infrastructure (SEO, schema, layout) is in `lib/` and `components/`. Adding a new tool is ~3 files (page.tsx, layout.tsx, content + SEO entries).

### Why Schema.org markup everywhere

Pickrack is a new domain (registered 2026) competing against incumbents with DA 80+. Schema markup compensates by helping Google understand what each page is — every tool is a `WebApplication`, every hub is a `CollectionPage` with `ItemList`, every blog post is `Article` with `FAQPage` + `HowTo`. This is critical for new domains.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add a new tool or improve existing ones. Briefly:

1. Fork
2. Add `app/tools/<category>/<slug>/page.tsx` (the tool UI + logic)
3. Add `app/tools/<category>/<slug>/layout.tsx` (one-liner using `ToolLayoutShell`)
4. Add entries to `lib/tools.ts`, `lib/tool-seo.ts`, `lib/tool-content.ts`
5. PR with a screenshot

---

## Sponsoring

If Pickrack saves you time and you'd like to support continued development, the best ways are:

- **Star this repo** (helps with discoverability and GitHub trending)
- **Share with friends** (we have no marketing budget)
- **Use the affiliate links in our blog** if you happen to need premium tools we review (Wondershare PDFelement, Bonsai for freelancers)
- **Write a comparison post** on your blog/Reddit linking to Pickrack
- **Contribute code or a tool**

We are not a venture-backed startup; there's no donation page, no Patreon, no "buy me a coffee." This is a side project that should be stable for years because there's no team to disband.

---

## Frequently asked questions

**Q: Will Pickrack always be free?**
Yes. The browser-side tools have negligible operating cost. The server-side tools are paid for by display ads. We have no plans for a Pro tier.

**Q: How is this not a data harvesting operation?**
Inspect DevTools → Network on any browser-side tool. You'll see zero upload requests during the operation. The codebase is open source and the deployment is documented.

**Q: Why use Claude for AI tools instead of a free local model?**
Local models (LLaMA 3, Mistral, etc.) are catching up but still meaningfully behind Claude Haiku 4.5 on summarization, translation, and grammar correction in 2026. As local models close the gap, we plan to add a "local model" toggle for users with their own [Ollama](https://ollama.ai)/llama.cpp setup.

**Q: Can I deploy this to Vercel / Netlify / Cloudflare Pages?**
Browser-side tools and AI routes work on any serverless platform. Server-side PDF tools (qpdf/Ghostscript/LibreOffice) need a host with these binaries installed — Vercel/Netlify edge runtime won't work, but Vercel's Node.js runtime with custom binaries via `vercel.json` should work. The simplest path is a small VPS ($5/mo Hetzner / DigitalOcean) running PM2.

**Q: What about Vietnamese / non-English audiences?**
Tools work for any language input (word counter handles Vietnamese diacritics, slug generator strips đ→d, AI tools auto-detect). UI is English in v1. Localized UI is on the roadmap.

**Q: How do I report a bug?**
Open a GitHub issue with: tool slug, browser + version, file you tried (or a description), expected vs actual result.

---

## License

[MIT](./LICENSE) — use it commercially, fork it, host it yourself, no attribution required (though appreciated).

---

## Acknowledgments

Built on the shoulders of giants:

- [pdf-lib](https://github.com/Hopding/pdf-lib) — browser-side PDF manipulation
- [pdfjs-dist](https://mozilla.github.io/pdf.js/) — Mozilla's PDF rendering
- [qpdf](https://github.com/qpdf/qpdf) — PDF transformation in C++
- [Ghostscript](https://www.ghostscript.com) — PostScript / PDF interpreter (40+ years old, still essential)
- [Poppler](https://poppler.freedesktop.org) — pdftotext, pdftoppm
- [LibreOffice](https://www.libreoffice.org) — Word/PowerPoint/Excel conversion
- [Calibre](https://calibre-ebook.com) — EPUB conversion (Kovid Goyal's masterpiece, 15+ years)
- [@imgly/background-removal](https://github.com/imgly/background-removal-js) — browser-side AI background removal
- [heic2any](https://github.com/alexcorvi/heic2any) — HEIC decoder in JS
- [pptxgenjs](https://github.com/gitbrent/PptxGenJS) — PPTX builder in JS
- [Anthropic Claude](https://anthropic.com) — AI tools backend
- [Next.js](https://nextjs.org), [React](https://react.dev), [Tailwind](https://tailwindcss.com), [Lucide](https://lucide.dev)

If any of these maintainers see this — thank you. The web is better because of your work.
