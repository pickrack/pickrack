/**
 * GET /blog/feed.xml
 *
 * RSS 2.0 feed of the latest 20 blog posts.
 * Cached by Next.js as a static asset (revalidate hourly).
 */

import { getAllPosts } from "@/lib/posts";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

export const revalidate = 3600; // re-render every hour

const MAX_ITEMS = 20;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(s: string): string {
  return `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function pubDate(iso: string): string {
  const d = new Date(iso);
  return d.toUTCString();
}

export async function GET() {
  const posts = getAllPosts().slice(0, MAX_ITEMS);
  const latestDate = posts[0]?.dateModified ?? posts[0]?.date ?? new Date().toISOString();

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}/`;
      const author = p.author ?? SITE_NAME;
      const categories = (p.tags ?? []).map((t) => `<category>${xmlEscape(t)}</category>`).join("\n      ");
      return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate(p.date)}</pubDate>
      <dc:creator>${cdata(author)}</dc:creator>
      <description>${cdata(p.description || p.title)}</description>
      ${categories}
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(`${SITE_NAME} — Blog`)}</title>
    <link>${SITE_URL}/blog/</link>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <description>${cdata(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${pubDate(latestDate)}</lastBuildDate>
    <generator>Next.js</generator>
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
