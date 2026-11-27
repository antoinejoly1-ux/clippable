import { Button } from "@/components/button";
import { LogoMark } from "@/components/logo";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#steps" },
      { label: "Streamers", href: "#streamers" },
      { label: "Early access", href: "#early-access" },
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

/**
 * White footer panel with rounded bottom corners. Scrolling past it uncovers the
 * giant wordmark fixed behind the page.
 */
export function SiteFooter() {
  return (
    <>
      <footer className="relative z-[1] mb-[29vw] rounded-b-[24px] bg-bg shadow-[0_24px_48px_-32px_rgb(1_8_43/0.25)] sm:rounded-b-[40px]">
        <div className="mx-auto flex max-w-[2120px] flex-col gap-16 px-5 pt-16 pb-8 sm:px-8 md:min-h-[480px] md:flex-row md:justify-between md:pt-24">
          <div>
            <p className="text-[clamp(2rem,3.6vw,3.25rem)] leading-[1] font-medium tracking-[-0.045em] text-fg">
              Every stream, <br />
              <span className="text-fg-muted">clipped live.</span>
            </p>
            <div className="mt-8">
              <Button href="#early-access">Get early access</Button>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-16 md:pr-[4vw]">
            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-x-6 gap-y-10 sm:flex sm:gap-[min(10rem,10vw)]"
            >
              {columns.map((col) => (
                <div key={col.title}>
                  <p className="mb-3 text-sm text-fg-muted">{col.title}</p>
                  <ul>
                    {col.links.map((l) => (
                      <li key={l.label} className="mb-2">
                        <a
                          href={l.href}
                          className="relative inline-block text-sm text-fg underline decoration-transparent underline-offset-4 transition-[text-decoration-color] after:absolute after:-inset-x-2 after:-inset-y-[5px] after:content-[''] hover:decoration-current"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <LogoMark className="h-5 w-auto self-start text-fg" />
              <p className="font-mono text-[11px] leading-relaxed text-fg-muted">
                © <CopyrightYear /> Clippable. All rights reserved. <br />
                Built for clippers and streamers.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Revealed behind the footer as the page ends */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0 bottom-0 z-0 h-[min(900px,100svh)] bg-[linear-gradient(to_bottom,var(--bg-subtle),var(--color-sky))]"
      >
        <svg
          viewBox="0 0 1000 250"
          className="absolute bottom-[1vw] left-1/2 w-[96%] -translate-x-1/2 fill-white"
        >
          <text
            x="500"
            y="205"
            textAnchor="middle"
            textLength="992"
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
    </>
  );
}

/** Cached at build/revalidation time, so the page stays fully static. */
async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}
