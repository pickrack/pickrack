import type { Metadata } from "next";
import { Mail, Twitter, Github } from "lucide-react";
import { CONTACT_EMAIL, buildWebPageJsonLd } from "@/lib/policy-content";
import { SITE_NAME, SITE_URL, SOCIAL } from "@/lib/site-config";

const PAGE_DESCRIPTION = `Get in touch with ${SITE_NAME}. Tips, corrections, and feedback welcome.`;

export const metadata: Metadata = {
  title: "Contact",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/contact/` },
};

export default function ContactPage() {
  const jsonLd = buildWebPageJsonLd("contact", "Contact", PAGE_DESCRIPTION);
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
      <p className="mt-4 text-lg text-gray-600 leading-relaxed">
        Have a tool to recommend, a correction to flag, or just a question? Reach out — we read every message.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="group flex items-start gap-4 rounded-2xl border bg-white p-5 hover:border-emerald-400 hover:shadow-md transition"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold group-hover:text-emerald-600 transition">Email</h2>
            <p className="text-sm text-gray-600 mt-1 break-all">{CONTACT_EMAIL}</p>
            <p className="text-xs text-gray-500 mt-2">Best for: tips, corrections, press, business inquiries</p>
          </div>
        </a>

        <a
          href={SOCIAL.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-4 rounded-2xl border bg-white p-5 hover:border-emerald-400 hover:shadow-md transition"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Twitter className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold group-hover:text-emerald-600 transition">Twitter / X</h2>
            <p className="text-sm text-gray-600 mt-1">@pickrack</p>
            <p className="text-xs text-gray-500 mt-2">Best for: quick public questions, latest article notifications</p>
          </div>
        </a>

        <a
          href={SOCIAL.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-4 rounded-2xl border bg-white p-5 hover:border-emerald-400 hover:shadow-md transition"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Github className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold group-hover:text-emerald-600 transition">GitHub</h2>
            <p className="text-sm text-gray-600 mt-1">github.com/pickrack</p>
            <p className="text-xs text-gray-500 mt-2">Best for: technical issues, code suggestions, open-source collaboration</p>
          </div>
        </a>
      </div>

      <div className="mt-10 rounded-2xl border bg-gray-50 p-6 text-sm text-gray-700 leading-relaxed" style={{ borderColor: "var(--color-border)" }}>
        <h2 className="font-semibold mb-3 text-gray-900">A few notes</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>We aim to respond to email within 3-5 business days. Solo operation — please be patient.</li>
          <li>We do <strong>not</strong> accept guest post pitches, sponsored content offers, or backlink exchange requests. These will be ignored.</li>
          <li>Press and media inquiries: please specify deadline and include relevant context in the first email.</li>
          <li>Privacy or legal concerns related to your data: see our <a href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>.</li>
        </ul>
      </div>
    </article>
  );
}
