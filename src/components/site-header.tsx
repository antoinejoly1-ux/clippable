import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { site } from "@/lib/site";

const links = [
  { label: "Streamers", href: "#streamers" },
  { label: "How it works", href: "#steps" },
  { label: "Workflows", href: "#live" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: `mailto:${site.email}` },
];

/** Logo left, segmented nav centred, account actions right (after ctrl.xyz). */
export function SiteHeader() {
  return (
    <header className="hero-rise fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 [animation-delay:700ms] in-data-[scrolled=true]:bg-bg/80 in-data-[scrolled=true]:backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-[1360px] grid-cols-[1fr_auto] items-center gap-2 px-3 min-[360px]:gap-4 min-[360px]:px-4 sm:h-20 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">
        <a
          href="#top"
          className="justify-self-start text-xl text-fg transition-colors duration-300 in-data-[scrolled=false]:text-white in-data-[scrolled=false]:[--logo-mark:var(--color-sky)] sm:text-2xl"
          aria-label="Clippable, back to top"
        >
          <Logo />
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex h-11 items-center rounded-[10px] bg-bg-subtle px-1.5 text-[15px] font-medium text-fg transition-colors duration-300 in-data-[scrolled=false]:bg-white/10 in-data-[scrolled=false]:text-white in-data-[scrolled=false]:backdrop-blur-md">
            {links.map((l, i) => (
              <li key={l.label} className="flex items-center">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="h-3.5 w-px bg-border in-data-[scrolled=false]:bg-white/20"
                  />
                )}
                <a
                  href={l.href}
                  className="rounded-[7px] px-4 py-2 whitespace-nowrap transition-[background-color,scale] duration-200 hover:bg-bg active:scale-[0.96] in-data-[scrolled=false]:hover:bg-white/15"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1.5 justify-self-end sm:gap-2">
          <a
            href={site.loginUrl}
            className="hidden h-11 items-center rounded-[10px] px-4 text-[15px] font-medium whitespace-nowrap text-fg transition-[background-color,color,scale] duration-200 select-none hover:bg-bg-subtle active:scale-[0.96] in-data-[scrolled=false]:text-white in-data-[scrolled=false]:hover:bg-white/10 sm:inline-flex"
          >
            Log in
          </a>
          <Button
            href={site.signupUrl}
            variant="dark"
            size="sm"
            className="in-data-[scrolled=false]:bg-white in-data-[scrolled=false]:text-midnight in-data-[scrolled=false]:hover:bg-sky"
          >
            Create account
          </Button>
          <MobileMenu links={links} loginUrl={site.loginUrl} />
        </div>
      </div>
    </header>
  );
}
