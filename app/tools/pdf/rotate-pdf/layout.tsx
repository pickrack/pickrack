import type { Metadata } from "next";
import { buildToolMetadata, buildToolJsonLd } from "@/lib/tool-seo";
import { getToolContent, buildFAQJsonLd, buildHowToJsonLd } from "@/lib/tool-content";
import ToolContentSection from "@/components/ToolContentSection";

const SLUG = "rotate-pdf";

export const metadata: Metadata = buildToolMetadata(SLUG) ?? {};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = buildToolJsonLd(SLUG);
  const content = getToolContent(SLUG);
  const faqLd = buildFAQJsonLd(SLUG);
  const howToLd = buildHowToJsonLd(SLUG);

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
