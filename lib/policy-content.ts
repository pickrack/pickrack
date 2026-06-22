// Centralized policy metadata so update once, render in all pages.
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const POLICY_LAST_UPDATED = "2026-05-06";
export const CONTACT_EMAIL = "hello@pickrack.com";

export function buildWebPageJsonLd(slug: string, name: string, description: string) {
  const url = `${SITE_URL}/${slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      url: `${SITE_URL}/`,
      name: SITE_NAME,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name, item: url },
      ],
    },
  };
}
