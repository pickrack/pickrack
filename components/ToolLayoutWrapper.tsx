import { buildToolJsonLd, getToolBreadcrumbItems } from "@/lib/tool-seo";
import { buildFAQJsonLd, buildHowToJsonLd } from "@/lib/tool-content";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ToolContentSection from "@/components/ToolContentSection";
import { getToolContent } from "@/lib/tool-content";

export default function ToolLayoutWrapper({
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
  const breadcrumbItems = getToolBreadcrumbItems(slug);

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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {breadcrumbItems && <BreadcrumbNav items={breadcrumbItems} />}
      </div>
      {children}
      {content && <ToolContentSection content={content} />}
    </>
  );
}
