import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { site } from "@/lib/site";

const links = [
  { label: "How it works", href: "#steps" },
  { label: "Workflow", href: "#live" },
  { label: "Streamers", href: "#streamers" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: `mailto:${site.email}` },
];

/** Logo left, segmented nav centred, account actions right (after ctrl.xyz). */
export function SiteHeader() {
  return (
    <header className="hero-rise fixed inset-x-0 top-0 z-50 bg-bg/80 backdrop-blur-md [animation-delay:900ms]">
      <div className="mx-auto grid h-16 max-w-[1360px] grid-cols-[1fr_auto] items-center gap-4 px-4 sm:h-20 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
        <a
          href="#top"
          className="justify-self-start text-xl sm:text-2xl"
          aria-label="Clippable, back to top"
        >
          <Logo />
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex h-11 items-center rounded-[10px] bg-bg-subtle px-1.5 text-[15px] font-medium text-fg">
            {links.map((l, i) => (
              <li key={l.label} className="flex items-center">
                {i > 0 && <span aria-hidden="true" className="h-3.5 w-px bg-border" />}
                <a href={l.href} className="rounded-[7px] px-4 py-2 transition-colors hover:bg-bg">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1.5 justify-self-end sm:gap-2">
          <a
            href={site.loginUrl}
            className="hidden h-11 items-center rounded-full px-4 text-[15px] font-medium text-fg transition-colors hover:bg-bg-subtle sm:inline-flex"
          >
            Log in
          </a>
          <a
            href={site.signupUrl}
            className="inline-flex h-10 items-center rounded-full bg-midnight px-5 text-[15px] font-medium text-white transition-transform duration-300 ease-out-expo hover:-translate-y-px sm:h-11"
          >
            Create account
          </a>
          <MobileMenu links={links} loginUrl={site.loginUrl} />
        </div>
      </div>
    </header>
  );
}
