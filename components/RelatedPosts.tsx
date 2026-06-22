"use client";

import PostCard from "@/components/PostCard";
import type { PostMeta } from "@/lib/posts";

export default function RelatedPosts({
  posts,
  title = "Related Articles",
}: {
  posts: PostMeta[];
  title?: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
      <h2 className="text-2xl font-bold tracking-tight mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
