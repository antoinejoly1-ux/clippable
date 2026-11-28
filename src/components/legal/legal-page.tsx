import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { site } from "@/lib/site";

export type LegalSection = { id: string; title: string; summary?: string; body: ReactNode };

/**
 * Shared layout for the Terms and Privacy Policy: a contents list that stays in view on wide
 * screens, and each section opening with a plain-language "In short".
 */
export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <>
      <header className="border-b border-border bg-bg">
        <div className="mx-auto flex h-16 max-w-[1160px] items-center justify-between px-5 sm:h-20 sm:px-8">
          <Link href="/" aria-label="Clippable home" className="text-xl text-fg">
            <Logo />
          </Link>
          <nav aria-label="Legal" className="flex items-center gap-1 text-[15px]">
            <Link href="/terms" className="rounded-[8px] px-3 py-2 text-fg-muted hover:text-fg">
              Terms
            </Link>
            <Link href="/privacy" className="rounded-[8px] px-3 py-2 text-fg-muted hover:text-fg">
              Privacy
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" className="bg-bg">
        <div className="mx-auto max-w-[1160px] px-5 pt-14 pb-24 sm:px-8 sm:pt-20">
          <p className="text-sm font-medium text-royal">{eyebrow}</p>
          <h1 className="mt-3 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-fg">
            {title}
          </h1>
          <p className="mt-4 text-[15px] text-fg-muted">Last updated {site.legal.updated}</p>
          <div className="mt-8 max-w-[68ch] text-[17px] leading-relaxed text-pretty text-fg-muted [&_p+p]:mt-4">
            {intro}
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
            <nav aria-label="Contents" className="lg:sticky lg:top-8 lg:self-start">
              <p className="text-sm font-medium text-fg">Contents</p>
              <ol className="mt-3 flex flex-col gap-1.5 border-l border-border text-[14px]">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px block border-l border-transparent py-0.5 pl-3 text-fg-muted transition-colors hover:border-fg hover:text-fg"
                    >
                      {i + 1}. {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="legal-prose max-w-[68ch]">
              {sections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-8 border-t border-border pt-8 pb-10 first:border-t-0 first:pt-0"
                >
                  <h2 className="text-[1.6rem] leading-tight font-medium tracking-[-0.03em] text-fg">
                    <span className="text-fg-subtle">{i + 1}.</span> {s.title}
                  </h2>
                  {s.summary && (
                    <p className="mt-4 rounded-[var(--radius-card)] bg-bg-subtle px-4 py-3 text-[15px] leading-relaxed text-fg">
                      <span className="font-medium">In short: </span>
                      {s.summary}
                    </p>
                  )}
                  <div className="mt-5">{s.body}</div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-bg">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-3 px-5 py-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {site.legal.updated.slice(-4)} {site.legal.entity}
          </p>
          <p className="flex gap-5">
            <Link href="/terms" className="hover:text-fg">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-fg">
              Privacy
            </Link>
            <a href={`mailto:${site.email}`} className="hover:text-fg">
              Contact
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
