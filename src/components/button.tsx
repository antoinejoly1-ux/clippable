import type { ReactNode } from "react";

/**
 * The site's one call-to-action button: a rounded rectangle (radius grows with size). Every CTA uses it so size, shape and type match.
 *  - primary: brand blue (default)    - inverse: white, for dark or video backgrounds
 *  - dark: midnight, for the header
 * Sizes: sm (header), md (52px) in-page, lg (60px) final CTA, xl (64px) hero.
 */
const variants = {
  /** Brand blue with depth: a top-lit gradient, an inner highlight and a soft blue glow. */
  primary:
    "bg-[linear-gradient(180deg,#3f80ff_0%,#1f55e0_55%,var(--color-royal)_100%)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3),inset_0_-1px_0_rgb(1_8_43/0.2),0_1px_2px_rgb(1_8_43/0.3),0_12px_28px_-12px_rgb(0_97_255/0.75)] hover:brightness-110 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-1px_0_rgb(1_8_43/0.2),0_1px_2px_rgb(1_8_43/0.3),0_18px_40px_-14px_rgb(0_97_255/0.9)]",
  inverse: "bg-white text-midnight hover:bg-sky",
  dark: "bg-midnight text-white hover:bg-royal",
} as const;

const sizes = {
  /** Header: compact on phones so logo, CTA and menu fit at 320px. */
  sm: "h-11 rounded-[10px] px-4 text-sm min-[360px]:px-5 min-[360px]:text-[15px] sm:h-11",
  md: "h-[3.25rem] rounded-[13px] px-7 text-[17px]",
  lg: "h-[3.75rem] rounded-[15px] px-9 text-lg",
  /** The hero CTA. */
  xl: "h-14 rounded-[14px] px-10 text-lg sm:h-16 sm:rounded-[16px] sm:text-xl",
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
      className={`inline-flex items-center justify-center font-medium whitespace-nowrap transition-[scale,background-color,color,box-shadow,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] select-none [-webkit-tap-highlight-color:transparent] active:scale-[0.97] active:duration-100 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}
