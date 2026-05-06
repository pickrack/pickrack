import Link from "next/link";
import { FileText, Image as ImageIcon, Sparkles, Code2, Type, Calculator } from "lucide-react";
import { getCategory, type CategoryId, type Category } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

const CATEGORY_ICONS: Record<Category["iconName"], React.ComponentType<{ className?: string }>> = {
  FileText,
  Image: ImageIcon,
  Sparkles,
  Code2,
  Type,
  Calculator,
};

type Props = {
  categoryId: CategoryId;
  /** Optional FAQ items shown at bottom of hub */
  faq?: { q: string; a: string }[];
};

export default function CategoryHub({ categoryId, faq = [] }: Props) {
  const category = getCategory(categoryId);
  const tools = getToolsByCategory(categoryId).filter((t) => t.available);
  const Icon = CATEGORY_ICONS[category.iconName];
  const url = `${SITE_URL}/tools/${category.slug}/`;

  // CollectionPage + ItemList schema
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "WebApplication",
          name: tool.name,
          description: tool.description,
          url: `${SITE_URL}/tools/${category.slug}/${tool.slug}/`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools/` },
      { "@type": "ListItem", position: 3, name: category.name, item: url },
    ],
  };

  const faqJsonLd = faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } : null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <header className="mb-10 max-w-3xl">
        <div className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${category.iconColor} ${category.bgColor} rounded-full px-3 py-1 mb-4`}>
          <Icon className="w-3 h-3" /> Free {category.name}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          {category.name} — {category.tagline}
        </h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          {category.description}
        </p>
      </header>

      {/* Tool grid */}
      {tools.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${category.slug}/${tool.slug}/`}
              className="group block rounded-2xl border bg-white p-5 transition hover:border-emerald-400 hover:shadow-md"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${category.bgColor} ${tool.iconColor} mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-base mb-1 group-hover:text-emerald-600 transition">
                {tool.name}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-10 text-center" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-gray-600">More {category.shortLabel.toLowerCase()} tools coming soon.</p>
          <Link href="/tools" className="mt-3 inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
            Browse other tools →
          </Link>
        </div>
      )}

      {/* Why use these tools */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Why use these tools?</h2>
        <ul className="space-y-3 text-gray-700 leading-relaxed">
          <li><strong>Privacy first.</strong> Browser-side tools process your data locally. Server-side tools are explicitly labeled and delete inputs immediately after response.</li>
          <li><strong>Free, forever.</strong> No daily limits, no watermarks, no signup, no premium tier.</li>
          <li><strong>No tracking inside the tool.</strong> Tools have zero analytics on the data you process — site analytics (page views) are anonymous.</li>
          <li><strong>Open implementation.</strong> Underlying engines are open-source — verify the security model.</li>
        </ul>
      </section>

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently asked</h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <details key={i} className="group rounded-xl border bg-white p-4" style={{ borderColor: "var(--color-border)" }}>
                <summary className="cursor-pointer list-none font-semibold text-gray-900 flex items-center justify-between">
                  {item.q}
                  <span className="text-emerald-600 text-xl group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
