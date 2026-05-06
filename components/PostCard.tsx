import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border bg-white p-6 transition hover:border-emerald-400 hover:shadow-md"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </time>
        <span>•</span>
        <span>{post.readingTime}</span>
        {post.tags.length > 0 && (
          <>
            <span>•</span>
            <span className="text-emerald-600 font-medium">{post.tags[0]}</span>
          </>
        )}
      </div>
      <h2 className="text-xl font-bold mb-2 group-hover:text-emerald-600 transition">
        {post.title}
      </h2>
      <p className="text-gray-600 text-sm leading-6 line-clamp-3">{post.description}</p>
    </Link>
  );
}
