import type { ReactNode } from "react";

const tones = {
  royal: "bg-royal text-white",
  dark: "bg-midnight text-white",
  light: "bg-white text-midnight",
} as const;

/**
 * Primary call to action. On hover the arrow segment slides out from behind the label.
 * Tight 6px corners, mono label.
 */
export function CtaButton({
  href,
  children,
  tone = "royal",
}: {
  href: string;
  children: ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <a
      href={href}
      className="group/cta relative isolate inline-flex h-11 rounded-[6px] outline-none"
    >
      <span
        className={`z-10 flex items-center rounded-[var(--radius-control)] px-5 font-mono text-[0.78rem] font-medium tracking-[0.06em] uppercase transition-colors group-focus-visible/cta:ring-2 group-focus-visible/cta:ring-blue group-focus-visible/cta:ring-offset-2 ${tones[tone]}`}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`z-0 -ml-11 flex w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] transition-[margin] duration-500 ease-out-expo group-hover/cta:ml-[3px] group-focus-visible/cta:ml-[3px] ${tones[tone]}`}
      >
        <svg
          viewBox="0 0 20 20"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M4 10h11M11 5.5 15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}
