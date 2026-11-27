"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { site } from "@/lib/site";

/*
 * TODO(client): confirm the agent integration (e.g. an MCP server) ships before launch,
 * and which providers it supports. Logos: LobeHub icons (MIT), used to name integrations.
 */
const AGENTS = [
  { id: "openai", name: "ChatGPT" },
  { id: "gemini", name: "Gemini" },
  { id: "claude", name: "Claude" }, // centre: the dock rests magnified on it
  { id: "grok", name: "Grok" },
  { id: "deepseek", name: "DeepSeek" },
] as const;

/** More integrations, shown as a small row under the button. */
const MORE = ["copilot", "perplexity", "mistral", "meta", "qwen", "cursor"];

/** Magnification: icons near the pointer grow, up to MAX× at the pointer. */
const MAX = 1.45;
const RANGE_STEPS = 2.2; // falloff radius, in icon widths

export function AgentsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLUListElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // macOS-style magnification. Writes --m straight to each item; no re-renders.
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const items = Array.from(dock.querySelectorAll<HTMLElement>(".dock-item"));
    const probe = dock.querySelector<HTMLElement>("[data-probe]");
    let raf = 0;
    let x = 0;
    // The dock is centred, so its centre never moves as icons grow. Each icon's resting centre is
    // that centre plus a fixed step (icon + gap), read from a hidden probe at the base size.
    let step = 0;
    const measureStep = () => {
      const gap = parseFloat(getComputedStyle(dock).columnGap) || 0;
      step = (probe?.offsetWidth ?? 0) + gap;
    };
    measureStep();

    const magnify = (px: number | null) => {
      const r = dock.getBoundingClientRect();
      const mid = r.left + r.width / 2;
      const at = px ?? mid; // no pointer: rest magnified on the centre icon (Claude)
      const n = items.length;
      items.forEach((item, i) => {
        const centre = mid + (i - (n - 1) / 2) * step;
        const t = Math.max(0, 1 - Math.abs(at - centre) / (step * RANGE_STEPS));
        // Cosine falloff reads smoother than linear, like the real dock.
        const m = 1 + (MAX - 1) * (0.5 - 0.5 * Math.cos(Math.PI * t));
        item.style.setProperty("--m", m.toFixed(3));
      });
    };
    const apply = () => {
      raf = 0;
      magnify(x);
    };
    const rest = () => magnify(null);
    rest();

    const onMove = (e: PointerEvent) => {
      if (!fine.matches || still.matches || e.pointerType !== "mouse") return;
      x = e.clientX;
      // While the pointer is on the dock, icons follow it 1:1; the ease is only for settling.
      dock.dataset.tracking = "true";
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      delete dock.dataset.tracking;
      rest();
    };
    const onResize = () => {
      measureStep();
      onLeave();
    };

    dock.addEventListener("pointermove", onMove);
    dock.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      dock.removeEventListener("pointermove", onMove);
      dock.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Click an icon and it bounces, like an app launching.
  const bounce = (e: React.MouseEvent<HTMLElement>) => {
    const icon = e.currentTarget;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    icon.dataset.bounce = "false";
    void icon.offsetWidth;
    icon.dataset.bounce = "true";
  };

  return (
    <section
      id="agents"
      aria-labelledby="agents-title"
      className="scroll-mt-20 overflow-hidden bg-bg py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        <div
          ref={ref}
          data-shown={shown ? "true" : "false"}
          className="flex flex-col items-center text-center"
        >
          {/* The dock. Fixed-height stage so magnified icons grow upward without shifting the page. */}
          <div aria-hidden="true" className="dock flex h-[calc(var(--base)*1.55+3rem)] items-end">
            <ul
              ref={dockRef}
              className="dock-tray relative flex h-[calc(var(--base)+1.25rem)] items-end gap-2.5 rounded-[calc(var(--base)*0.3)] border border-border/70 bg-bg-subtle/70 px-2.5 pb-2.5 shadow-[0_30px_60px_-30px_rgb(1_8_43/0.4),inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-xl sm:gap-3 sm:px-3 sm:pb-3"
            >
              <span data-probe className="pointer-events-none invisible absolute w-[var(--base)]" />
              {AGENTS.map((a, i) => (
                <li
                  key={a.id}
                  className="dock-item relative shrink-0"
                  style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
                >
                  <span className="dock-label pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 rounded-[6px] bg-midnight/90 px-2.5 py-1 text-sm font-medium whitespace-nowrap text-white">
                    {a.name}
                  </span>
                  <span
                    onClick={bounce}
                    onAnimationEnd={(e) => (e.currentTarget.dataset.bounce = "false")}
                    className="dock-icon ui-light flex size-full items-center justify-center rounded-[22%] border border-border bg-bg shadow-[0_8px_16px_-8px_rgb(1_8_43/0.35)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/media/agents/${a.id}.svg`}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      draggable={false}
                      className="size-[56%] select-none"
                    />
                  </span>
                  {/* Running indicator */}
                  <span className="dock-run absolute -bottom-[7px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-fg-muted/70 sm:-bottom-2 sm:size-1.5" />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex max-w-[48rem] flex-col items-center sm:mt-12">
            <h2
              id="agents-title"
              className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance text-fg"
            >
              <span className="block text-fg-muted">Of course.</span>
              Connect your agents.
            </h2>
            <p className="mt-5 max-w-[34rem] text-lg text-pretty text-fg-muted">
              Let Claude, ChatGPT or Gemini find your best moments, review the clips and post them
              for you.
            </p>
            <ul className="sr-only">
              {AGENTS.map((a) => (
                <li key={a.id}>{a.name}</li>
              ))}
            </ul>
            <div className="mt-7">
              <Button href={site.signupUrl} size="lg">
                Create account
              </Button>
            </div>
            {/* TODO(client): confirm the integration count. */}
            <p className="mt-6 flex items-center gap-3 text-sm text-fg-muted">
              <span aria-hidden="true" className="ui-light flex -space-x-1.5">
                {MORE.map((id) => (
                  <span
                    key={id}
                    className="flex size-7 items-center justify-center rounded-full bg-bg shadow-[0_2px_6px_-2px_rgb(1_8_43/0.25)] ring-2 ring-bg"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/media/agents/${id}.svg`}
                      alt=""
                      width={16}
                      height={16}
                      loading="lazy"
                      className="size-4"
                    />
                  </span>
                ))}
              </span>
              <span>
                Integrates with <span className="font-medium text-fg">30+ AI tools</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
