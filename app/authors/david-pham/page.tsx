import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, MapPin, GraduationCap, Briefcase, Github, Twitter } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";
import { CONTACT_EMAIL } from "@/lib/policy-content";

const AUTHOR_NAME = "David Pham";
const AUTHOR_SLUG = "david-pham";
const AUTHOR_URL = `${SITE_URL}/authors/${AUTHOR_SLUG}/`;
const AUTHOR_IMAGE = `${SITE_URL}/authors/david-pham-256.png`;

const PAGE_DESCRIPTION = `${AUTHOR_NAME} is the founder and solo developer of ${SITE_NAME} — a privacy-first online tool suite. Based in San Jose, California. Former engineer at Adobe and Figma.`;

export const metadata: Metadata = {
  title: `${AUTHOR_NAME} — Founder of ${SITE_NAME}`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: AUTHOR_URL },
  openGraph: {
    title: `${AUTHOR_NAME} — Founder of ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    url: AUTHOR_URL,
    type: "profile",
    images: [{ url: AUTHOR_IMAGE, width: 256, height: 256, alt: AUTHOR_NAME }],
  },
  twitter: {
    card: "summary",
    title: `${AUTHOR_NAME} — Founder of ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    images: [AUTHOR_IMAGE],
  },
};

const PHILOSOPHY = [
  {
    title: "Free should mean free",
    body: "Watermarks, signup gates, and daily quotas are upsell funnels disguised as free tiers. I refuse to ship any of them.",
  },
  {
    title: "Privacy is a default, not a feature",
    body: "If a tool can run in the browser, it should. Your files belong on your device. Server processing only when there's no alternative.",
  },
  {
    title: "Open source as proof",
    body: "Privacy claims with closed source are marketing. With open source they're falsifiable — anyone can read the actual code that handles their data.",
  },
  {
    title: "Honest reviews over affiliate revenue",
    body: "If a paid tool earns a top spot in a comparison, it's because it genuinely beats the alternatives. Most paid tools don't.",
  },
];

const TOPICS = [
  "Privacy-first web development",
  "Browser-side PDF and image processing",
  "WebAssembly",
  "Web Crypto API",
  "Anthropic Claude API integration",
  "Next.js + TypeScript",
  "Indie SaaS economics",
  "Honest tool reviews",
];

export default function DavidPhamAuthorPage() {
  const recentPosts = getAllPosts()
    .filter((p) => p.author === AUTHOR_NAME)
    .slice(0, 6);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    givenName: "David",
    familyName: "Pham",
    jobTitle: "Founder & Solo Developer",
    description:
      "Founder and solo developer of Pickrack. Former software engineer at Adobe (Creative Cloud) and Figma (Plugin Platform). Based in San Jose, California. Computer Science graduate of San Jose State University.",
    image: AUTHOR_IMAGE,
    url: AUTHOR_URL,
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "San Jose State University",
      sameAs: "https://en.wikipedia.org/wiki/San_Jose_State_University",
    },
    knowsAbout: TOPICS,
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Jose",
      addressRegion: "CA",
      addressCountry: "US",
    },
    sameAs: [
      "https://twitter.com/pickrackdev",
      "https://github.com/pickrack",
    ],
  };

  const profilePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${AUTHOR_NAME} — Founder of ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    url: AUTHOR_URL,
    mainEntity: { "@id": `${AUTHOR_URL}#person` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Authors", item: `${SITE_URL}/authors/` },
        { "@type": "ListItem", position: 3, name: AUTHOR_NAME, item: AUTHOR_URL },
      ],
    },
  };

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }} />

      {/* Hero */}
      <header className="rounded-3xl border bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 sm:p-10 mb-10" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
          <Image
            src="/authors/david-pham-256.png"
            alt={`${AUTHOR_NAME} avatar`}
            width={160}
            height={160}
            className="rounded-2xl ring-4 ring-emerald-100 shrink-0"
            priority
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
              Founder &amp; Solo Developer
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              {AUTHOR_NAME}
            </h1>
            <p className="mt-3 text-lg text-gray-600 leading-relaxed">
              I build {SITE_NAME} — a free, privacy-first online tool suite of {" "}
              <Link href="/tools/" className="text-emerald-700 font-medium hover:underline">
                51 browser-side and server-side tools
              </Link>{" "}
              that never gate downloads behind a signup, never watermark output, and never log your files.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-700">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" /> San Jose, California
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" /> San Jose State University, &apos;14
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" /> ex-Adobe, ex-Figma
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <a
                href="https://twitter.com/pickrackdev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-white hover:border-emerald-400 text-gray-800"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Twitter className="w-3.5 h-3.5 text-emerald-600" /> @pickrackdev
              </a>
              <a
                href="https://github.com/pickrack"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-white hover:border-emerald-400 text-gray-800"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Github className="w-3.5 h-3.5 text-emerald-600" /> github.com/pickrack
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-white hover:border-emerald-400 text-gray-800"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Mail className="w-3.5 h-3.5 text-emerald-600" /> {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Bio */}
      <section className="prose prose-lg max-w-none mb-12">
        <h2>Background</h2>
        <p>
          I grew up in San Jose, California, and studied Computer Science at <a href="https://en.wikipedia.org/wiki/San_Jose_State_University" target="_blank" rel="noopener noreferrer">San Jose State University</a> from 2010 to 2014. SJSU has been quietly feeding Silicon Valley engineering teams for decades — it&apos;s not as flashy as Stanford or Berkeley, but the alumni network in San Jose tech is dense, and most of my professional life since has been shaped by people I first met in CS classes there.
        </p>
        <p>
          From 2014 to 2018 I worked at <strong>Adobe</strong> in San Jose, on the backend of Creative Cloud — specifically the licensing service that decides whether the copy of Photoshop you opened this morning is allowed to launch. It&apos;s the kind of system millions of users depend on without ever thinking about, which means a single bad deploy ruins thousands of mornings. I learned to be extremely careful, to over-test, and to treat reliability as a feature rather than a chore.
        </p>
        <p>
          In 2018 I moved to <strong>Figma</strong> in San Francisco, joining the team building the plugin platform. Plugins were brand-new for Figma back then, and the platform team was small enough that I touched both the sandbox runtime and the API design. The four years I spent there taught me how much developer ergonomics matter — a tool with a great API gets extended by its community; a tool with a hostile API just gets abandoned. It also gave me a front-row seat to a company that grew from a few hundred employees to a few thousand, with all the cultural drift that implies.
        </p>
        <p>
          I left Figma in mid-2022 to go solo. The first six months were a lot of experimentation — a Stripe-billing analytics dashboard, a Notion automation, a SaaS for managing Apple Business Manager. None of them worked the way I wanted. What did stick was the realization that I personally used free online utilities — PDF tools, image converters, dev utilities — every single week, and almost every one of them was actively hostile in some small way. I started writing replacements for fun, and after a year of tinkering they had grown into a coherent collection. That collection became {SITE_NAME}.
        </p>

        <h2>Why {SITE_NAME} exists</h2>
        <p>
          The free-tools-with-dark-patterns model is a sales funnel disguised as utility. The real product is the upsell — the watermarked PDF that drives you to subscribe, the &quot;2 free conversions per day&quot; quota that breaks you when you need a third, the email gate that turns you into a marketing-list lead. Once I noticed this pattern, I couldn&apos;t un-notice it. Almost every &quot;free&quot; tool site I&apos;d ever used was doing some version of it.
        </p>
        <p>
          {SITE_NAME} is the opposite. There is no Pro tier. There is no email gate. There is no watermark on output. The only quotas are on the AI tools — where I pay Anthropic per API call, so 10 requests per day per IP keeps my monthly bill bounded. Everything else is unlimited.
        </p>
        <p>
          The site is funded by display advertising on text-content pages (blog posts and category hubs, never on AI tool pages where ads degrade the experience) and modest affiliate commissions on review posts that link to paid tools I genuinely use. That&apos;s the entire business model. There is no plan for a premium tier, no plan for a paid newsletter, no plan to gate tools behind signup.
        </p>

        <h2>How I work</h2>
        <p>
          {SITE_NAME} is a one-person operation: I write the code, design the UI, write the blog posts, answer support email, and pay the server bill. The site runs on a single homeserver in California behind Cloudflare — no AWS, no Vercel, no GCP. That keeps fixed costs around $40/month total, which makes the &quot;free forever&quot; promise actually sustainable.
        </p>
        <p>
          For comparison and best-of articles, I follow a consistent process: define a real-world task (not a synthetic benchmark), test 5-10 candidate tools on that task, note results honestly (including the edge cases that broke), rank by genuine usefulness — not by what pays the highest affiliate commission — and explicitly note when paid tools beat free alternatives, and when they don&apos;t.
        </p>
      </section>

      {/* Philosophy */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-5">Editorial principles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PHILOSOPHY.map((p) => (
            <div key={p.title} className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
              <h3 className="text-base font-semibold text-gray-900 m-0">{p.title}</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Topics I write about */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">Topics I write about</h2>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <span
              key={t}
              className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-sm border border-emerald-100"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Recent articles */}
      {recentPosts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Recent articles by {AUTHOR_NAME}</h2>
            <Link href="/blog/" className="text-sm text-emerald-700 hover:underline">All articles →</Link>
          </div>
          <div className="grid gap-4">
            {recentPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}/`}
                className="block rounded-2xl border bg-white p-5 hover:border-emerald-400 transition group"
                style={{ borderColor: "var(--color-border)" }}
              >
                <p className="text-xs text-gray-500 mb-1">
                  <time dateTime={p.date}>
                    {new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                  {" · "}{p.readingTime}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 m-0">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{p.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="rounded-2xl border bg-gradient-to-br from-emerald-50 to-white p-6 sm:p-8" style={{ borderColor: "var(--color-border)" }}>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 m-0">Get in touch</h2>
        <p className="mt-2 text-gray-700">
          The fastest way to reach me is email. I try to respond within a few business days.
        </p>
        <p className="mt-1 text-sm text-gray-600">
          I do not accept guest post pitches, sponsored content offers, paid backlink exchange requests, or &quot;collaborations&quot; that are thinly disguised marketing.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 text-sm"
          >
            <Mail className="w-4 h-4" /> {CONTACT_EMAIL}
          </a>
          <Link
            href="/about/"
            className="inline-flex items-center gap-1 rounded-xl border bg-white hover:border-emerald-400 text-gray-800 font-medium px-4 py-2 text-sm"
            style={{ borderColor: "var(--color-border)" }}
          >
            About {SITE_NAME} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </article>
  );
}
