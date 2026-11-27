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
    <header className="site-header hero-rise fixed inset-x-0 top-0 z-50 [animation-delay:700ms]">
      <div className="mx-auto grid h-16 max-w-[1360px] grid-cols-[1fr_auto] items-center gap-2 px-3 min-[360px]:gap-4 min-[360px]:px-4 sm:h-20 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">
        <a
          href="#top"
          className="hdr-logo justify-self-start text-xl sm:text-2xl"
          aria-label="Clippable, back to top"
        >
          <Logo />
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="hdr-pill flex h-11 items-center rounded-[10px] px-1.5 text-[15px] font-medium">
            {links.map((l, i) => (
              <li key={l.label} className="flex items-center">
                {i > 0 && <span aria-hidden="true" className="hdr-rule h-3.5 w-px" />}
                <a
                  href={l.href}
                  className="rounded-[7px] px-4 py-2 whitespace-nowrap transition-[background-color,scale] duration-300 hover:bg-[rgb(128_140_170/0.16)] active:scale-[0.96]"
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
            className="hdr-ink hidden h-11 items-center rounded-[10px] px-4 text-[15px] font-medium whitespace-nowrap transition-[background-color,scale] duration-300 select-none hover:bg-[rgb(128_140_170/0.16)] active:scale-[0.96] sm:inline-flex"
          >
            Log in
          </a>
          <Button href={site.signupUrl} variant="dark" size="sm" className="hdr-cta">
            Create account
          </Button>
          <MobileMenu links={links} loginUrl={site.loginUrl} />
        </div>
      </div>
    </header>
  );
}
