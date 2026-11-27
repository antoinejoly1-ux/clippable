import { LogoMark } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      <nav
        aria-label="Main"
        className="hero-rise pointer-events-auto flex h-12 items-center gap-1 rounded-[10px] bg-midnight/95 p-1.5 pl-3.5 text-white shadow-[0_12px_32px_-12px_rgb(1_8_43/0.55)] ring-1 ring-white/10 backdrop-blur-xl [animation-delay:900ms]"
      >
        <a
          href="#top"
          className="mr-2 flex items-center gap-2 rounded-[6px] font-medium tracking-[-0.01em]"
          aria-label="Clippable, back to top"
        >
          <LogoMark className="h-3.5 w-auto text-sky" />
          <span>Clippable</span>
        </a>
        <ul className="hidden items-center font-mono text-[11px] tracking-[0.08em] text-white/65 uppercase sm:flex">
          <li>
            <a
              href="#steps"
              className="rounded-[6px] px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
            >
              How it works
            </a>
          </li>
          <li>
            <a
              href="#streamers"
              className="rounded-[6px] px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
            >
              Streamers
            </a>
          </li>
        </ul>
        <a
          href="#early-access"
          className="ml-1 inline-flex h-9 items-center rounded-[6px] bg-white px-3.5 font-mono text-[11px] font-medium tracking-[0.08em] text-midnight uppercase transition-colors hover:bg-sky"
        >
          Get access
        </a>
      </nav>
    </header>
  );
}
