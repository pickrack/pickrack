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

export default function AIHubPage() {
  return <CategoryHub categoryId="ai" faq={FAQ} />;
}
