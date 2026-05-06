import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Lock, FileText, Image as ImageIcon, Sparkles, Code2, Type, Calculator } from "lucide-react";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";
import { TOOLS } from "@/lib/tools";
import { listCategories, type Category } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/` },
};

const CATEGORY_ICONS: Record<Category["iconName"], React.ComponentType<{ className?: string }>> = {
  FileText,
  Image: ImageIcon,
  Sparkles,
  Code2,
  Type,
  Calculator,
};

export default function HomePage() {
  const posts = getAllPosts().slice(0, 4);
  const totalTools = TOOLS.filter((t) => t.available).length;
  const categories = listCategories();

  // CollectionPage + ItemList JSON-LD for entire site catalog
  const catalogJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${SITE_NAME} — Free Online Tools`,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalTools,
      itemListElement: categories.map((cat, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "CollectionPage",
          name: cat.name,
          description: cat.tagline,
          url: `${SITE_URL}/tools/${cat.slug}/`,
        },
      })),
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogJsonLd) }} />

      {/* Hero */}
      <section className="py-16 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 mb-6">
          <Shield className="w-3 h-3" /> Privacy-first · {totalTools}+ free tools · No signup
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
          Free online tools that <span className="text-emerald-600">respect your privacy</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          PDF, image, AI, developer, text, and calculator tools — all in one place. Most run in your browser so files never leave your device. No signup, no daily limit, no watermark.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 transition"
          >
            Browse all {totalTools} tools <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 rounded-full border bg-white hover:bg-gray-50 font-medium px-6 py-3 transition"
            style={{ borderColor: "var(--color-border)" }}
          >
            Read the guides
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-600">
          <div className="inline-flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-600" /> Browser-side privacy</div>
          <div className="inline-flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-600" /> No quota, ever</div>
          <div className="inline-flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-600" /> No signup required</div>
        </div>
      </section>

      {/* Category cards */}
      <section className="py-12 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Pick your toolkit</h2>
          <p className="mt-3 text-gray-600">Six categories, one privacy-respecting site. Click a category to see every tool inside.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.iconName];
            const tools = getToolsByCategory(cat.id);
            const count = tools.length;
            return (
              <Link
                key={cat.id}
                href={`/tools/${cat.slug}/`}
                className="group block rounded-2xl border bg-white p-6 transition hover:border-emerald-400 hover:shadow-md"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${cat.bgColor} ${cat.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                    {count} tool{count === 1 ? "" : "s"}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-600 transition">{cat.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{cat.tagline}</p>
                {tools.length > 0 && (
                  <div className="mt-4 pt-4 border-t flex flex-wrap gap-1.5" style={{ borderColor: "var(--color-border)" }}>
                    {tools.slice(0, 4).map((t) => (
                      <span key={t.slug} className="text-xs text-gray-500 bg-gray-50 rounded-md px-2 py-0.5">
                        {t.name}
                      </span>
                    ))}
                    {tools.length > 4 && (
                      <span className="text-xs text-emerald-600 font-medium px-2 py-0.5">
                        +{tools.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Pickrack */}
      <section className="py-12 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">Privacy by design</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Most tools run entirely in your browser. Your files, JSON tokens, passwords, and text never upload to a server. Server-side tools (PDF compression, AI) are explicitly labeled and delete inputs immediately.
            </p>
          </div>
          <div>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">No quota, no signup</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Smallpdf limits free users to 2 tasks/day. Sejda allows 3 per hour. Pickrack has no daily limit, no task counter, no signup wall — use as much as you need.
            </p>
          </div>
          <div>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">Open-source where it matters</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Browser-side tools are auditable. Underlying engines (pdf-lib, qpdf, Ghostscript, LibreOffice, Calibre, Tesseract) are all open-source so the code is verifiable.
            </p>
          </div>
        </div>
      </section>

      {/* Latest articles */}
      {posts.length > 0 && (
        <section className="py-16 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Latest guides</h2>
            <Link href="/blog" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              All articles →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
