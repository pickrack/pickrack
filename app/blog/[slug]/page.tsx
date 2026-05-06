import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { useMDXComponents } from "@/mdx-components";
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.dateModified ?? post.date,
    author: { "@type": "Person", name: post.author ?? SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}/` },
    keywords: post.tags?.join(", "),
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

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> All articles
      </Link>

      <header className="mb-8 pb-8 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
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

      <footer className="mt-12 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-sm text-gray-500">
          Found this useful? Share it. Found a mistake? <a href="https://twitter.com/pickrack" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Reach out on Twitter</a>.
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
