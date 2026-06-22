import type { Metadata } from "next";
import CategoryHub from "@/components/CategoryHub";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Free Text Tools — Word Counter, Case Converter, Lorem Ipsum, Diff",
  description:
    "Free text utilities for writers, editors, and developers. Word counter, case converter, Lorem Ipsum generator, slug maker, diff checker. All browser-side, no signup.",
  alternates: { canonical: `${SITE_URL}/tools/text/` },
};

const FAQ = [
  {
    q: "Who uses these tools?",
    a: "Writers (word counters for SEO articles, essays), editors (case conversion, diff checking), marketers (slug generators for URLs), and developers (Lorem Ipsum for mockups). Anyone who works with text regularly will find one or two tools they use daily.",
  },
  {
    q: "Do these tools work for non-English text?",
    a: "Word counter handles Vietnamese, Spanish, French, German correctly (whitespace-separated). Chinese/Japanese (no spaces) is approximate but still useful for length comparison. Case conversion is Unicode-aware. Slug generation supports diacritic stripping for Vietnamese (đ → d, etc.).",
  },
  {
    q: "Is there a maximum text length?",
    a: "No hard limit. Browsers handle ~5MB of text comfortably in a textarea. Beyond that, performance drops — copy in chunks if needed.",
  },
  {
    q: "How is reading time calculated?",
    a: "Default is 200 words per minute (average adult silent reading). Adjust for your audience: ~150 wpm for read-aloud, ~250 wpm for fast readers. The word counter tool shows live estimates as you type.",
  },
  {
    q: "Can I save my text or count history?",
    a: "v1 tools are stateless — refresh and your text is gone (privacy benefit). For drafts, save to a separate document or a private Notion page. localStorage history is on the roadmap.",
  },
  {
    q: "What's the difference between case converter and Title Case at Wikipedia?",
    a: "Case converter applies one of: UPPERCASE, lowercase, Title Case (capitalize each word), Sentence case (first word + names), or aLtErNaTiNg cAsE (joke). Wikipedia-style title case has specific rules (lowercase short words like 'the', 'of', 'a') — that's a more nuanced editorial choice not yet in our tool.",
  },
];

const intro = (
  <>
    <h2>Why writers, editors, and devs end up here daily</h2>
    <p>
      Text utilities are the most boring category of online tool — and the most used. A word counter sees more daily traffic than most popular SaaS products. A slug generator is opened thousands of times by marketers and developers every workday. Lorem Ipsum is generated more than any other piece of placeholder text in the world. None of this requires elaborate UI or AI; it requires a fast, ad-light page that does exactly one thing well.
    </p>
    <p>
      Pickrack&apos;s ten text tools are built that way: each is one page, one input box, instant output, no signup, no popup. They are calibrated for the people who actually use them — SEO writers checking word count against a 1,500-word target, editors converting messy ALL-CAPS subject lines to Sentence case, content marketers turning &quot;Bí quyết tối ưu hóa SEO 2026&quot; into a clean URL slug like <code>bi-quyet-toi-uu-hoa-seo-2026</code>, and developers filling a layout mockup with realistic placeholder paragraphs.
    </p>
    <h2>The ten text tools and when to reach for each</h2>
    <ul>
      <li><strong><a href="/tools/text/word-counter/">Word Counter</a></strong> — counts words, characters (with and without spaces), sentences, paragraphs, and reading time at 200 words per minute. Live updates as you type. Best for SEO articles, essays, novellas, anything with a length constraint.</li>
      <li><strong><a href="/tools/text/case-converter/">Case Converter</a></strong> — 9 conversion variants: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and aLtErNaTiNg cAsE. Unicode-aware so Vietnamese, German umlauts, and other diacritics survive correctly.</li>
      <li><strong><a href="/tools/text/lorem-ipsum/">Lorem Ipsum Generator</a></strong> — generate 1-50 paragraphs of realistic Lorem Ipsum for layout mockups. Adjustable paragraph length and starting clause (&quot;Lorem ipsum dolor sit amet...&quot; vs random). Best for design wireframes and HTML/CSS prototype layouts.</li>
      <li><strong><a href="/tools/text/slug-generator/">Slug Generator</a></strong> — convert any text into a clean URL slug. Strips diacritics correctly for Vietnamese (handles the special <code>đ → d</code> rule that most generic libraries miss), Spanish, French, German. Lowercase, hyphen-separated, safe for any URL system.</li>
    </ul>
    <h2>Why Vietnamese diacritic handling is harder than it looks</h2>
    <p>
      Most slug generators implement diacritic stripping with the same one-liner: <code>str.normalize(&quot;NFD&quot;).replace(/[̀-ͯ]/g, &quot;&quot;)</code>. This decomposes accented characters into base letter + combining mark, then strips the combining marks. It works for most European diacritics — <code>é → e</code>, <code>ñ → n</code>, <code>ü → u</code> — but fails for Vietnamese <code>đ</code> (the &quot;d with bar&quot;), which is a single Unicode code point with no decomposition.
    </p>
    <p>
      Pickrack&apos;s slug generator handles this correctly with a special-case replacement before the NFD normalize: <code>đ → d</code> and <code>Đ → D</code>. The result is what Vietnamese SEO writers expect: <code>điện thoại</code> becomes <code>dien-thoai</code>, not <code>ien-thoai</code>. If you maintain Vietnamese-language sites, this matters. (Source: <a href="https://github.com/pickrack/pickrack/blob/main/app/tools/text/slug-generator/page.tsx" target="_blank" rel="noopener noreferrer">slug-generator/page.tsx</a>.)
    </p>
  </>
);

export default function TextHubPage() {
  return <CategoryHub categoryId="text" intro={intro} faq={FAQ} />;
}
