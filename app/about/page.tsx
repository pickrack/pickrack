import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, buildWebPageJsonLd } from "@/lib/policy-content";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

const PAGE_DESCRIPTION = `${SITE_NAME} is an independent publication reviewing free AI, PDF, and developer tools — built by a solo creator who actually uses them.`;

export const metadata: Metadata = {
  title: "About",
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
        {SITE_NAME} is an independent publication reviewing free AI, PDF, and developer tools — written by someone who actually uses them in real work.
      </p>

      <h2>Who runs this site</h2>
      <p>{SITE_NAME} is operated by an indie maker — a solo developer and content creator who has built and shipped multiple online tools for years. Most reviews on this site come from real, ongoing use of the products being reviewed, not from a one-time test.</p>

      <h2>Why this site exists</h2>
      <p>The internet is full of &quot;Top 50 best [X] tools 2026&quot; articles written by SEO content farms that never opened the apps they recommend. They rank by ad budget and affiliate payout, not by usefulness. The result is misleading lists that waste your time.</p>
      <p>{SITE_NAME} exists to be a small counterbalance: shorter lists, deeper testing, and honest opinions — including about tools that pay us nothing.</p>

      <h2>What we cover</h2>
      <ul>
        <li><strong>PDF tools</strong> — converters, mergers, OCR, editors, compressors</li>
        <li><strong>AI tools</strong> — LLMs (ChatGPT, Claude, Gemini), image generation, transcription, productivity</li>
        <li><strong>Developer stack</strong> — frameworks, deploy targets, monitoring, infrastructure for solo makers and small teams</li>
      </ul>

      <h2>How we test</h2>
      <p>For every category we review, we follow a consistent process:</p>
      <ol>
        <li>Define the real-world task (not a synthetic benchmark)</li>
        <li>Test 5-15 candidate tools using the same task</li>
        <li>Note results: output quality, free-tier limits, signup friction, watermarks, performance</li>
        <li>Rank by genuine usefulness — what we would actually pick on a Tuesday afternoon</li>
        <li>Note specifically when a paid tool beats the free alternatives, and when it doesn&#39;t</li>
      </ol>

      <h2>Editorial standards</h2>
      <ul>
        <li>We disclose affiliate relationships clearly (see <Link href="/disclosure">Affiliate Disclosure</Link>)</li>
        <li>We never accept payment for a positive review</li>
        <li>We will publicly correct factual errors when notified</li>
        <li>We never publish AI-generated articles. Drafts may use AI assistance for research and grammar, but every published piece is written and edited by a human who used the tools described</li>
      </ul>

      <h2>How we make money</h2>
      <p>Two streams:</p>
      <ul>
        <li><strong>Display advertising</strong> via Google AdSense — automatic, no editorial influence</li>
        <li><strong>Affiliate commissions</strong> — when readers buy products we link to. We disclose this on every post that contains affiliate links</li>
      </ul>
      <p>Both streams together let us keep the site free and ad-light. We have no plans for a paywall, premium tier, or paid newsletter.</p>

      <h2>What we&#39;re not</h2>
      <ul>
        <li>Not a tools directory or marketplace</li>
        <li>Not a SaaS company with a product to push</li>
        <li>Not a venture-backed media operation</li>
        <li>Not affiliated with any specific tool vendor</li>
      </ul>

      <h2>Contact</h2>
      <p>Reach out at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> for:</p>
      <ul>
        <li>Tip about a tool we should review</li>
        <li>Correction or factual feedback</li>
        <li>Press inquiry</li>
        <li>Other questions</li>
      </ul>
      <p>We try to respond within a few days. We do not accept guest post pitches, sponsored content offers, or backlink exchange requests.</p>

      <p className="not-prose mt-10">
        <Link href="/blog" className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium">
          → Browse all articles
        </Link>
      </p>
    </article>
  );
}
