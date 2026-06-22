import type { Metadata } from "next";
import CategoryHub from "@/components/CategoryHub";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Free AI Tools — Summarize, Translate, Chat with PDF, Transcribe",
  description:
    "Privacy-respecting AI tools powered by Anthropic Claude. Summarize URLs, translate documents, chat with PDFs, transcribe audio. No data brokers, no training on your content.",
  alternates: { canonical: `${SITE_URL}/tools/ai/` },
};

const FAQ = [
  {
    q: "What AI model powers these tools?",
    a: "Anthropic Claude — primarily Haiku 4.5 for fast everyday tasks (summarization, translation), and Sonnet 4.6 or Opus 4.7 for higher-complexity work (long-document chat). Anthropic's data policy: API inputs are not used for training, retained for 30 days for abuse monitoring, then deleted.",
  },
  {
    q: "How is this different from ChatGPT or Gemini?",
    a: "Pickrack AI tools are task-specific (summarize, translate, transcribe) rather than open-ended chat. You don't need a signup, you don't see ads in the response, and we don't show recommended prompts to nudge you toward upselling. Each tool has a focused UX optimized for its task.",
  },
  {
    q: "Are there usage limits?",
    a: "Yes — anonymous users get a daily allowance per tool (typically 5-10 requests/day) to keep API costs sustainable. Heavy users can email us for an increased quota or run the underlying open-source pipelines locally.",
  },
  {
    q: "Is my data used to train AI?",
    a: "No. Anthropic's commercial API agreement explicitly excludes API inputs from training data. Pickrack does not store your inputs or outputs beyond the duration of the request.",
  },
  {
    q: "Can these tools handle Vietnamese, Chinese, Spanish, etc.?",
    a: "Yes — Claude is highly multilingual. Summarization and translation work well across all major languages. For best results in low-resource languages, specify the language explicitly in your input.",
  },
  {
    q: "What happens if a tool fails?",
    a: "If the AI service is unavailable, you'll see a clear error message. No charges or counts are deducted from your daily allowance for failed requests. Try again or contact us if errors persist.",
  },
];

const intro = (
  <>
    <h2>What &quot;privacy-respecting AI&quot; means here</h2>
    <p>
      The phrase &quot;AI tools&quot; on a free website usually means one of two things: either a wrapper around OpenAI&apos;s API that funnels your input through a third-party reseller (often with extra logging, sometimes with fingerprinting), or a custom in-house model trained on whatever the operator could scrape. Both raise questions about who sees your text, what they do with it, and how long they keep it. Pickrack&apos;s six AI tools do something different: they <strong>call Anthropic&apos;s Claude API directly</strong> from the server, send only the text you typed (or, for Chat with PDF and Translate Document, the text extracted from your PDF inside your browser), and receive only the response. There is no third-party data broker in the middle.
    </p>
    <p>
      Specifically, the data flow for each AI tool is: your text leaves the browser over HTTPS, hits the Pickrack API route, the route validates input length and applies a per-IP rate limit (10 requests per 24 hours), then forwards the text to Anthropic. Anthropic processes the text with <strong>Claude Haiku 4.5</strong>, returns a response, and the response is streamed back to your browser. Pickrack does not log the input, does not log the output, does not log any identifying metadata beyond the rate-limit counter (which contains no text). Anthropic&apos;s commercial API terms exclude API inputs from training data and retain inputs for at most 30 days for abuse monitoring before deletion.
    </p>
    <h2>The six AI tools and when to use each</h2>
    <ul>
      <li><strong><a href="/tools/ai/ai-summarizer/">AI Summarizer</a></strong> — paste up to 12,000 characters of text (about 6 pages or 2,000 English words), get a 3-5 paragraph summary. Best for blog posts, articles, meeting transcripts, long emails. For PDF input, run <a href="/tools/pdf/pdf-to-markdown/">PDF to Markdown</a> first, then paste the Markdown.</li>
      <li><strong><a href="/tools/ai/ai-translator/">AI Translator</a></strong> — translate text between 20 supported languages with format preservation. 8,000 characters per request, 1,500-2,000 English words. Best for marketing copy, casual messages, blog posts. For high-stakes content (contracts, medical), always have a human translator review.</li>
      <li><strong><a href="/tools/ai/ai-grammar-checker/">AI Grammar Checker</a></strong> — paste up to 6,000 characters and get grammar, punctuation, and clarity suggestions. Works in English and Vietnamese (catches diacritic errors, common chính tả mistakes, basic grammar). Less aggressive on style preferences (Oxford comma, em-dash usage) than tools like Grammarly.</li>
      <li><strong><a href="/tools/ai/youtube-summarizer/">YouTube Video Summarizer</a></strong> — paste a YouTube URL, get a Claude summary of the captions. Short/medium/long output. Requires the video to have captions (auto-generated works). Daily quota 10/IP.</li>
      <li><strong><a href="/tools/ai/chat-with-pdf/">Chat with PDF</a></strong> — upload a PDF and ask questions about it. The PDF is parsed in your browser using pdf.js; only the extracted text + your question reaches our server. Multi-turn chat with context. Daily quota 30 turns/IP.</li>
      <li><strong><a href="/tools/ai/translate-document/">Translate Document</a></strong> — translate text, markdown, HTML, CSV, JSON, or PDF documents into 20 languages while preserving formatting. Chunks long documents into ~3500-char passes for consistent quality. Daily quota 5 documents/IP.</li>
    </ul>
    <h2>Why the daily quota</h2>
    <p>
      Each Anthropic API call costs me real money. Haiku 4.5 is one of the cheaper Claude models (around $0.0005 per typical tool invocation), but at scale that adds up. The 10 requests per 24 hours per IP quota is calibrated to keep total monthly cost under $5-10 even if traffic explodes. It is generous for casual users — most people will hit it less than once a month — and tight for abusers (someone trying to summarize a textbook page-by-page will run out and need to install <a href="https://github.com/anthropics/anthropic-sdk-python" target="_blank" rel="noopener noreferrer">the SDK locally</a> with their own API key).
    </p>
    <p>
      If you self-host Pickrack from the <a href="https://github.com/pickrack/pickrack" target="_blank" rel="noopener noreferrer">GitHub repo</a> with your own <code>ANTHROPIC_API_KEY</code>, the rate limit is configurable in <code>lib/rate-limit.ts</code> — you can raise it, lower it, or remove it entirely. Source for each AI route is at <a href="https://github.com/pickrack/pickrack/tree/main/app/api/ai" target="_blank" rel="noopener noreferrer">app/api/ai</a> and the Anthropic wrapper is at <code>lib/anthropic.ts</code>.
    </p>
  </>
);

export default function AIHubPage() {
  return <CategoryHub categoryId="ai" intro={intro} faq={FAQ} />;
}
