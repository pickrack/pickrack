import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Image as ImageIcon, Sparkles, Code2, Type, Calculator } from "lucide-react";
import { TOOLS } from "@/lib/tools";
import { listCategories, type Category } from "@/lib/categories";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "All Free Online Tools — PDF, Image, AI, Developer, Text",
  description:
    "Browse every Pickrack tool: PDF, image, AI, developer, text, and calculator utilities. All free, no signup, no daily limit, no watermark. Most run in your browser.",
  alternates: { canonical: `${SITE_URL}/tools/` },
};

const CATEGORY_ICONS: Record<Category["iconName"], React.ComponentType<{ className?: string }>> = {
  FileText,
  Image: ImageIcon,
  Sparkles,
  Code2,
  Type,
  Calculator,
};

export default function AllToolsPage() {
  const availableTools = TOOLS.filter((t) => t.available);
  const categories = listCategories();

  // CollectionPage + ItemList JSON-LD with every tool
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `All Pickrack Tools`,
    description: "Free online tools for PDF, image, AI, developer, text, and calculator tasks.",
    url: `${SITE_URL}/tools/`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: availableTools.length,
      itemListElement: availableTools.map((tool, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "WebApplication",
          name: tool.name,
          description: tool.description,
          url: `${SITE_URL}/tools/${tool.category}/${tool.slug}/`,
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
      { "@type": "ListItem", position: 2, name: "All Tools", item: `${SITE_URL}/tools/` },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          All free online tools — {availableTools.length} and growing
        </h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Every Pickrack tool in one catalog. PDF converters, image utilities, AI workflows, developer helpers, text utilities, and everyday calculators. All free, no signup, no daily limit, no watermark.
        </p>
      </header>

      {/* By-category sections */}
      {categories.map((cat) => {
        const tools = TOOLS.filter((t) => t.category === cat.id && t.available);
        if (tools.length === 0) return null;
        const Icon = CATEGORY_ICONS[cat.iconName];

        return (
          <section key={cat.id} className="mb-14">
            <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${cat.bgColor} ${cat.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{cat.name}</h2>
                  <p className="text-sm text-gray-500">{cat.tagline}</p>
                </div>
              </div>
              <Link
                href={`/tools/${cat.slug}/`}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                View {cat.name} hub →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${cat.slug}/${tool.slug}/`}
                  className="group block rounded-2xl border bg-white p-5 hover:border-emerald-400 hover:shadow-md transition"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <h3 className={`font-bold text-base mb-1 group-hover:text-emerald-600 transition`}>
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
