import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { TOOLS } from "@/lib/tools";
import { getCategory } from "@/lib/categories";
import NewToolsBadge, { isNewTool } from "@/components/NewToolsBadge";

const POPULAR_SLUGS = [
  "merge-pdf",
  "compress-pdf",
  "image-compressor",
  "qr-generator",
  "ai-summarizer",
  "background-remover",
];

export default function PopularTools() {
  const tools = POPULAR_SLUGS
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter((t): t is typeof TOOLS[0] => t !== undefined && t.available);

  return (
    <section className="py-12 border-t" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="w-5 h-5 text-emerald-600" />
        <h2 className="text-2xl sm:text-3xl font-bold">Popular tools</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {tools.map((tool) => {
          const cat = getCategory(tool.category);
          return (
            <Link
              key={tool.slug}
              href={`/tools/${cat.slug}/${tool.slug}/`}
              className="group relative rounded-xl border bg-white p-4 hover:border-emerald-400 hover:shadow-md transition"
              style={{ borderColor: "var(--color-border)" }}
            >
              {isNewTool(tool.slug) && (
                <div className="absolute top-3 right-3">
                  <NewToolsBadge />
                </div>
              )}
              <div className={`text-2xl mb-2 ${tool.iconColor}`}>
                {/* Tool name initial as simple icon placeholder */}
                <span className="text-sm font-bold">{tool.name.split(" ")[0].slice(0, 1)}</span>
              </div>
              <h3 className="font-semibold text-sm text-gray-900 group-hover:text-emerald-600 transition line-clamp-2">
                {tool.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tool.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Explore all tools <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
