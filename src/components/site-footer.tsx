import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Streamers", href: "#streamers" },
      { label: "How it works", href: "#steps" },
      { label: "Workflows", href: "#live" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Email us", href: `mailto:${site.email}` },
      {
        label: "Partnerships",
        href: `mailto:${site.email}?subject=${encodeURIComponent("Partnership")}`,
      },
    ],
  },
];

/* The page's content width; the footer and the wordmark behind it line up with every section. */
const container = "mx-auto w-full max-w-[1360px] px-4 sm:px-6";

/**
 * White footer panel with rounded bottom corners. Scrolling past it uncovers the
 * giant wordmark fixed behind the page, set to the same width as the content.
 */
export function SiteFooter() {
  return (
    <>
      <footer className="page-lift relative z-[1] mb-[min(27vw,380px)] rounded-b-[24px] bg-bg shadow-[0_24px_48px_-32px_rgb(1_8_43/0.25)] sm:rounded-b-[40px]">
        <div className={`${container} pt-16 pb-8 md:pt-24`}>
          <div className="flex flex-col gap-14 md:flex-row md:justify-between">
            <div>
              <p className="text-[clamp(2rem,3.6vw,3.25rem)] leading-[1] font-medium tracking-[-0.045em] text-fg">
                Every live stream, <br />
                <span className="text-fg-muted">clipped instantly.</span>
              </p>
              <Button href={site.signupUrl} className="mt-8">
                Create account
              </Button>
            </div>

            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-x-10 gap-y-10 sm:flex sm:gap-[min(8rem,9vw)]"
            >
              {columns.map((col) => (
                <div key={col.title}>
                  <p className="mb-4 text-sm text-fg-muted">{col.title}</p>
                  <ul className="flex flex-col gap-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          className="relative inline-flex min-h-11 items-center text-[15px] text-fg underline decoration-transparent underline-offset-4 transition-[text-decoration-color] after:absolute after:-inset-x-2 after:-inset-y-[5px] after:content-[''] hover:decoration-current"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between md:mt-24">
            <a href="#top" aria-label="Clippable, back to top" className="text-lg">
              <Logo />
            </a>
            <p className="text-sm text-fg-muted">
              © <CopyrightYear /> Clippable. Built for clippers and streamers.
            </p>
          </div>
        </div>
      </footer>

      {/* Revealed behind the footer as the page ends */}
      <div
        aria-hidden="true"
        className="footer-sky fixed inset-x-0 bottom-0 z-0 h-[min(900px,100svh)]"
      >
        <div className="grain absolute inset-0" />
        <div className={`${container} footer-mark absolute inset-x-0 bottom-[min(1.5vw,20px)]`}>
          <svg viewBox="0 0 1000 232" className="block w-full fill-white">
            <text
              x="500"
              y="200"
              textAnchor="middle"
              textLength="984"
              lengthAdjust="spacingAndGlyphs"
              fontSize="262"
              fontWeight="600"
              letterSpacing="-14"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Clippable
            </text>
          </svg>
        </div>
      </div>
    </>
  );
}

/** Cached at build/revalidation time, so the page stays fully static. */
async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}
