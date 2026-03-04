import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { remark } from "remark";
import html from "remark-html";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/post/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <header className="border-b border-neutral-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Article
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        {post.date && (
          <p className="mt-3 text-sm text-neutral-600">{post.date}</p>
        )}
        {post.description && (
          <p className="mt-4 text-base text-neutral-700">{post.description}</p>
        )}
      </header>

      <article
        className="mt-8 max-w-none space-y-4 text-[15px] leading-relaxed text-neutral-800 sm:text-base [&_h1]:mt-7 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-7 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_a]:font-medium [&_a]:text-neutral-900 [&_a]:underline [&_a]:underline-offset-4 [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-700"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}
