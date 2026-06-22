import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, FileText, Beaker, Github, ExternalLink } from "lucide-react";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

const PAGE_DESCRIPTION = `How ${SITE_NAME} tests, compares, and ranks the tools we review. Public test files, transparent grading rubric, real-world tasks instead of synthetic benchmarks.`;

export const metadata: Metadata = {
  title: `Methodology — How ${SITE_NAME} Tests Tools`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/methodology/` },
};

export default function MethodologyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Methodology — How ${SITE_NAME} Tests Tools`,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/methodology/`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Methodology", item: `${SITE_URL}/methodology/` },
      ],
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose prose-lg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1>How {SITE_NAME} tests tools</h1>

      <p className="text-xl text-gray-600 leading-relaxed not-prose mb-6">
        Every comparison and best-of article on {SITE_NAME} is grounded in real testing. This page documents the exact methodology so you can verify our claims — or replicate them yourself.
      </p>

      <div className="not-prose my-8 rounded-2xl border bg-emerald-50 p-5 sm:p-6 flex gap-4" style={{ borderColor: "var(--color-border)" }}>
        <Beaker className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
        <div>
          <p className="font-semibold text-gray-900 m-0">TL;DR</p>
          <p className="text-sm text-gray-700 mt-1 mb-0">
            Real-world tasks (not synthetic benchmarks). 5-10 candidates per category. Same input file across all tools. Grade on output quality, free-tier limits, signup friction, watermarks, and edge cases. Output files and test inputs published on GitHub. Ranking ignores affiliate revenue — we explicitly note when our top pick has no affiliate program at all.
          </p>
        </div>
      </div>

      <h2 id="why-not-benchmarks">Why we don&apos;t use synthetic benchmarks</h2>
      <p>
        A common practice in tool-review content is &quot;benchmark a 1 MB perfectly-formed test PDF.&quot; This kind of testing makes every tool look identical because every tool handles the easy case. The interesting differences only show up on the messy real-world files most people actually have: a 12 MB scanned contract with mixed orientation, a 45 MB PowerPoint export with embedded video previews, a HEIC photo straight off an iPhone 15.
      </p>
      <p>
        For every comparison post on {SITE_NAME}, we define a <strong>real-world task</strong> first, find or construct the kind of file you&apos;d actually need to process for that task, and then run every candidate tool against it. The grading rubric is calibrated against that real task, not against an abstract benchmark.
      </p>

      <h2 id="rubric">Our grading rubric</h2>
      <p>
        Each tool we review is scored on six dimensions. Not every dimension applies to every tool category, but the ones that apply are scored consistently across competitors.
      </p>

      <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
        <Criterion
          title="1. Output quality"
          text="Does the result match what you actually need? For a PDF compressor: is the text still readable? For an image converter: is there visible banding or color shift? Subjective but consistent — same reviewer, same monitor, same time of day."
        />
        <Criterion
          title="2. Free-tier limits"
          text="Daily quota, file-size cap, file-count cap. We test until we hit the limit so we know exactly where it bites. &quot;Free with limits&quot; counts; &quot;free trial&quot; (i.e., paid in disguise) does not."
        />
        <Criterion
          title="3. Signup friction"
          text="Email required? Account required for download? Captcha? OAuth dance? Anything that interrupts the &quot;upload → process → download&quot; flow is friction and is graded down."
        />
        <Criterion
          title="4. Watermarks & branding"
          text="Watermarked output, brand stamps, &quot;upgrade to remove&quot; nag screens — these immediately drop a tool to the bottom tier no matter how good the conversion is."
        />
        <Criterion
          title="5. Performance"
          text="Wall-clock time from file upload to download-ready. Measured on a clean Chrome window, no cache, residential US broadband (~500 Mbps). Mobile timing tested on a 3-year-old mid-range Android over LTE."
        />
        <Criterion
          title="6. Edge-case behavior"
          text="What happens with a corrupt file? Encrypted PDF? File too large? Unicode filename with Vietnamese diacritics? We deliberately try to break each tool to surface failure modes the marketing pages won't tell you."
        />
      </div>

      <h2 id="ranking">How rankings are decided</h2>
      <p>
        Within each comparison post, tools are ranked by their <em>real usefulness for the defined task</em>. This often differs from a simple sum of the six rubric scores. A tool with mediocre output quality but a generous free tier and no signup might beat a slightly-better-quality tool that watermarks every output. Context matters; we document the context for each ranking decision in the post itself.
      </p>
      <p>
        Tools we recommend most strongly are often <strong>free or open-source with no affiliate program at all</strong>. If a paid tool earns a top spot, the post explains exactly which task it beats free alternatives on, and which tasks free alternatives still win. We explicitly flag affiliate links at the top of any post that contains them — see the <Link href="/disclosure/">Affiliate Disclosure</Link>.
      </p>

      <h2 id="test-environment">Test environment</h2>
      <p>
        For reproducibility, here is the exact environment used for the bulk of tests on this site:
      </p>
      <ul>
        <li><strong>Primary test machine</strong>: MacBook Pro M1 (8 GB RAM, macOS Sonoma)</li>
        <li><strong>Secondary test machine</strong>: Mid-range Windows 11 desktop (Ryzen 5, 16 GB RAM) — used for any test where Windows behavior differs (HEIC, font rendering, OS clipboard)</li>
        <li><strong>Browser</strong>: Chrome 140+ (default), Safari 18+ (for browser-side WebKit-specific tests), Firefox 130+ spot-checked</li>
        <li><strong>Network</strong>: Comcast residential gigabit (down ~500 Mbps measured, up ~25 Mbps) — typical US home broadband, not a data-center connection</li>
        <li><strong>Mobile</strong>: Google Pixel 7 on T-Mobile LTE, used for &quot;works on phone&quot; checks</li>
      </ul>
      <p>
        Each test is run at least twice to rule out network jitter or transient server issues. Results that swing widely between runs are noted explicitly in the post.
      </p>

      <h2 id="test-files">Test files we use</h2>
      <p>
        Where licensing allows, the input files we test against are publicly available on the {SITE_NAME} GitHub repository so you can verify our claims yourself or replicate the comparison on your machine.
      </p>
      <p>
        <a
          href="https://github.com/pickrack/pickrack/tree/main/test-fixtures"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-emerald-700 font-medium hover:underline"
        >
          <Github className="w-4 h-4" /> github.com/pickrack/pickrack/tree/main/test-fixtures <ExternalLink className="w-3 h-3" />
        </a>
      </p>
      <p>
        Common test artifacts include:
      </p>
      <ul>
        <li><code>contract-12mb-scanned.pdf</code> — a 28-page scanned contract with mixed orientation, used for compress / OCR / rotate testing</li>
        <li><code>iphone-photo-heic-4mb.heic</code> — a fresh iPhone 15 photo, used for HEIC conversion tests</li>
        <li><code>deck-45mb.pptx</code> — a PowerPoint with embedded fonts and image-heavy slides, used for PPTX↔PDF tests</li>
        <li><code>article-5kw.md</code> — a 5,000-word markdown article with code blocks, tables, and footnotes, used for markdown rendering and AI summarizer tests</li>
        <li><code>messy-csv.csv</code> — a CSV with quoted commas, embedded newlines, and mixed encodings, used for translation and parsing tests</li>
      </ul>

      <h2 id="conflicts">Conflicts of interest</h2>
      <p>
        We do not accept payment for positive reviews. We do not publish sponsored content disguised as editorial. We do not enter paid backlink exchanges. Every recommendation reflects what the reviewer would actually pick on a Tuesday afternoon for a real task.
      </p>
      <p>
        Some links on this site are affiliate links — clicking through and completing a paid signup earns {SITE_NAME} a commission. These are always disclosed at the top of posts that contain them, and they do not influence the ranking. The full list of affiliate programs we participate in (and the ones we&apos;ve specifically declined) is on the <Link href="/disclosure/">Affiliate Disclosure</Link> page.
      </p>
      <p>
        {SITE_NAME} is the founder&apos;s own product. When we recommend Pickrack tools alongside competitors, we&apos;re explicitly biased and we acknowledge that bias in the post. Where competitors genuinely beat our own tools on a task, we say so.
      </p>

      <h2 id="corrections">Corrections and updates</h2>
      <p>
        If a tool we recommend changes behavior — new pricing, removed feature, new dark pattern — we update the post and bump the &quot;Last reviewed&quot; date. We do not silently revise; significant corrections are noted in a footer block on the affected post.
      </p>
      <p>
        Found a factual error or an outdated detail? Three ways to flag it:
      </p>
      <ul>
        <li>Open an issue at <a href="https://github.com/pickrack/pickrack/issues" target="_blank" rel="noopener noreferrer">github.com/pickrack/pickrack/issues</a> with the URL and what&apos;s wrong</li>
        <li>Click <strong>Suggest an edit</strong> at the bottom of any blog post — opens GitHub&apos;s file editor for that exact MDX file</li>
        <li>Email <a href="mailto:hello@pickrack.com">hello@pickrack.com</a></li>
      </ul>

      <h2 id="what-we-dont-do">What we deliberately don&apos;t do</h2>
      <div className="not-prose my-6 grid sm:grid-cols-2 gap-3">
        <Reject text="Never accept payment for a positive review or ranking adjustment" />
        <Reject text="Never use AI to generate review verdicts — every conclusion is from a human running the actual tests" />
        <Reject text="Never recommend a paid tool just because its affiliate program pays better" />
        <Reject text="Never abandon old reviews — if a tool's situation changes, we update or retire the post" />
        <Reject text="Never publish synthetic benchmarks as if they were real-world tests" />
        <Reject text="Never link to tools we haven't personally used for the task in question" />
      </div>

      <h2 id="ai-assistance">On AI assistance in writing</h2>
      <p>
        Drafts may use AI tools for grammar checking, fact verification (with manual confirmation), translation of technical references, and brainstorming structure. Every published article on {SITE_NAME} is written and edited by a human, with first-hand testing of the tools described. We do not generate review verdicts with AI. We do not use AI to fabricate test results we haven&apos;t actually run.
      </p>
      <p>
        If you suspect a specific post was AI-generated and you&apos;re right, please flag it — that would be a quality lapse worth correcting. We use <Link href="/tools/ai/ai-grammar-checker/">our own AI grammar checker</Link> on most posts as the final pass before publish, but the substance is always human.
      </p>

      <h2 id="who-tests">Who runs the tests</h2>
      <p>
        Right now, everything on {SITE_NAME} is tested and written by founder{" "}
        <Link href="/authors/david-pham/">David Pham</Link>. If that ever changes — guest contributors, hired editors — we will add their profiles to the <Link href="/authors/">authors page</Link> and disclose any change in editorial structure publicly.
      </p>

      <p className="not-prose mt-10 flex flex-wrap gap-4">
        <Link href="/blog/" className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium">
          → Read our comparison posts
        </Link>
        <Link href="/authors/david-pham/" className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium">
          → About the editor
        </Link>
      </p>
    </article>
  );
}

function Criterion({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
      <p className="font-semibold text-gray-900 m-0 flex items-center gap-1.5">
        <FileText className="w-4 h-4 text-emerald-600" />
        {title}
      </p>
      <p className="text-sm text-gray-700 mt-2 mb-0 leading-relaxed">{text}</p>
    </div>
  );
}

function Reject({ text }: { text: string }) {
  return (
    <div className="rounded-xl border bg-rose-50 px-4 py-3 flex items-start gap-2" style={{ borderColor: "var(--color-border)" }}>
      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
      <p className="text-sm text-gray-800 m-0">{text}</p>
    </div>
  );
}
