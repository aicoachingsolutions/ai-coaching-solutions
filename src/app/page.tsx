import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { PageWrapper } from "@/components/page-shell";

function sortByDateDesc(a: string, b: string) {
  const pa = getPostBySlug(a);
  const pb = getPostBySlug(b);
  const da = pa?.date ? new Date(pa.date).getTime() : 0;
  const db = pb?.date ? new Date(pb.date).getTime() : 0;
  return db - da;
}

export default function HomePage() {
  const latestPosts = getAllPostSlugs()
    .sort(sortByDateDesc)
    .slice(0, 3)
    .map((slug) => getPostBySlug(slug))
    .filter(Boolean)
    .map((p) => p!);

  return (
    <PageWrapper>
      <div className="space-y-14 sm:space-y-16">
      <section className="relative overflow-hidden rounded-2xl shadow-md">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 280px at 0% 0%, rgba(255,255,255,0.18), transparent 48%), radial-gradient(700px 220px at 100% 0%, rgba(191,219,254,0.22), transparent 45%), linear-gradient(130deg, rgba(11,31,58,1) 0%, rgba(16,48,85,0.97) 52%, rgba(10,37,73,0.94) 100%)",
          }}
        />
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
            Coaching-First Platform
          </div>

          <h1 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Built for the Daily Work of Coaching
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90">
            Get structured mechanical feedback, clear next steps, and practical
            tools — without hype, logins, or noise.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/free-breakdown"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-neutral-100"
            >
              Try Free Breakdown
            </Link>
            <Link
              href="/post"
              className="inline-flex items-center justify-center rounded-full border border-white/50 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Browse Resources
            </Link>
          </div>

          <p className="mt-4 text-sm text-white/80">
            Built by a high school coach. Designed for practical use.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900">Value Before Payment</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            You should get something useful before you ever pay. That&apos;s how trust is built.
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900">Coach-Built Framework</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            This platform is designed around real coaching problems — clarity, time, and development.
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900">No Fluff. No Hype.</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            Clean pages, fast load, and straightforward tools — no noise.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold text-neutral-900">Latest Resources</h2>
          <Link className="text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:underline" href="/post">
            View all
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid gap-4">
            {latestPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {post.date || "—"}
                </p>
                <h3 className="mt-2 text-base font-semibold text-neutral-900">
                  <Link className="hover:underline" href={`/post/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                {post.description && (
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700">{post.description}</p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700 shadow-sm">
            New resources are added regularly.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">Get practical coaching notes</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-700">
          I send simple, useful coaching ideas and tool updates. No spam. Unsubscribe anytime.
        </p>

        <form className="mt-4 flex flex-col gap-3 sm:flex-row" action="#" method="post">
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900"
          />
          <button
            type="submit"
            className="rounded-md bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Get Coaching Notes
          </button>
        </form>

        <p className="mt-2 text-xs text-neutral-500">
          Messages are reviewed for future updates and practical resources.
        </p>
      </section>
      </div>
    </PageWrapper>
  );
}