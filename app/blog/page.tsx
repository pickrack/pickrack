import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getAllPosts, getPostsByTag } from "@/lib/posts";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "All articles",
  description: "Honest reviews and how-to guides on free AI, PDF, and developer tools.",
  alternates: { canonical: `${SITE_URL}/blog/` },
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const posts = tag ? getPostsByTag(tag) : getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {tag ? `Articles tagged "${tag}"` : "All articles"}
        </h1>
        <p className="mt-3 text-gray-600">
          {tag
            ? `${posts.length} article${posts.length === 1 ? "" : "s"} on ${tag}`
            : "Curated reviews and guides — newest first."}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-gray-500 italic">No articles yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
