import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { useMDXComponents } from "@/mdx-components";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedPosts from "@/components/RelatedPosts";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      url: `${SITE_URL}/blog/${slug}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: `${SITE_URL}/blog/${slug}/` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const authorName = post.author ?? SITE_NAME;
  const isDavid = authorName === "David Pham";

  // Derive wordCount and primary articleSection from frontmatter/content
  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
  const articleSection = (() => {
    const t = post.tags ?? [];
    if (t.includes("pdf")) return "PDF Tools";
    if (t.includes("image")) return "Image Tools";
    if (t.includes("ai")) return "AI Tools";
    if (t.includes("dev")) return "Developer Tools";
    if (t.includes("text")) return "Text Tools";
    if (t.includes("meta") || t.includes("about")) return "About";
    return "Tools";
  })();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.dateModified ?? post.date,
    wordCount,
    articleSection,
    inLanguage: "en",
    author: isDavid
      ? {
          "@type": "Person",
          "@id": `${SITE_URL}/authors/david-pham/#person`,
          name: "David Pham",
          url: `${SITE_URL}/authors/david-pham/`,
          image: `${SITE_URL}/authors/david-pham-256.png`,
          jobTitle: "Founder & Solo Developer",
          worksFor: { "@id": `${SITE_URL}/#organization` },
          sameAs: ["https://twitter.com/pickrackdev", "https://github.com/pickrack"],
        }
      : { "@type": "Person", name: authorName },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}/` },
    keywords: post.tags?.join(", "),
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}/` },
    ],
  };

  const faqJsonLd =
    post.faq && post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  const howToJsonLd =
    post.howTo && post.howTo.steps.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: post.howTo.name,
          description: post.howTo.description ?? post.description,
          totalTime: undefined,
          step: post.howTo.steps.map((s, idx) => ({
            "@type": "HowToStep",
            position: idx + 1,
            name: s.name,
            text: s.text,
          })),
        }
      : null;

  const components = useMDXComponents({});
  const relatedPosts = getRelatedPosts(slug, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> All articles
      </Link>
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <header className="mb-8 pb-8 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
          <span>•</span>
          <span>{post.readingTime}</span>
          {post.tags.map((t) => (
            <span key={t} className="ml-1 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 font-medium">
              {t}
            </span>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{post.title}</h1>
        {post.description && (
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">{post.description}</p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-2">
            {isDavid ? (
              <Image
                src="/authors/david-pham-64.png"
                alt="David Pham"
                width={28}
                height={28}
                className="rounded-full ring-2 ring-emerald-100"
              />
            ) : (
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-xs">
                {authorName.slice(0, 1)}
              </span>
            )}
            <span>
              By{" "}
              <Link
                href={isDavid ? "/authors/david-pham/" : "/about/"}
                className="font-medium text-gray-900 hover:text-emerald-600 hover:underline"
              >
                {authorName}
              </Link>
              {isDavid && <span className="text-gray-500">, founder of {SITE_NAME}</span>}
            </span>
          </span>
          {post.dateModified && post.dateModified !== post.date && (
            <>
              <span aria-hidden className="text-gray-300">•</span>
              <span className="text-gray-500">
                Last updated:{" "}
                <time dateTime={post.dateModified}>
                  {new Date(post.dateModified).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </time>
              </span>
            </>
          )}
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <MDXRemote
          source={post.content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
              ],
            },
          }}
        />
      </div>

      <RelatedPosts posts={relatedPosts} />

      <footer className="mt-12 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="rounded-2xl border bg-gray-50 p-5 mb-6" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm font-semibold text-gray-900 mb-2">Discuss this article</p>
          <p className="text-sm text-gray-700 mb-3">
            Spotted a mistake, have a counter-example, or want to share your own experience? The discussion happens in public on GitHub and Twitter — no signup required to read, just a free account to comment.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://github.com/pickrack/pickrack/discussions/new?category=blog&title=Re%3A%20${encodeURIComponent(post.title)}&body=Re%3A%20%5B${encodeURIComponent(post.title)}%5D(${encodeURIComponent(`${SITE_URL}/blog/${slug}/`)})%0A%0A`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border bg-white hover:border-emerald-400 text-gray-800 font-medium"
              style={{ borderColor: "var(--color-border)" }}
            >
              Discuss on GitHub →
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${SITE_URL}/blog/${slug}/`)}&text=${encodeURIComponent(post.title)}&via=pickrackdev`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border bg-white hover:border-emerald-400 text-gray-800 font-medium"
              style={{ borderColor: "var(--color-border)" }}
            >
              Share on Twitter
            </a>
            <a
              href={`https://github.com/pickrack/pickrack/edit/main/posts/${slug}.mdx`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border bg-white hover:border-emerald-400 text-gray-800 font-medium"
              style={{ borderColor: "var(--color-border)" }}
            >
              Suggest an edit
            </a>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Written by <Link href="/authors/david-pham/" className="text-emerald-700 hover:underline">{authorName}</Link>.
          Published {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.
          {post.dateModified && post.dateModified !== post.date && (
            <> Last reviewed {new Date(post.dateModified).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.</>
          )}
          {" "}
          Methodology: see <Link href="/methodology/" className="text-emerald-700 hover:underline">how we test</Link>.
        </p>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      {howToJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      )}
    </article>
  );
}
