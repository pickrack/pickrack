import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "posts");

export type FAQItem = { q: string; a: string };
export type HowToStep = { name: string; text: string };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateModified?: string;
  tags: string[];
  cover?: string;
  author?: string;
  readingTime: string;
  draft?: boolean;
  faq?: FAQItem[];
  howTo?: { name: string; description?: string; steps: HowToStep[] };
};

export type Post = PostMeta & {
  content: string;
};

function readPostFile(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? new Date().toISOString().slice(0, 10),
    dateModified: data.dateModified,
    tags: Array.isArray(data.tags) ? data.tags : [],
    cover: data.cover,
    author: data.author,
    readingTime: stats.text,
    draft: data.draft === true,
    faq: Array.isArray(data.faq) ? data.faq : undefined,
    howTo: data.howTo && Array.isArray(data.howTo.steps) ? data.howTo : undefined,
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  const posts: PostMeta[] = [];
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const post = readPostFile(slug);
    if (post && !post.draft) {
      const { content: _content, ...meta } = post;
      void _content;
      posts.push(meta);
    }
  }
  posts.sort((a, b) => (a.date > b.date ? -1 : 1));
  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const post = readPostFile(slug);
  if (!post || post.draft) return null;
  return post;
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}
