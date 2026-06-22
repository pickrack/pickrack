"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

const faqs = [
  {
    q: "Are these tools really free forever?",
    a: "Yes. Pickrack is free and always will be — no hidden paywalls, no premium tier, no daily limits. We're funded by transparent sponsorships and GitHub stars from users who believe in privacy-first tooling.",
  },
  {
    q: "Do files get uploaded to your server?",
    a: "Most tools run entirely in your browser — files never leave your device. Server-side tools (PDF compress, convert, password unlock) upload only your file, process it, delete it immediately, and log nothing. All traffic is HTTPS-encrypted.",
  },
  {
    q: "How is Pickrack different from Smallpdf or iLovePDF?",
    a: "Pickrack offers no signup required, unlimited daily usage, browser-side processing when possible, no watermarks, and transparent privacy. Competitors charge per use, require signups, limit free users to 2–3 daily conversions, and monetize uploaded files.",
  },
  {
    q: "Which tools work offline?",
    a: "Browser-side tools (merge PDF, compress image, JSON formatter, etc.) work offline once loaded. Server-side tools (PDF password unlock, AI summarizer, image upscaling) need internet to process.",
  },
];

export default function HomepageFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="py-12 border-t" style={{ borderColor: "var(--color-border)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Common questions</h2>

        <div className="space-y-3">
          {faqs.map((item, idx) => (
            <details
              key={idx}
              open={open === idx}
              onClick={(e) => {
                e.preventDefault();
                setOpen(open === idx ? null : idx);
              }}
              className="rounded-lg border bg-white cursor-pointer group"
              style={{ borderColor: "var(--color-border)" }}
            >
              <summary className="px-5 py-4 font-semibold text-gray-900 flex items-center justify-between hover:text-emerald-600 transition select-none">
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition ${open === idx ? "rotate-180" : ""}`}
                />
              </summary>
              {open === idx && (
                <div className="px-5 py-4 border-t text-gray-600 text-sm leading-relaxed" style={{ borderColor: "var(--color-border)" }}>
                  {item.a}
                </div>
              )}
            </details>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          More questions? Check out the <a href="/methodology/" className="text-emerald-600 hover:underline">methodology page</a> or open an issue on{" "}
          <a href="https://github.com/pickrack/pickrack/discussions" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
            GitHub Discussions
          </a>
          .
        </div>
      </div>
    </section>
  );
}
