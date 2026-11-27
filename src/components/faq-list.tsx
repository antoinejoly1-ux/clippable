"use client";

import { useId, useState } from "react";

/**
 * FAQ accordion. Rows highlight on hover; opening one animates its height (grid 0fr → 1fr)
 * and closes the others. Answers stay in the DOM, so crawlers and in-page search see them.
 */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => {
        const on = open === i;
        return (
          <li
            key={item.q}
            className={`rounded-[var(--radius-card)] border transition-[background-color,border-color,box-shadow] duration-300 ${
              on
                ? "border-border bg-bg-subtle shadow-[0_18px_40px_-30px_rgb(1_8_43/0.45)]"
                : "border-transparent hover:border-border hover:bg-bg-subtle/70"
            }`}
          >
            <h3>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="group/q flex w-full cursor-pointer items-center justify-between gap-6 rounded-[var(--radius-card)] px-5 py-5 text-left text-[17px] font-medium tracking-[-0.01em] text-fg select-none [-webkit-tap-highlight-color:transparent]"
              >
                {item.q}
                <span
                  aria-hidden="true"
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-[background-color,color,rotate,scale] duration-500 ease-out-expo group-active/q:scale-90 ${
                    on ? "rotate-45 bg-midnight text-white" : "bg-bg-subtle text-fg"
                  }`}
                >
                  <svg viewBox="0 0 16 16" className="size-3.5">
                    <path
                      d="M8 3v10M3 8h10"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`${id}-${i}`}
              role="region"
              aria-hidden={!on}
              inert={!on}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo ${
                on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`max-w-[62ch] px-5 pb-6 text-base leading-relaxed text-pretty text-fg-muted transition-transform duration-500 ease-out-expo ${
                    on ? "translate-y-0" : "-translate-y-2"
                  }`}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
