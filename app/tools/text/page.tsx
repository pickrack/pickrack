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

export default function TextHubPage() {
  return <CategoryHub categoryId="text" faq={FAQ} />;
}
