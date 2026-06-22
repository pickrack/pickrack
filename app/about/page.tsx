import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, buildWebPageJsonLd } from "@/lib/policy-content";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

const PAGE_DESCRIPTION = `${SITE_NAME} is a free, privacy-first online tool suite — 76 tools across PDF, image, AI, dev, text, and calc categories. No signup, no daily quota, no watermark.`;

export const metadata: Metadata = {
  title: `About ${SITE_NAME}`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/about/` },
};

export default function AboutPage() {
  const jsonLd = buildWebPageJsonLd("about", `About ${SITE_NAME}`, PAGE_DESCRIPTION);
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose prose-lg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1>About {SITE_NAME}</h1>

      <p className="text-xl text-gray-600 leading-relaxed not-prose mb-8">
        {SITE_NAME} is a free, privacy-first online tool suite — 76 tools across PDF, image, AI, dev, text, and calc — that don&apos;t gate downloads behind a signup, don&apos;t watermark output, and don&apos;t log your files.
      </p>

      <h2>What {SITE_NAME} actually does</h2>
      <p>
        {SITE_NAME} hosts <strong>76 free tools across six categories</strong>, all accessible from <Link href="/tools/">/tools/</Link>:
      </p>
      <ul>
        <li><strong><Link href="/tools/pdf/">PDF tools (17)</Link></strong> — merge, split, rotate, watermark, compress, unlock, password-protect with AES-256, Word↔PDF, PPTX↔PDF, EPUB↔PDF, JPG↔PDF, extract markdown, screenshot-to-PDF (clipboard paste)</li>
        <li><strong><Link href="/tools/image/">Image tools (13)</Link></strong> — resize, compress, format conversion (PNG↔JPG↔WebP↔AVIF), HEIC→JPG, AI background removal (WebAssembly, no upload), cropper, upscaler, color-palette extractor, EXIF reader, favicon generator, GIF maker, image watermark, SVG optimizer</li>
        <li><strong><Link href="/tools/ai/">AI tools (9)</Link></strong> — summarizer, translator (20 languages), grammar checker, YouTube video summarizer, chat-with-PDF, document translator (these six use Anthropic Claude Haiku 4.5), plus QR-art generator, AI image upscaler, and image-to-image (these three run on a self-hosted GPU with Stable Diffusion)</li>
        <li><strong><Link href="/tools/dev/">Developer tools (14)</Link></strong> — JSON formatter, Base64 codec, JWT decoder, hash generator (MD5/SHA-1/SHA-256/SHA-512), UUID bulk generator, regex tester, Unix timestamp converter, text diff checker, CSS gradient generator, color converter, URL encoder, HTML-entity encoder, SQL formatter, YAML↔JSON converter</li>
        <li><strong><Link href="/tools/text/">Text tools (10)</Link></strong> — word counter, case converter (9 variants), Lorem Ipsum, slug generator, markdown-to-HTML, find &amp; replace, line numberer, remove duplicates, sort lines, word-frequency counter</li>
        <li><strong><Link href="/tools/calc/">Calculators (13)</Link></strong> — password generator, QR code generator (URL/text/Wi-Fi/vCard/email, PNG &amp; SVG), QR batch, QR scanner, age calculator, tip calculator, BMI calculator, percentage calculator, mortgage calculator, contrast checker, Pomodoro timer, random picker, currency converter</li>
      </ul>
      <p>
        56 of the 76 tools run <strong>entirely in your browser</strong> using Canvas, Web Crypto, pdf-lib, and WebAssembly. Your file does not touch our server. The remaining 20 (PDF compress, format conversions, AI tools, currency rate fetch) need a server because they shell out to native binaries (Ghostscript, qpdf, LibreOffice, Calibre) or call a third-party API with a key that must stay server-side. For server-side tools, files are written to a temp directory, processed, returned, and deleted in a <code>finally</code> block — there is no database, no logging of file contents. For AI tools, only the extracted text reaches our server (PDFs are parsed in your browser for chat-with-PDF and document translation).
      </p>

      <h2>Who runs {SITE_NAME}</h2>
      <p>
        {SITE_NAME} is a one-person operation. It&apos;s built and maintained by founder <Link href="/authors/david-pham/">David Pham</Link> — a former engineer at Adobe and Figma, based in San Jose, California. Read his full bio at <Link href="/authors/david-pham/">/authors/david-pham</Link>.
      </p>
      <p>
        There is no team, no investors, no growth team breathing down anyone&apos;s neck. The site exists because privacy-respecting free tools should not be a contradiction in terms.
      </p>

      <h2>Why {SITE_NAME} exists</h2>
      <p>
        Every &quot;free&quot; online PDF or image tool we&apos;ve used in the last few years had at least one of these dark patterns: a popup demanding email signup before download, a watermark stamped on the output, a daily quota hidden until you exceeded it, or vague privacy claims with no way to verify them.
      </p>
      <p>
        That entire pattern is a sales funnel disguised as a free tool. The real product is the upsell.
      </p>
      <p>
        {SITE_NAME} is the opposite. There is no Pickrack Pro. There is no email gate. There is no watermark on output. There is no daily quota except on the AI tools (where we pay Anthropic per call), and even those are 10 requests per day per IP — generous for casual use. The site is funded by display ads on text-content pages (blog posts and category hubs, never on AI tool pages where ads degrade the experience) and modest affiliate commissions on review posts that link to paid tools we genuinely use.
      </p>

      <h2>Open source as a privacy proof</h2>
      <p>
        Every line of {SITE_NAME}&apos;s code is on GitHub at <a href="https://github.com/pickrack/pickrack" target="_blank" rel="noopener noreferrer">github.com/pickrack/pickrack</a> under the MIT license. This matters because privacy claims with closed source are marketing. Privacy claims with open source are <em>falsifiable</em> — anyone with skepticism can read the actual server code that handles your file and confirm there is no logging, no storage, no leak.
      </p>
      <p>
        If you want to self-host {SITE_NAME} for your team, your school, or your country, the README walks you through the steps. The same code that runs at pickrack.com runs on your hardware, with no telemetry, no tracking, no nag screens.
      </p>

      <h2>How we review and recommend tools</h2>
      <p>
        For the comparison and best-of articles on this site, we follow a consistent process:
      </p>
      <ol>
        <li><strong>Define the real-world task</strong>, not a synthetic benchmark. &quot;Compress a 12 MB scanned contract for email&quot; is a real task. &quot;Compress a synthetic test PDF&quot; is not.</li>
        <li><strong>Test 5-10 candidate tools</strong> using the same input and the same task.</li>
        <li><strong>Note the result honestly</strong>: output quality, free-tier limits, signup friction, watermarks, performance, edge cases that broke.</li>
        <li><strong>Rank by genuine usefulness</strong> — what we would actually pick on a Tuesday afternoon, not what pays the highest affiliate commission.</li>
        <li><strong>Note when paid tools beat free alternatives</strong>, and when they don&apos;t. Some paid tools are worth it. Most aren&apos;t.</li>
      </ol>
      <p>
        Tools we recommend most strongly are often <em>free or open-source with no affiliate program at all</em>. If a paid tool earns a top spot in a review, it is because it genuinely beats the alternatives — not because it pays.
      </p>

      <h2>Editorial standards</h2>
      <ul>
        <li>Affiliate relationships are disclosed clearly at the top of any post that contains them — see the <Link href="/disclosure">Affiliate Disclosure</Link></li>
        <li>We never accept payment for a positive review, never publish sponsored content disguised as editorial</li>
        <li>Factual errors are publicly corrected when notified, with a &quot;Last updated&quot; date when revised</li>
        <li>Drafts may use AI assistance for grammar and research, but every published article is written and edited by a human, with first-hand testing of the tools described</li>
        <li>If a tool we recommend changes or breaks, we update the review — old recommendations are not abandoned</li>
      </ul>

      <h2>How {SITE_NAME} makes money</h2>
      <p>Two streams:</p>
      <ul>
        <li><strong>Display advertising</strong> via Google AdSense on blog posts and category hub pages. Ads are not placed on tool pages themselves where they would degrade the experience, and never on AI tool pages where they conflict with the user&apos;s task.</li>
        <li><strong>Affiliate commissions</strong> when readers click through to paid tools we review and complete a purchase. We disclose this on every post that contains affiliate links.</li>
      </ul>
      <p>
        Both streams together let us keep the site free, ad-light, and free of paywall pressure. There is no plan for a premium tier, no plan for a paid newsletter, no plan to gate tools behind signup. {SITE_NAME} stays free.
      </p>

      <h2>What {SITE_NAME} is not</h2>
      <ul>
        <li>Not a tools directory or marketplace pointing you elsewhere — every tool listed actually works on this site</li>
        <li>Not a SaaS company with a product to push or upsell you on</li>
        <li>Not a venture-backed media operation chasing growth at any cost</li>
        <li>Not affiliated with any specific tool vendor</li>
        <li>Not an AI content farm — articles are written by a human, with first-hand testing</li>
      </ul>

      <h2>Contact</h2>
      <p>
        Reach out at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> for:
      </p>
      <ul>
        <li>Tip about a tool we should review</li>
        <li>Bug report or feature request for an existing tool</li>
        <li>Correction or factual feedback on a blog post</li>
        <li>Press inquiry or partnership question</li>
        <li>Any other genuine question</li>
      </ul>
      <p>
        We try to respond within a few business days. We do not accept guest post pitches, sponsored content offers, paid backlink exchange requests, or &quot;collaborations&quot; that are thinly disguised marketing. Please do not waste your time or ours.
      </p>

      <p>
        For technical issues, the fastest channel is opening a GitHub issue at <a href="https://github.com/pickrack/pickrack/issues" target="_blank" rel="noopener noreferrer">github.com/pickrack/pickrack/issues</a>.
      </p>

      <p className="not-prose mt-10 flex flex-wrap gap-4">
        <Link href="/tools/" className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium">
          → Browse all 76 tools
        </Link>
        <Link href="/authors/david-pham/" className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium">
          → About the founder
        </Link>
        <Link href="/blog/" className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium">
          → Read the blog
        </Link>
      </p>
    </article>
  );
}
