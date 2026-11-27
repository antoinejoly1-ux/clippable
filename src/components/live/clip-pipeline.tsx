"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { LazyVideo } from "@/components/lazy-video";
import { PlatformIcon, platforms } from "@/components/platform-icons";

const TOTAL = 32;
const CLIP_MS = 170; // one new clip every 170ms: production speed
const HOLD_MS = 2600;

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
  const [made, setMade] = useState(6);
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

  /* Production: clips fill the grid quickly, hold, then the batch starts over. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = window.setTimeout(() => setMade(TOTAL), 0);
      return () => window.clearTimeout(t);
    }
    let timer: number | undefined;
    let wordTimer: number | undefined;
    let count = 6;
    const tick = () => {
      if (count >= TOTAL) {
        timer = window.setTimeout(() => {
          count = 0;
          setMade(0);
          timer = window.setTimeout(tick, 500);
        }, HOLD_MS);
        return;
      }
      count += 1;
      setMade(count);
      timer = window.setTimeout(tick, CLIP_MS);
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
        window.clearTimeout(timer);
        window.clearInterval(wordTimer);
        if (e.isIntersecting) {
          timer = window.setTimeout(tick, 600);
          wordTimer = window.setInterval(stepWord, 420);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(canvas);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      window.clearInterval(wordTimer);
    };
  }, []);

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

          {/* 2 · Brand template */}
          <Node label="Brand template" meta="9:16" className="w-[200px] lg:mt-14">
            <div
              ref={(el) => {
                nodeRefs.current[1] = el;
              }}
              className="overflow-hidden rounded-[10px] border border-border bg-bg shadow-[0_18px_40px_-24px_rgb(1_8_43/0.5)]"
            >
              <div className="relative aspect-[9/16] bg-midnight">
                <Image
                  src="/media/pipeline/template-frame.webp"
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                <div className="absolute inset-x-3 top-[62%] flex flex-wrap justify-center gap-x-1 gap-y-0.5 text-center text-[14px] leading-[1.1] font-extrabold tracking-[-0.01em] text-white [text-shadow:0_2px_0_rgb(1_8_43/0.6)]">
                  {captions[line].map((w, i) => (
                    <span
                      key={`${line}-${i}`}
                      className={`rounded-[3px] px-1 transition-colors duration-150 ${i === word ? "bg-electric" : ""}`}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 p-3 text-[11px]">
                <dt className="text-fg-muted">Font</dt>
                <dd className="text-right font-medium text-fg">Geist Bold</dd>
                <dt className="text-fg-muted">Colors</dt>
                <dd className="flex justify-end gap-1">
                  <span className="size-3.5 rounded-[3px] bg-white ring-1 ring-border" />
                  <span className="size-3.5 rounded-[3px] bg-electric" />
                  <span className="size-3.5 rounded-[3px] bg-midnight" />
                </dd>
                <dt className="text-fg-muted">Captions</dt>
                <dd className="text-right font-medium text-fg">Lower third</dd>
                <dt className="text-fg-muted">Length</dt>
                <dd className="text-right font-medium text-fg">15–45s</dd>
              </dl>
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
                  <li
                    key={k}
                    className="relative aspect-[9/16] overflow-hidden rounded-[4px] bg-bg-subtle"
                  >
                    {k < made && (
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
