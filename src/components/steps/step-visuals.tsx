"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PlatformIcon, platforms, type Platform } from "@/components/platform-icons";
import { streamers } from "@/lib/streamers";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Runs `run` only while `ref` is on screen; `run` returns its own cleanup. */
function useWhileVisible(
  ref: React.RefObject<HTMLElement | null>,
  run: () => () => void,
  deps: React.DependencyList = [],
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let stop: (() => void) | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !stop) stop = run();
        else if (!e.isIntersecting && stop) {
          stop();
          stop = undefined;
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const Tick = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
  >
    <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Cursor = () => (
  <svg viewBox="0 0 24 24" className="size-6 drop-shadow-[0_4px_8px_rgb(1_8_43/0.35)]">
    <path
      d="M4 2.5v17.2l4.6-4.3 3 6.6 3.1-1.4-3-6.5h6.3L4 2.5Z"
      fill="var(--color-midnight)"
      stroke="white"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────── */
/* 01 · Set up: a cursor ticks streamers in a list, then picks a colour */
/* ─────────────────────────────────────────────────────────────────── */

const LIST = streamers.slice(0, 4);
const SWATCHES = [
  { name: "White", className: "bg-white ring-1 ring-border" },
  { name: "Electric", className: "bg-electric" },
  { name: "Sky", className: "bg-sky" },
  { name: "Midnight", className: "bg-midnight" },
];
// The cursor's route: three streamers, then the electric swatch.
const ROUTE = [
  { kind: "row", i: 0 },
  { kind: "row", i: 1 },
  { kind: "row", i: 3 },
  { kind: "swatch", i: 1 },
] as const;

export function SetupVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const swatchRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [swatch, setSwatch] = useState<number | null>(null);
  const [press, setPress] = useState(0);

  useWhileVisible(rootRef, () => {
    if (reducedMotion()) {
      const t = window.setTimeout(() => {
        setPicked([0, 1, 3]);
        setSwatch(1);
      }, 0);
      return () => window.clearTimeout(t);
    }
    const root = rootRef.current!;
    const cursor = cursorRef.current!;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    let step = 0;

    const moveTo = (el: HTMLElement | null | undefined, xFrac: number) => {
      if (!el) return;
      const r = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      cursor.style.transform = `translate3d(${b.left - r.left + b.width * xFrac}px, ${
        b.top - r.top + b.height * 0.45
      }px, 0)`;
      cursor.style.opacity = "1";
    };

    const next = () => {
      if (step >= ROUTE.length) {
        later(() => {
          setPicked([]);
          setSwatch(null);
          step = 0;
          later(next, 700);
        }, 2000);
        return;
      }
      const target = ROUTE[step];
      if (target.kind === "row") moveTo(rowRefs.current[target.i], 0.86);
      else moveTo(swatchRefs.current[target.i], 0.55);
      later(() => {
        setPress((n) => n + 1);
        if (target.kind === "row") setPicked((p) => [...p, target.i]);
        else setSwatch(target.i);
        step += 1;
        later(next, 420);
      }, 620);
    };
    later(next, 400);
    return () => timers.forEach((t) => window.clearTimeout(t));
  });

  return (
    <div ref={rootRef} className="relative w-[min(17rem,100%)]" aria-hidden="true">
      <ul className="rounded-[10px] border border-border bg-bg p-1.5 shadow-[0_18px_40px_-24px_rgb(1_8_43/0.45)]">
        {LIST.map((s, i) => {
          const on = picked.includes(i);
          return (
            <li
              key={s.id}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className={`flex items-center gap-2.5 rounded-[7px] px-2 py-1.5 transition-colors duration-300 ${
                on ? "bg-bg-subtle" : ""
              }`}
            >
              <Image
                src={s.avatar}
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-[7px] object-cover"
              />
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-fg">
                {s.name}
              </span>
              <span
                className="flex size-4 items-center justify-center rounded-[4px]"
                style={{ backgroundColor: platforms[s.platform].color }}
              >
                <PlatformIcon
                  platform={s.platform}
                  className={`size-2.5 ${s.platform === "kick" ? "text-black" : "text-white"}`}
                />
              </span>
              <span
                className={`flex size-[18px] items-center justify-center rounded-[5px] border transition-colors duration-200 ${
                  on ? "border-electric bg-electric text-white" : "border-border bg-bg"
                }`}
              >
                {on && <Tick className="size-3 animate-[clip-pop_300ms_var(--ease-spring)_both]" />}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-2.5 flex items-center justify-between rounded-[10px] border border-border bg-bg px-3 py-2.5 shadow-[0_18px_40px_-24px_rgb(1_8_43/0.45)]">
        <span className="text-[12px] font-medium text-fg">Caption color</span>
        <span className="flex gap-1.5">
          {SWATCHES.map((c, i) => (
            <span
              key={c.name}
              ref={(el) => {
                swatchRefs.current[i] = el;
              }}
              className={`size-5 rounded-[5px] transition-shadow duration-200 ${c.className} ${
                swatch === i ? "shadow-[0_0_0_2px_var(--bg),0_0_0_4px_var(--color-electric)]" : ""
              }`}
            />
          ))}
        </span>
      </div>
      <div
        ref={cursorRef}
        className="pointer-events-none absolute top-0 left-0 z-10 opacity-0 transition-[transform,opacity] duration-[600ms] ease-out-expo"
      >
        <span key={press} className="block animate-[cursor-click_340ms_ease-out]">
          <Cursor />
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* 02 · Clip it: clips are made one by one into a grid                  */
/* ─────────────────────────────────────────────────────────────────── */

const GRID = 12;
const GRID_MS = 260;

export function ClipVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [made, setMade] = useState(0);

  useWhileVisible(rootRef, () => {
    if (reducedMotion()) {
      const t = window.setTimeout(() => setMade(GRID), 0);
      return () => window.clearTimeout(t);
    }
    let n = 0;
    let timer: number;
    const tick = () => {
      if (n >= GRID) {
        timer = window.setTimeout(() => {
          n = 0;
          setMade(0);
          timer = window.setTimeout(tick, 500);
        }, 1800);
        return;
      }
      n += 1;
      setMade(n);
      timer = window.setTimeout(tick, GRID_MS);
    };
    timer = window.setTimeout(tick, 300);
    return () => window.clearTimeout(timer);
  });

  return (
    <div
      ref={rootRef}
      className="w-[min(17rem,100%)] rounded-[10px] border border-border bg-bg p-2.5 shadow-[0_18px_40px_-24px_rgb(1_8_43/0.45)]"
      aria-hidden="true"
    >
      <div className="mb-2 flex items-center justify-between px-0.5 text-[11px]">
        <span className="flex items-center gap-1.5 font-medium text-fg">
          <span className="size-1.5 animate-live rounded-full bg-live" />
          Making clips
        </span>
        <span className="font-mono text-fg-muted tabular-nums">
          {made}/{GRID}
        </span>
      </div>
      <ul className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: GRID }, (_, k) => (
          <li
            key={k}
            className="relative aspect-[9/16] overflow-hidden rounded-[4px] border border-dashed border-border"
          >
            {k < made && (
              <span className="absolute inset-0 animate-[clip-pop_360ms_var(--ease-out-expo)_both]">
                <Image
                  src={`/media/pipeline/clip-${((k * 3) % 32) + 1}.webp`}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* 03 · Post: an outbox. Each clip uploads, ticks green, and is sent    */
/* ─────────────────────────────────────────────────────────────────── */

const TARGETS: Platform[] = ["tiktok", "youtubeShorts", "instagram", "x"];
type Phase = "uploading" | "posted" | "sent";

export function PostVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [head, setHead] = useState(0); // id of the clip at the top of the outbox
  const [phase, setPhase] = useState<Phase>("uploading");

  useWhileVisible(rootRef, () => {
    if (reducedMotion()) return () => {};
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const cycle = () => {
      setPhase("uploading");
      later(() => setPhase("posted"), 900);
      later(() => setPhase("sent"), 1500);
      later(() => {
        setHead((h) => h + 1);
        cycle();
      }, 2000);
    };
    cycle();
    return () => timers.forEach((t) => window.clearTimeout(t));
  });

  const rows = [head, head + 1, head + 2, head + 3];

  return (
    <div
      ref={rootRef}
      className="w-[min(17rem,100%)] overflow-hidden rounded-[10px] border border-border bg-bg p-1.5 shadow-[0_18px_40px_-24px_rgb(1_8_43/0.45)]"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between px-2 pt-1 pb-2 text-[11px]">
        <span className="font-medium text-fg">Posting</span>
        <span className="font-mono text-fg-muted tabular-nums">{head} sent</span>
      </div>
      <ul className="relative h-[13.5rem]">
        {rows.map((id, slot) => {
          const platform = TARGETS[id % TARGETS.length];
          const top = slot === 0;
          const leaving = top && phase === "sent";
          return (
            <li
              key={id}
              className={`absolute inset-x-0 flex items-center gap-2.5 rounded-[7px] px-2 py-1.5 transition-[transform,opacity] duration-500 ease-out-expo ${
                slot === 3 ? "animate-[clip-pop_400ms_var(--ease-out-expo)_both]" : ""
              }`}
              style={{
                transform: leaving
                  ? `translate3d(70%, ${slot * 3.4}rem, 0) rotate(-4deg)`
                  : `translate3d(0, ${slot * 3.4}rem, 0)`,
                opacity: leaving ? 0 : slot === 3 ? 0.5 : 1,
              }}
            >
              <span className="relative block aspect-[9/16] w-7 shrink-0 overflow-hidden rounded-[4px]">
                <Image
                  src={`/media/pipeline/clip-${((id * 5) % 32) + 1}.webp`}
                  alt=""
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-fg">
                  Clip {String(id + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 block h-1 overflow-hidden rounded-full bg-bg-subtle">
                  <span
                    className="block h-full rounded-full bg-electric transition-[width] ease-out"
                    style={{
                      width: top ? (phase === "uploading" ? "100%" : "100%") : "0%",
                      transitionDuration: top && phase === "uploading" ? "850ms" : "0ms",
                    }}
                  />
                </span>
              </span>
              <span
                className="flex size-5 items-center justify-center rounded-[4px] text-white"
                style={{
                  backgroundColor:
                    platform === "tiktok" ? "var(--color-ink)" : platforms[platform].color,
                }}
              >
                <PlatformIcon platform={platform} className="size-3" />
              </span>
              <span
                className={`flex size-6 items-center justify-center rounded-full transition-all duration-300 ${
                  top && phase !== "uploading"
                    ? "scale-100 bg-success text-white"
                    : "scale-90 border border-border text-transparent"
                }`}
              >
                <Tick className="size-3.5" />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
