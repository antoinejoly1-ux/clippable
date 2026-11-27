"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { site } from "@/lib/site";

/*
 * TODO(client): confirm the agent integration (e.g. an MCP server) ships before launch,
 * and which providers it supports. Logos: LobeHub icons (MIT), used to name integrations.
 */
const AGENTS = [
  { id: "claude", name: "Claude" },
  { id: "openai", name: "ChatGPT" },
  { id: "gemini", name: "Gemini" },
  { id: "grok", name: "Grok" },
  { id: "perplexity", name: "Perplexity" },
  { id: "copilot", name: "Copilot" },
  { id: "mistral", name: "Mistral" },
  { id: "deepseek", name: "DeepSeek" },
] as const;

/** Magnification: icons within RANGE px of the pointer grow, up to MAX× at the pointer. */
const MAX = 1.6;
const RANGE = 150;

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
    let raf = 0;
    let x = 0;
    // The dock is centred, so its centre never moves as icons grow. Each icon's resting centre is
    // that centre plus a fixed step, which avoids measuring elements mid-transition.
    let step = 0;
    const measureStep = () => {
      if (items.length > 1) step = items[1].offsetLeft - items[0].offsetLeft;
    };
    measureStep();

    const apply = () => {
      raf = 0;
      const r = dock.getBoundingClientRect();
      const mid = r.left + r.width / 2;
      const n = items.length;
      items.forEach((item, i) => {
        const centre = mid + (i - (n - 1) / 2) * step;
        const t = Math.max(0, 1 - Math.abs(x - centre) / RANGE);
        // Cosine falloff reads smoother than linear, like the real dock.
        const m = 1 + (MAX - 1) * (0.5 - 0.5 * Math.cos(Math.PI * t));
        item.style.setProperty("--m", m.toFixed(3));
      });
    };
    const onMove = (e: PointerEvent) => {
      if (!fine.matches || still.matches || e.pointerType !== "mouse") return;
      x = e.clientX;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      for (const item of items) item.style.setProperty("--m", "1");
    };
    const onResize = () => {
      onLeave();
      requestAnimationFrame(measureStep);
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
          className="canvas-dots flex flex-col items-center rounded-[var(--radius-card)] border border-border px-3 py-16 text-center sm:py-24"
        >
          {/* The dock. Fixed-height stage so magnified icons grow upward without shifting the page. */}
          <div aria-hidden="true" className="flex h-[6.5rem] items-end sm:h-[9rem]">
            <ul
              ref={dockRef}
              className="dock flex h-[calc(var(--base)+1rem)] items-end gap-1 rounded-[14px] border border-white/70 bg-white/60 px-2 pt-2 pb-2 shadow-[0_24px_48px_-24px_rgb(1_8_43/0.35),inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-xl sm:h-[calc(var(--base)+1.25rem)] sm:gap-2 sm:rounded-[22px] sm:px-2.5 sm:pb-2.5"
            >
              {AGENTS.map((a, i) => (
                <li
                  key={a.id}
                  className="dock-item relative shrink-0"
                  style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
                >
                  <span className="dock-label pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 rounded-[6px] bg-midnight/90 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white">
                    {a.name}
                  </span>
                  <span
                    onClick={bounce}
                    onAnimationEnd={(e) => (e.currentTarget.dataset.bounce = "false")}
                    className="dock-icon flex size-full items-center justify-center rounded-[22%] border border-border bg-bg shadow-[0_8px_16px_-8px_rgb(1_8_43/0.35)]"
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
                  <span className="absolute -bottom-[7px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-fg-muted/70 sm:-bottom-2" />
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-14 max-w-[16ch] px-2 text-[clamp(2.25rem,5.6vw,5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance text-fg sm:mt-16">
            Clip from the AI you already use.
          </p>

          <div className="mt-14 flex max-w-md flex-col items-center sm:mt-16">
            <h2 id="agents-title" className="text-lg font-semibold tracking-[-0.02em] text-fg">
              Connect your agents
            </h2>
            <p className="mt-2 text-base text-pretty text-fg-muted">
              Link Claude, ChatGPT, Gemini and more to Clippable. Ask them to find the best moments,
              review the clips and post them for you.
            </p>
            <ul className="sr-only">
              {AGENTS.map((a) => (
                <li key={a.id}>{a.name}</li>
              ))}
            </ul>
            <div className="mt-7">
              <Button href={site.signupUrl}>Create account</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
