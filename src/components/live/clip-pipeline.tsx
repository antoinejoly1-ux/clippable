"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { LazyVideo } from "@/components/lazy-video";
import { PlatformIcon, platforms } from "@/components/platform-icons";

const COLS = 8;
const ROWS = 4;
const TOTAL = COLS * ROWS;
const CLIP_MS = 95; // pace of each row, left to right
const ROW_DELAY_MS = 500; // every row runs at once, each starting 0.5s after the one above
const HOLD_MS = 1800;
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

  /*
   * One flowing line, edge to edge: it enters the canvas, threads through each node's centre
   * and leaves the other side. Points are smoothed with Catmull-Rom, so the line waves
   * between the staggered nodes. Phones stack the nodes, so the line runs top to bottom.
   */
  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    const nodes = nodeRefs.current;
    if (!canvas || nodes.some((n) => !n)) return;
    const c = canvas.getBoundingClientRect();
    const r = nodes.map((n) => n!.getBoundingClientRect());
    const horizontal = r[1].left > r[0].right;
    const centres = r.map((b) => [b.left + b.width / 2 - c.left, b.top + b.height / 2 - c.top]);
    const pts: number[][] = horizontal
      ? [[0, centres[0][1] + 40], ...centres, [c.width, centres[2][1] - 40]]
      : [[centres[0][0] - 30, 0], ...centres, [centres[2][0] + 30, c.height]];
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const k = 1 / 5; // tension: lower is tighter
      d += `C${p1[0] + (p2[0] - p0[0]) * k} ${p1[1] + (p2[1] - p0[1]) * k} ${
        p2[0] - (p3[0] - p1[0]) * k
      } ${p2[1] - (p3[1] - p1[1]) * k} ${p2[0]} ${p2[1]}`;
    }
    setPaths([d]);
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
          clock = window.setInterval(tick, 30);
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
        {/* The flow line, behind the nodes */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
          {paths.map((d, i) => (
            <g key={i} fill="none" strokeLinecap="round">
              <path
                d={d}
                stroke="color-mix(in oklab, var(--fg) 16%, transparent)"
                strokeWidth="3"
              />
              {/* A soft glow travelling with the pulse */}
              <path
                d={d}
                stroke="var(--color-sky)"
                strokeWidth="12"
                pathLength={1}
                className="flow-pulse opacity-40 blur-[6px]"
              />
              <path
                d={d}
                stroke="var(--color-electric)"
                strokeWidth="3.5"
                pathLength={1}
                className="flow-pulse"
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
                className="flex min-h-[4.5rem] flex-wrap content-center justify-center gap-x-0.5 gap-y-1 text-center text-[1.35rem] leading-tight font-extrabold tracking-[-0.035em] text-fg"
              >
                {captions[line].map((w, i) => (
                  <span
                    key={`${line}-${i}`}
                    className="caption-word rounded-[4px] px-[3px]"
                    data-on={i === word ? "true" : "false"}
                    style={{ animationDelay: `${i * 45}ms` }}
                  >
                    {w}
                  </span>
                ))}
              </p>
              {/* The brand kit the template applies: colours and typeface */}
              <div
                aria-hidden="true"
                className="mt-5 flex items-center justify-between border-t border-border pt-4"
              >
                <span className="flex gap-1.5">
                  <span className="size-6 rounded-[5px] bg-electric" />
                  <span className="size-6 rounded-[5px] border border-border bg-white" />
                  <span className="size-6 rounded-[5px] bg-ink" />
                </span>
                <span className="flex h-6 items-center rounded-[5px] border border-border px-1.5 text-[13px] font-bold tracking-[-0.02em] text-fg">
                  Aa
                </span>
              </div>
              <span className="sr-only">
                Brand colours blue, white and black, with a caption font.
              </span>
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
              <span className="sr-only">Finished vertical clips, made automatically.</span>
              <ul aria-hidden="true" className="grid grid-cols-8 gap-1.5">
                {Array.from({ length: TOTAL }, (_, k) => (
                  <li key={k} className="relative aspect-[9/16] overflow-hidden rounded-[4px]">
                    {isFilled(k, elapsed) && (
                      <div className="absolute inset-0 animate-[clip-pop_260ms_var(--ease-out-expo)_both]">
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
        {/* Live counters would chatter in a screen reader; the label carries the meaning. */}
        <span aria-hidden="true" className="font-mono text-fg-muted tabular-nums">
          {meta}
        </span>
      </figcaption>
      {children}
    </figure>
  );
}
