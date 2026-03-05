import Link from "next/link";
import { readdir, readFile, stat } from "fs/promises";
import path from "path";
import { EmailSignupForm } from "@/components/email-signup-form";

type PostMeta = {
  slug: string;
  title: string;
  date?: string;
  description?: string;
};

function parseFrontmatter(raw: string): Omit<PostMeta, "slug"> {
  const fm: Record<string, string> = {};

  if (!raw.startsWith("---")) {
    const h1 = raw.match(/^#\s+(.+)$/m)?.[1]?.trim();
    return { title: h1 ?? "Untitled" };
  }

  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { title: "Untitled" };

  const block = raw.slice(3, end).trim();
  for (const line of block.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1");
    if (key) fm[key] = value;
  }

  return {
    title: fm.title || "Untitled",
    date: fm.date || undefined,
    description: fm.description || fm.excerpt || undefined,
  };
}

async function fileExists(p: string) {
  try {
    const s = await stat(p);
    return s.isFile() || s.isDirectory();
  } catch {
    return false;
  }
}

async function getLatestPosts(limit = 3): Promise<PostMeta[]> {
  const postsDir = path.join(process.cwd(), "content", "post");
  if (!(await fileExists(postsDir))) return [];

  const entries = await readdir(postsDir, { withFileTypes: true });

  const candidates: { slug: string; filePath: string }[] = [];

  for (const e of entries) {
    if (e.isFile()) {
      const ext = path.extname(e.name);
      if (ext === ".md" || ext === ".mdx") {
        const slug = path.basename(e.name, ext);
        candidates.push({ slug, filePath: path.join(postsDir, e.name) });
      }
    }

    if (e.isDirectory()) {
      const slug = e.name;
      const mdxPath = path.join(postsDir, slug, "index.mdx");
      const mdPath = path.join(postsDir, slug, "index.md");
      if (await fileExists(mdxPath)) candidates.push({ slug, filePath: mdxPath });
      else if (await fileExists(mdPath)) candidates.push({ slug, filePath: mdPath });
    }
  }

  const metas: PostMeta[] = [];
  for (const c of candidates) {
    const raw = await readFile(c.filePath, "utf8");
    const meta = parseFrontmatter(raw);
    metas.push({ slug: c.slug, ...meta });
  }

  metas.sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });

  return metas.slice(0, limit);
}

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
  );
}

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`py-8 sm:py-14 ${className}`}>{children}</section>;
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex w-full items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
    >
      {children}
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex w-full items-center justify-center rounded-md border border-white/50 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
    >
      {children}
    </Link>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-black/70">{children}</p>
    </div>
  );
}

export default async function HomePage() {
  const latestPosts = await getLatestPosts(3);
  const showLatest = latestPosts.length > 0;

  return (
    <main className="bg-white text-black">
      {/* HERO */}
      <Section className="pt-8 sm:pt-16">
        <Container>
          <div className="relative overflow-x-hidden overflow-y-hidden rounded-2xl shadow-md">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(900px 280px at 0% 0%, rgba(255,255,255,0.14), transparent 48%), radial-gradient(700px 220px at 100% 0%, rgba(191,219,254,0.2), transparent 45%), linear-gradient(130deg, rgba(11,31,58,1) 0%, rgba(16,48,85,0.97) 52%, rgba(10,37,73,0.94) 100%)",
              }}
            />
            <div className="relative grid items-center gap-8 p-5 sm:gap-10 sm:p-8 lg:grid-cols-12 lg:p-10">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 sm:text-xs">
                Baseball/Softball + Golf • Coach-first • No login
              </p>

              <h1 className="mt-4 max-w-xl text-[1.9rem] font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                Free swing breakdowns for baseball, softball, and golf.
              </h1>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/90 sm:text-lg">
                Describe what you are seeing and get mechanics notes, timing feedback, coaching cues,
                next focus, and a drill to run in your next session. You make the final call as the
                coach.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="w-full sm:w-auto">
                  <PrimaryButton href="/free-breakdown">Try the Free Breakdown</PrimaryButton>
                </div>
                <div className="w-full sm:w-auto">
                  <SecondaryButton href="/howitworks">See How It Works</SecondaryButton>
                </div>
              </div>

              <p className="mt-4 text-xs text-white/80">
                Built by a coach. Designed for practical use. <span className="mx-1">•</span> No login
                required. <span className="mx-1">•</span> No video storage.
              </p>
            </div>

            {/* Right panel */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/20 bg-white/95 p-5 shadow-sm sm:p-6">
                <h2 className="text-sm font-semibold text-neutral-900">
                  What coaches get in under a minute
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-700" />
                    Mechanics + timing read in plain coaching terms
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-700" />
                    Cues you can say immediately in cage work, bullpens, range, or team practice
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-700" />
                    One next priority so you are not fixing five things at once
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-700" />
                    One drill to turn feedback into useful reps
                  </li>
                </ul>

                <p className="mt-5 text-xs text-neutral-600">
                  Best for youth, high school, travel ball, and golf coaches who want clarity fast.
                </p>
              </div>
            </div>
          </div>
          </div>
        </Container>
      </Section>

      {/* TRUST STRIP */}
      <div className="border-y border-black/10 bg-black/[0.02]">
        <Container>
          <div className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-3 sm:py-6">
            <div className="rounded-md border border-black/10 bg-white px-4 py-3 text-center text-sm font-medium leading-snug text-black/80">
              No login / no friction
            </div>
            <div className="rounded-md border border-black/10 bg-white px-4 py-3 text-center text-sm font-medium leading-snug text-black/80">
              Coach-first output
            </div>
            <div className="rounded-md border border-black/10 bg-white px-4 py-3 text-center text-sm font-medium leading-snug text-black/80">
              Built for real baseball, softball, and golf practices
            </div>
          </div>
        </Container>
      </div>

      {/* HOW IT HELPS (3 cards) */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Clearer coaching decisions, faster.
            </h2>
            <p className="mt-3 text-sm leading-6 text-black/70 sm:text-base">
              Use this as a practical coaching draft: what to fix first, what to say, and what to drill
              next.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="Get Unstuck Fast">
              When a hitter, pitcher, or golfer is off, get a clear first priority instead of chasing
              every issue.
            </Card>
            <Card title="Clear Cues Players Understand">
              Get simple language you can use right away with players who need actionable direction.
            </Card>
            <Card title="One Drill to Reinforce It">
              Leave with one drill that fits the next session so feedback actually becomes reps and
              improvement.
            </Card>
          </div>
        </Container>
      </Section>

      {/* FEATURE PANEL */}
      <Section className="sm:bg-black/[0.02]">
        <Container>
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Start with the Free Swing & Pitching Breakdown
                </h2>
                <p className="mt-4 text-sm leading-6 text-black/70 sm:text-base">
                  This is your conversion point: describe what is happening in a baseball swing,
                  softball swing, pitching action, or golf swing and get a structured breakdown you can
                  coach from.
                </p>

                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-black/80">
                  <li>Mechanics read focused on the movement pattern that matters most</li>
                  <li>Timing feedback to identify sequence and rhythm issues</li>
                  <li>Coaching cues in practical language players can execute</li>
                  <li>One next focus plus one drill for your next practice block</li>
                </ul>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6">
                  <p className="text-sm font-semibold text-black">Works best when you include:</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/75">
                    <li>Handedness and where misses show up</li>
                    <li>Contact quality (hard, weak, late, under, thin, heavy)</li>
                    <li>One goal for the next session</li>
                  </ul>
                  <div className="mt-5">
                    <PrimaryButton href="/free-breakdown">Try the Free Breakdown</PrimaryButton>
                  </div>
                  <p className="mt-3 text-xs text-black/55">No login. No storage. Built for practical coaching.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* COACH NOTE */}
      <Section>
        <Container>
            <div className="w-full rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-10">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">A quick coach note</h2>
            <p className="mt-4 text-sm leading-7 text-black/75 sm:text-base">
              I built this for coaches working through late-night film, weekend tournaments, range
              sessions, and limited practice time. We do not need more noise. We need clearer next steps
              and language athletes can use right away.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/howitworks"
                className="inline-flex items-center justify-center rounded-md border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-black/5"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* LATEST RESOURCES (hide if none) */}
      {showLatest && (
        <Section className="sm:bg-black/[0.02]">
          <Container>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    Latest coaching resources
                  </h2>
                  <p className="mt-2 text-sm text-slate-700 sm:text-base">
                    Practical notes for baseball, softball, and golf coaches.
                  </p>
                </div>
                <Link
                  href="/post"
                  className="inline-flex self-start text-sm font-semibold text-slate-900 hover:opacity-80 sm:self-auto"
                >
                  View all →
                </Link>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {latestPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/post/${p.slug}`}
                    className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:bg-slate-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold leading-6 text-slate-900 group-hover:opacity-90">
                        {p.title}
                      </h3>
                      <span className="text-xs text-slate-500">↗</span>
                    </div>
                    {p.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-700">
                        {p.description}
                      </p>
                    )}
                    {p.date && <p className="mt-4 text-xs text-slate-600">{p.date}</p>}
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* EMAIL CAPTURE (UI-only) */}
      <Section>
        <Container>
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-10">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Get practical coaching notes
                </h2>
                <p className="mt-3 text-sm leading-6 text-black/70 sm:text-base">
                  Occasional coaching ideas and tool updates. No spam.
                </p>
              </div>

              <div className="lg:col-span-6">
                <EmailSignupForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}