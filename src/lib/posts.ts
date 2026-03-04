import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  slug: string;
  sourceUrl?: string;
};

export type Post = PostFrontmatter & {
  content: string; // markdown body
};

const POSTS_DIR = path.join(process.cwd(), "content", "post");

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const fm = data as Partial<PostFrontmatter>;

  return {
    title: fm.title ?? slug,
    description: fm.description ?? "",
    date: fm.date ?? "",
    slug: fm.slug ?? slug,
    sourceUrl: fm.sourceUrl ?? "",
    content,
  };
}
