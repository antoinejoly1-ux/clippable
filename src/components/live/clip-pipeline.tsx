"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { LazyVideo } from "@/components/lazy-video";
import { PlatformIcon, platforms } from "@/components/platform-icons";

const COLS = 8;
const ROWS = 4;
const TOTAL = COLS * ROWS;
const CLIP_MS = 190; // pace of each row, left to right
const ROW_DELAY_MS = 1000; // every row runs at once, each starting 1s after the one above
const HOLD_MS = 2600;
const CYCLE_MS = (ROWS - 1) * ROW_DELAY_MS + (COLS - 1) * CLIP_MS + HOLD_MS;

const isFilled = (k: number, t: number) =>
  t >= Math.floor(k / COLS) * ROW_DELAY_MS + (k % COLS) * CLIP_MS;

const captions = [
  ["WAIT", "FOR", "IT"],
  ["HE", "ACTUALLY", "DID", "IT"],
  ["NO", "WAY", "THAT", "JUST", "HAPPENED"],
  ["CHAT", "WENT", "CRAZY"],
];

/**
 * A node-editor view of the product: live stream → brand template → finished clips,
 * joined by connectors with a travelling pulse. Desktop lays nodes out left to right;
 * phones stack them, and the connectors follow.
 */
export function ClipPipeline() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [line, setLine] = useState(0);
  const [word, setWord] = useState(0);

  /* Connectors: measured from the real node positions, so any layout works. */
  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    const nodes = nodeRefs.current;
    if (!canvas || nodes.some((n) => !n)) return;
    const c = canvas.getBoundingClientRect();
    const r = nodes.map((n) => n!.getBoundingClientRect());
    const horizontal = r[1].left > r[0].right;
    const next: string[] = [];
    for (let i = 0; i < r.length - 1; i++) {
      const a = r[i];
      const b = r[i + 1];
      if (horizontal) {
        const x1 = a.right - c.left;
        const y1 = a.top + a.height / 2 - c.top;
        const x2 = b.left - c.left;
        const y2 = b.top + b.height / 2 - c.top;
        const dx = (x2 - x1) * 0.55;
        next.push(`M${x1} ${y1}C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`);
      } else {
        const x1 = a.left + a.width / 2 - c.left;
        const y1 = a.bottom - c.top;
        const x2 = b.left + b.width / 2 - c.left;
        const y2 = b.top - c.top;
        const dy = (y2 - y1) * 0.55;
        next.push(`M${x1} ${y1}C${x1} ${y1 + dy} ${x2} ${y2 - dy} ${x2} ${y2}`);
      }
    }
    setPaths(next);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(measure);
    ro.observe(canvas);
    nodeRefs.current.forEach((n) => n && ro.observe(n));
    return () => ro.disconnect();
  }, [measure]);

  /* Production: all four rows fill together, each starting a second after the last. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = window.setTimeout(() => setElapsed(CYCLE_MS), 0);
      return () => window.clearTimeout(t);
    }
    let clock: number | undefined;
    let wordTimer: number | undefined;
    let start = 0;
    const filledAt = (t: number) => {
      let n = 0;
      for (let k = 0; k < TOTAL; k++) if (isFilled(k, t)) n += 1;
      return n;
    };
    let shown = -1;
    const tick = () => {
      let t = performance.now() - start;
      if (t >= CYCLE_MS) {
        start = performance.now();
        t = 0;
      }
      // Only re-render when a slot actually fills (or the batch resets).
      const n = filledAt(t);
      if (n !== shown) {
        shown = n;
        setElapsed(t);
      }
    };
    // Caption preview: the highlight steps word by word, then the next caption.
    let w = 0;
    let l = 0;
    const stepWord = () => {
      w += 1;
      if (w >= captions[l].length) {
        w = 0;
        l = (l + 1) % captions.length;
        setLine(l);
      }
      setWord(w);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearInterval(clock);
        window.clearInterval(wordTimer);
        if (e.isIntersecting) {
          start = performance.now();
          clock = window.setInterval(tick, 60);
          wordTimer = window.setInterval(stepWord, 420);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(canvas);
    return () => {
      io.disconnect();
      window.clearInterval(clock);
      window.clearInterval(wordTimer);
    };
  }, []);

  let made = 0;
  for (let k = 0; k < TOTAL; k++) if (isFilled(k, elapsed)) made += 1;

  return (
    <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
      <div
        ref={canvasRef}
        className="canvas-dots relative overflow-hidden rounded-[var(--radius-card)] border border-border px-5 py-14 sm:px-10 lg:px-12 lg:pt-20 lg:pb-14"
      >
        {/* Connectors */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
          {paths.map((d, i) => (
            <g key={i}>
              <path
                d={d}
                fill="none"
                stroke="color-mix(in oklab, var(--fg) 22%, transparent)"
                strokeWidth="1.25"
              />
              <path
                d={d}
                fill="none"
                stroke="var(--color-electric)"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
                className="flow-pulse"
                style={{ animationDelay: `${i * 1.3}s` }}
              />
            </g>
          ))}
        </svg>

        <div className="relative flex flex-col items-center gap-20 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          {/* 1 · Live stream */}
          <Node
            label="Live stream"
            meta="Kick · 1080p"
            className="w-full max-w-[380px] lg:-mt-28 lg:w-[30%]"
          >
            <div
              ref={(el) => {
                nodeRefs.current[0] = el;
              }}
              className="relative aspect-video overflow-hidden rounded-[10px] bg-midnight shadow-[0_18px_40px_-24px_rgb(1_8_43/0.5)]"
            >
              <LazyVideo
                poster="/media/pipeline/stream.webp"
                sources={[
                  {
                    src: "/media/pipeline/stream.av1.mp4",
                    type: 'video/mp4; codecs="av01.0.04M.08"',
                  },
                  { src: "/media/pipeline/stream.h264.mp4", type: "video/mp4" },
                ]}
                className="absolute inset-0 size-full object-cover"
              />
              <p className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-[4px] bg-midnight/70 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-white uppercase backdrop-blur">
                <span className="size-1.5 animate-live rounded-full bg-live" aria-hidden="true" />
                Live
              </p>
              <span
                className="absolute right-2.5 bottom-2.5 flex size-5 items-center justify-center rounded-[4px]"
                style={{ backgroundColor: platforms.kick.color }}
              >
                <PlatformIcon platform="kick" className="size-3 text-black" />
              </span>
            </div>
          </Node>

          {/* 2 · Brand template: just the caption style, nothing else */}
          <Node label="Brand template" meta="Captions" className="w-[240px] lg:mt-14">
            <div
              ref={(el) => {
                nodeRefs.current[1] = el;
              }}
              className="rounded-[10px] border border-border bg-bg px-5 py-6 shadow-[0_18px_40px_-24px_rgb(1_8_43/0.5)]"
            >
              <p
                aria-hidden="true"
                className="flex min-h-[4.5rem] flex-wrap content-center justify-center gap-x-1 gap-y-1 text-center text-[1.35rem] leading-tight font-extrabold tracking-[-0.02em] text-fg"
              >
                {captions[line].map((w, i) => (
                  <span
                    key={`${line}-${i}`}
                    className={`rounded-[4px] px-1.5 transition-colors duration-150 ${
                      i === word ? "bg-electric text-white" : ""
                    }`}
                  >
                    {w}
                  </span>
                ))}
              </p>
            </div>
          </Node>

          {/* 3 · Clips */}
          <Node
            label="Clips"
            meta={`${made}/${TOTAL}`}
            className="w-full max-w-[460px] lg:-mt-6 lg:w-[36%]"
          >
            <div
              ref={(el) => {
                nodeRefs.current[2] = el;
              }}
              className="rounded-[10px] border border-border bg-bg p-2.5 shadow-[0_18px_40px_-24px_rgb(1_8_43/0.5)]"
            >
              <ul
                className="grid grid-cols-8 gap-1.5"
                aria-label={`${made} of ${TOTAL} clips made`}
              >
                {Array.from({ length: TOTAL }, (_, k) => (
                  <li key={k} className="relative aspect-[9/16] overflow-hidden rounded-[4px]">
                    {isFilled(k, elapsed) && (
                      <div className="absolute inset-0 animate-[clip-pop_360ms_var(--ease-out-expo)_both]">
                        <Image
                          src={`/media/pipeline/clip-${k + 1}.webp`}
                          alt=""
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                        {/* One caption line in the template's style, one word highlighted */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-[14%] top-[64%] flex h-[3px] items-stretch justify-center gap-[2px]"
                        >
                          <span className="w-[30%] rounded-[1px] bg-white" />
                          <span
                            className="rounded-[1px] bg-electric"
                            style={{ width: `${22 + ((k * 13) % 20)}%` }}
                          />
                          <span className="w-[24%] rounded-[1px] bg-white" />
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Node>
        </div>
      </div>
    </div>
  );
}

function Node({
  label,
  meta,
  className,
  children,
}: {
  label: string;
  meta: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className={`relative ${className ?? ""}`}>
      <figcaption className="mb-2 flex items-baseline justify-between px-0.5 text-[12px]">
        <span className="font-medium text-fg">{label}</span>
        <span className="font-mono text-fg-muted tabular-nums">{meta}</span>
      </figcaption>
      {children}
    </figure>
  );
}
