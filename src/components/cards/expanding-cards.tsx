import type { ReactNode } from "react";

export type ExpandingCard = {
  /** Muted lead in the big title, e.g. "01". */
  index: string;
  /** Strong part of the big title, e.g. "Set up". */
  title: string;
  /** The visual in the middle of the card. */
  visual: ReactNode;
  heading: ReactNode;
  body: ReactNode;
  /** Optional full-bleed background behind the dot grid (image or video). */
  background?: ReactNode;
  tone?: "light" | "dark";
  /** Corner the dark sky grows from. Text over the dark part turns white. */
  sky?: "bl" | "tl" | "br";
};

const SKY = {
  bl: { surface: "sky-bl", titleLight: false, copyLight: true },
  tl: { surface: "sky-tl", titleLight: true, copyLight: false },
  br: { surface: "sky-br", titleLight: false, copyLight: true },
} as const;

/**
 * Three cards at a third each. Hover or focus one and it takes half the row while the
 * others share the rest. Stacks on small screens.
 */
export function ExpandingCards({ cards, label }: { cards: ExpandingCard[]; label: string }) {
  return (
    <ul className="xcards" aria-label={label}>
      {cards.map((c) => {
        const dark = c.tone === "dark";
        const sky = c.sky ? SKY[c.sky] : null;
        const titleLight = dark || !!sky?.titleLight;
        const copyLight = dark || !!sky?.copyLight;
        return (
          <li
            key={c.index}
            tabIndex={0}
            aria-labelledby={`xcard-${c.index}`}
            className={`xcard group/x relative isolate flex h-[34rem] flex-col overflow-hidden rounded-[var(--radius-card)] border outline-none focus-visible:ring-2 focus-visible:ring-blue lg:h-[38rem] ${
              dark
                ? "border-white/10 bg-midnight text-white"
                : `${sky?.surface ?? "bg-bg-subtle"} border-border text-fg`
            }`}
          >
            {c.background}
            <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 -z-10" />
            <p
              className={`xcard-title relative px-7 pt-7 text-[clamp(2.25rem,3.3vw,3.75rem)] leading-none font-medium tracking-[-0.045em] whitespace-nowrap ${titleLight ? "text-white" : "text-fg"}`}
            >
              <span className={titleLight ? "text-white/50" : "text-fg-subtle"}>{c.index}</span>{" "}
              {c.title}
            </p>
            <div className="xcard-fade relative flex min-h-0 flex-1 items-center justify-center px-6 transition-[transform,opacity] duration-[460ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/x:scale-[1.03]">
              {c.visual}
            </div>
            <div className="xcard-fade relative px-7 pb-7 transition-opacity duration-[460ms] ease-[cubic-bezier(0.65,0,0.35,1)]">
              <h3
                id={`xcard-${c.index}`}
                className={`text-xl font-medium tracking-[-0.02em] ${copyLight ? "text-white" : "text-fg"}`}
              >
                {c.heading}
              </h3>
              <div
                className={`mt-2 max-w-[46ch] text-[0.95rem] leading-relaxed ${copyLight ? "text-white/75" : "text-fg-muted"}`}
              >
                {c.body}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
