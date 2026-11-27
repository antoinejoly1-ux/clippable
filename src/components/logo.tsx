import type { SVGProps } from "react";

/** Official Clippable glyph (from the brand's logo-glyph.svg). Inherits colour via currentColor. */
const GLYPH =
  "M672.43 355.99A197 197 0 0 0 538 303H376a197 197 0 0 0 0 394h162a197 197 0 0 0 134.43-52.99L583.26 592.53A103 103 0 0 1 538 603H376a103 103 0 0 1 0-206h162a103 103 0 0 1 45.26 10.47ZM642 443l179-103.35v320.7L642 557Z";

export function LogoMark({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="179 303 642 394"
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      <path d={GLYPH} />
    </svg>
  );
}

/** Mark + wordmark lockup. Wordmark is set in Geist until a vector wordmark is supplied. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="h-[0.78em] w-auto text-[var(--logo-mark,var(--color-electric))] transition-colors duration-300" />
      <span className="font-semibold tracking-[-0.02em]">Clippable</span>
    </span>
  );
}
