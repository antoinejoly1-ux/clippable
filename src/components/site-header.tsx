import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      <nav
        aria-label="Main"
        className="pointer-events-auto flex h-14 w-full max-w-3xl items-center justify-between gap-2 rounded-full border border-border/80 bg-bg/85 pr-2 pl-5 shadow-[0_1px_2px_rgb(1_8_43/0.04),0_12px_32px_-16px_rgb(1_8_43/0.25)] backdrop-blur-xl"
      >
        <a href="#top" className="rounded-full text-lg" aria-label="Clippable, back to top">
          <Logo />
        </a>
        <ul className="hidden items-center gap-1 text-sm font-medium text-fg-muted md:flex">
          <li>
            <a href="#how" className="rounded-full px-3 py-2 transition-colors hover:text-fg">
              How it works
            </a>
          </li>
          <li>
            <a href="#streamers" className="rounded-full px-3 py-2 transition-colors hover:text-fg">
              Streamers
            </a>
          </li>
        </ul>
        <a
          href="#early-access"
          className="inline-flex h-10 items-center rounded-full bg-accent px-4 text-sm font-medium text-accent-fg transition-transform duration-300 ease-out-expo hover:-translate-y-px"
        >
          Get early access
        </a>
      </nav>
    </header>
  );
}
