import { buildToolJsonLd } from "@/lib/tool-seo";
import { getToolContent, buildFAQJsonLd, buildHowToJsonLd } from "@/lib/tool-content";
import ToolContentSection from "@/components/ToolContentSection";

/**
 * Reusable shell for tool route layouts. Each /tools/<cat>/<slug>/layout.tsx imports this
 * and passes only the slug — eliminates 30+ lines of duplicate JSON-LD wiring per tool.
 */
export default function ToolLayoutShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const jsonLd = buildToolJsonLd(slug);
  const content = getToolContent(slug);
  const faqLd = buildFAQJsonLd(slug);
  const howToLd = buildHowToJsonLd(slug);

  return (
    <>
      {jsonLd && (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.softwareApp) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumb) }} />
        </>
      )}
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      {howToLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />}
      {children}
      {content && <ToolContentSection content={content} />}
    </>
  );
}
