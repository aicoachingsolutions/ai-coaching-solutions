import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";

function sortByDateDesc(a: string, b: string) {
  const pa = getPostBySlug(a);
  const pb = getPostBySlug(b);
  const da = pa?.date ? new Date(pa.date).getTime() : 0;
  const db = pb?.date ? new Date(pb.date).getTime() : 0;
  return db - da;
}

export const metadata = {
  title: "Articles",
  description: "Practical coaching insights and field-tested notes.",
  alternates: { canonical: "/post" },
};

export default function PostIndexPage() {
  const slugs = getAllPostSlugs().sort(sortByDateDesc);

  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter(Boolean)
    .map((p) => p!);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-neutral-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Resources
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Articles
        </h1>
        <p className="mt-4 text-base text-neutral-700">
          Practical notes you can use in real practices and real seasons.
        </p>
      </header>

      <section className="mt-8 space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {post.date || "—"}
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              <Link className="hover:underline" href={`/post/${post.slug}`}>
                {post.title}
              </Link>
            </h2>

            {post.description && (
              <p className="mt-2 text-sm text-neutral-700">{post.description}</p>
            )}

            <div className="mt-4">
              <Link
                href={`/post/${post.slug}`}
                className="inline-flex min-h-10 items-center text-sm font-semibold text-neutral-900 hover:underline"
              >
                Read →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
