import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

type PageWrapperProps = {
  children: ReactNode;
};

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {children}
    </main>
  );
}

export function PageShell({ eyebrow, title, subtitle, children }: PageShellProps) {
  return (
    <PageWrapper>
      <header className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm sm:p-8">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-700">
            {subtitle}
          </p>
        ) : null}
      </header>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        {children}
      </section>
    </PageWrapper>
  );
}

type ProseProps = {
  children: ReactNode;
};

export function Prose({ children }: ProseProps) {
  return (
    <div className="space-y-5 text-[15px] leading-relaxed text-neutral-800 sm:text-base">
      {children}
    </div>
  );
}

type CalloutProps = {
  title: string;
  children: ReactNode;
};

export function Callout({ title, children }: CalloutProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
