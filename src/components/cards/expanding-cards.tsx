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
};

/**
 * Three cards at a third each. Hover or focus one and it takes half the row while the
 * others share the rest. Stacks on small screens.
 */
export function ExpandingCards({
  cards,
  label,
  sky = false,
}: {
  cards: ExpandingCard[];
  label: string;
  /**
   * One hero-style sky across the whole row. Each card is a window onto it (the layer is
   * sized to the row, and clip-path trims it to the card), so the gradient reads as one
   * piece even while the cards resize. Phones stack the cards, so each gets the full sky.
   */
  sky?: boolean;
}) {
  return (
    <ul className="xcards relative" aria-label={label}>
      {cards.map((c) => {
        const dark = c.tone === "dark";
        // The sky rises from the bottom: titles stay ink, the copy below sits on the dark.
        const titleLight = dark;
        const copyLight = dark || sky;
        return (
          <li
            key={c.index}
            tabIndex={0}
            aria-labelledby={`xcard-${c.index}`}
            className={`xcard group/x isolate flex h-[34rem] flex-col rounded-[var(--radius-card)] border outline-none [clip-path:inset(0_round_var(--radius-card))] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white max-lg:relative lg:h-[38rem] ${
              dark ? "border-white/10 bg-midnight text-white" : "border-border bg-bg-subtle text-fg"
            }`}
          >
            {c.background}
            {sky && (
              <>
                <div
                  aria-hidden="true"
                  className="steps-sky pointer-events-none absolute inset-0 -z-10"
                />
                <div
                  aria-hidden="true"
                  className="grain pointer-events-none absolute inset-0 -z-10"
                />
              </>
            )}
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
