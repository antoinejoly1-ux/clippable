"use client";

import { useEffect, useRef, useState } from "react";

/*
 * TODO(client): confirm the agent integration (e.g. an MCP server) ships before launch,
 * and which providers it supports. Logos: LobeHub icons (MIT), used to name integrations.
 */
const AGENTS = [
  { id: "claude", name: "Claude" },
  { id: "openai", name: "ChatGPT" },
  { id: "grok", name: "Grok" },
  { id: "gemini", name: "Gemini" },
  { id: "perplexity", name: "Perplexity" },
  { id: "deepseek", name: "DeepSeek" },
  { id: "mistral", name: "Mistral" },
  { id: "copilot", name: "Copilot" },
] as const;

/* Four tiles in an arc above the headline, four below. Positions are % of the stage. */
const SPOTS = [
  { x: 14, y: 20, s: 1, r: -8 },
  { x: 33, y: 11, s: 1.15, r: -3 },
  { x: 67, y: 12, s: 1.1, r: 4 },
  { x: 86, y: 21, s: 0.95, r: 8 },
  { x: 13, y: 79, s: 0.95, r: 6 },
  { x: 32, y: 89, s: 1.05, r: 2 },
  { x: 68, y: 88, s: 1.15, r: -4 },
  { x: 87, y: 78, s: 1, r: -7 },
];

export function AgentsSection() {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="agents"
      aria-labelledby="agents-title"
      className="scroll-mt-16 overflow-hidden bg-bg py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
        <div
          ref={ref}
          data-shown={shown ? "true" : "false"}
          className="canvas-dots relative mx-auto h-[30rem] overflow-hidden rounded-[var(--radius-card)] border border-border sm:h-[38rem]"
        >
          {AGENTS.map((a, i) => {
            const spot = SPOTS[i];
            return (
              <span
                key={a.id}
                aria-hidden="true"
                className="agent-tile absolute -translate-x-1/2 -translate-y-1/2"
                style={
                  {
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    "--s": spot.s,
                    "--r": `${spot.r}deg`,
                    "--d": `${i * 80}ms`,
                    "--f": `${(i % 4) * 0.7}s`,
                  } as React.CSSProperties
                }
              >
                <span className="agent-float block">
                  <span className="flex size-14 items-center justify-center rounded-[16px] border border-border bg-bg shadow-[0_18px_36px_-18px_rgb(1_8_43/0.45)] sm:size-[4.5rem] sm:rounded-[20px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/media/agents/${a.id}.svg`}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      className="size-7 sm:size-9"
                    />
                  </span>
                </span>
              </span>
            );
          })}

          <div className="relative grid h-full place-items-center px-6 text-center">
            <div>
              <h2
                id="agents-title"
                className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance text-fg"
              >
                Connect your agents.
              </h2>
              <p className="mx-auto mt-4 max-w-[30ch] text-lg text-pretty text-fg-muted sm:text-xl">
                Clip, review and post from the AI you already use.
              </p>
              <ul className="sr-only">
                {AGENTS.map((a) => (
                  <li key={a.id}>{a.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
