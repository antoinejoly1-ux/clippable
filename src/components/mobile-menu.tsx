"use client";

import { useEffect, useRef } from "react";

/** Mobile nav: a native disclosure (works before hydration), closed on link tap, outside tap or Esc. */
export function MobileMenu({
  links,
  loginUrl,
}: {
  links: { label: string; href: string }[];
  loginUrl: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = (e: Event) => {
      const el = ref.current;
      if (!el?.open) return;
      if (e instanceof KeyboardEvent) {
        if (e.key !== "Escape") return;
        const hadFocus = el.contains(document.activeElement);
        el.removeAttribute("open");
        // Return focus to the toggle so keyboard users don't land on a hidden link.
        if (hadFocus) el.querySelector("summary")?.focus();
        return;
      }
      if (!el.contains(e.target as Node)) el.removeAttribute("open");
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <details ref={ref} className="group relative lg:hidden">
      <summary
        aria-label="Menu"
        className="hdr-ink flex size-10 cursor-pointer list-none items-center justify-center rounded-[10px] transition-[background-color,scale] duration-300 select-none hover:bg-[rgb(128_140_170/0.16)] active:scale-[0.94] [&::-webkit-details-marker]:hidden"
      >
        <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden="true">
          <path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </summary>
      <nav
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) ref.current?.removeAttribute("open");
        }}
        aria-label="Main"
        className="absolute top-12 right-0 w-56 rounded-[var(--radius-card)] border border-border bg-bg p-1.5 shadow-[0_24px_48px_-24px_rgb(1_8_43/0.35)]"
      >
        <ul className="text-[15px] font-medium text-fg">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="block rounded-[var(--radius-control)] px-3 py-2.5 transition-colors hover:bg-bg-subtle active:bg-border/60"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="mt-1 border-t border-border pt-1 sm:hidden">
            <a
              href={loginUrl}
              className="block rounded-[var(--radius-control)] px-3 py-2.5 transition-colors hover:bg-bg-subtle active:bg-border/60"
            >
              Log in
            </a>
          </li>
        </ul>
      </nav>
    </details>
  );
}
