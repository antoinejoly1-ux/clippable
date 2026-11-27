import type { ReactNode } from "react";

/**
 * The site's one call-to-action button. Every CTA uses it so size, shape and type match.
 *  - primary: brand blue (default)    - inverse: white, for dark or video backgrounds
 *  - dark: midnight, for the header
 * Sizes: sm (header), md (48px) in-page, lg (56px) final CTA, xl (64px) hero.
 */
const variants = {
  primary: "bg-royal text-white hover:bg-midnight",
  inverse: "bg-white text-midnight hover:bg-sky",
  dark: "bg-midnight text-white hover:bg-royal",
} as const;

const sizes = {
  /** Header: compact on phones so logo, CTA and menu fit at 320px. */
  sm: "h-10 px-4 text-sm min-[360px]:px-5 min-[360px]:text-[15px] sm:h-11",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
  /** The hero CTA. */
  xl: "h-14 px-10 text-lg sm:h-16 sm:text-xl",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap transition-[transform,background-color,color] duration-300 ease-out-expo hover:-translate-y-px ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}
