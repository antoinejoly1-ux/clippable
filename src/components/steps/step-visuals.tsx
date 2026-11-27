"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LazyVideo } from "@/components/lazy-video";
import { PlatformIcon, platforms } from "@/components/platform-icons";
import { streamers } from "@/lib/streamers";

/*
 * Three looping product demos for the step cards, after flora.ai's: a real cursor glides
 * between targets (with a touch of motion blur), hovered rows open up, and every state
 * change is eased. Each demo only runs while it is on screen.
 */

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Runs `run` only while `ref` is on screen; `run` returns its own cleanup. */
function useWhileVisible(ref: React.RefObject<HTMLElement | null>, run: () => () => void) {
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
  }, []);
}

/** A tiny scheduler whose timers are all cleared together. */
function makeTimeline() {
  const timers: number[] = [];
  return {
    at: (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms)),
    clear: () => timers.forEach((t) => window.clearTimeout(t)),
  };
}

/**
 * Moves the demo cursor to a point inside `el`, in the root's local coordinates.
 * Cards scale slightly on hover, so screen pixels are converted back.
 */
function cursorTo(
  root: HTMLElement,
  cursor: HTMLElement,
  el: HTMLElement | null | undefined,
  fx = 0.5,
  fy = 0.5,
) {
  if (!el) return;
  const r = root.getBoundingClientRect();
  const b = el.getBoundingClientRect();
  const k = r.width / root.offsetWidth || 1;
  cursor.style.transform = `translate3d(${(b.left - r.left + b.width * fx) / k}px, ${
    (b.top - r.top + b.height * fy) / k
  }px, 0)`;
  // A brief motion blur while it travels, like a real screen recording.
  cursor.dataset.moving = "true";
  window.setTimeout(() => (cursor.dataset.moving = "false"), 380);
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

function DemoCursor({
  cursorRef,
  press,
}: {
  cursorRef: React.RefObject<HTMLDivElement | null>;
  press: number;
}) {
  return (
    <div
      ref={cursorRef}
      data-moving="false"
      className="demo-cursor pointer-events-none absolute top-0 left-0 z-20 opacity-0"
    >
      <span key={press} className="block animate-[cursor-click_320ms_ease-out]">
        <svg viewBox="0 0 24 24" className="size-[22px] drop-shadow-[0_3px_6px_rgb(1_8_43/0.35)]">
          <path
            d="M4 2.5v17.2l4.6-4.3 3 6.6 3.1-1.4-3-6.5h6.3L4 2.5Z"
            fill="var(--color-midnight)"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <span className="flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-border bg-bg px-1 font-mono text-[10px] text-fg-muted">
    {children}
  </span>
);

/* ─────────────────────────────────────────────────────────────────── */
/* 01 · Set up: an "Add streamers" menu. Rows open on hover and tick    */
/* ─────────────────────────────────────────────────────────────────── */

const pick = (id: string) => streamers.find((s) => s.id === id)!;
const MENU = ["n3on", "lacy", "clavicular", "plaqueboymax"].map(pick);
const STYLE_ROW = MENU.length; // index of the "My branding" row
const PICKS = [0, 2, 1, STYLE_ROW]; // the cursor's route

export function SetupVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const [picked, setPicked] = useState<number[]>([]);
  const [press, setPress] = useState(0);

  useWhileVisible(rootRef, () => {
    if (reducedMotion()) {
      const t = window.setTimeout(() => setPicked([...PICKS]), 0);
      return () => window.clearTimeout(t);
    }
    const root = rootRef.current!;
    const cursor = cursorRef.current!;
    const tl = makeTimeline();

    const loop = () => {
      setPicked([]);
      setHover(null);
      // Enter from below-left.
      cursor.style.transition = "none";
      cursor.style.opacity = "0";
      cursor.style.transform = `translate3d(-12px, ${root.offsetHeight + 10}px, 0)`;
      let t = 250;
      tl.at(t, () => {
        cursor.style.transition = "";
        cursor.style.opacity = "1";
      });
      PICKS.forEach((row) => {
        tl.at(t + 30, () => {
          cursorTo(root, cursor, rowRefs.current[row], 0.42, 0.5);
          setHover(row);
        });
        t += 760;
        tl.at(t, () => {
          setPress((n) => n + 1);
          setPicked((p) => (p.includes(row) ? p : [...p, row]));
        });
        t += 420;
      });
      // Leave to the right, hold, start over.
      tl.at(t + 200, () => {
        setHover(null);
        cursor.style.transform = `translate3d(${root.offsetWidth + 16}px, ${root.offsetHeight * 0.9}px, 0)`;
        cursor.style.opacity = "0";
      });
      tl.at(t + 2400, loop);
    };
    loop();
    return tl.clear;
  });

  const row = (
    i: number,
    avatar: React.ReactNode,
    title: React.ReactNode,
    sub: React.ReactNode,
    key: string,
  ) => {
    const open = hover === i;
    const on = picked.includes(i);
    return (
      <li
        key={i}
        ref={(el) => {
          rowRefs.current[i] = el;
        }}
        className={`flex items-center gap-2.5 rounded-[8px] px-2 py-1.5 transition-colors duration-300 ${
          open ? "bg-bg-subtle" : ""
        }`}
      >
        {avatar}
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 truncate text-[13px] font-medium text-fg">
            {title}
          </span>
          {/* The subtitle opens smoothly on hover (0fr → 1fr). */}
          <span
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo ${
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <span className="overflow-hidden">
              <span className="flex items-center gap-1.5 truncate pt-0.5 text-[11px] text-fg-muted">
                {sub}
              </span>
            </span>
          </span>
        </span>
        {on ? (
          <span className="flex size-5 animate-[clip-pop_320ms_var(--ease-spring)_both] items-center justify-center rounded-full bg-electric text-white">
            <Tick className="size-3" />
          </span>
        ) : (
          <Kbd>{key}</Kbd>
        )}
      </li>
    );
  };

  return (
    <div ref={rootRef} className="relative w-[min(18rem,100%)]" aria-hidden="true">
      <div className="overflow-hidden rounded-[12px] border border-border bg-bg shadow-[0_24px_48px_-28px_rgb(1_8_43/0.45)]">
        <p className="px-3.5 pt-3 pb-1 text-[11px] text-fg-muted">Add streamers</p>
        <ul className="px-1.5">
          {MENU.map((s, i) =>
            row(
              i,
              <Image
                src={s.avatar}
                alt=""
                width={28}
                height={28}
                className="size-7 shrink-0 rounded-[8px] object-cover"
              />,
              <>
                {s.name}
                <span
                  className="flex size-3.5 shrink-0 items-center justify-center rounded-[3px]"
                  style={{ backgroundColor: platforms[s.platform!].color }}
                >
                  <PlatformIcon
                    platform={s.platform!}
                    className={`size-2.5 ${s.platform === "kick" ? "text-black" : "text-white"}`}
                  />
                </span>
              </>,
              `${platforms[s.platform!].title} · ${s.rate}`,
              s.name[0].toUpperCase(),
            ),
          )}
        </ul>
        <p className="px-3.5 pt-2.5 pb-1 text-[11px] text-fg-muted">Style</p>
        <ul className="px-1.5 pb-1.5">
          {row(
            STYLE_ROW,
            <span className="flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-electric text-[12px] font-extrabold tracking-[-0.02em] text-white">
              Aa
            </span>,
            "My branding",
            <>
              <span className="flex gap-0.5">
                <span className="size-2.5 rounded-[2px] bg-electric" />
                <span className="size-2.5 rounded-[2px] border border-border bg-white" />
                <span className="size-2.5 rounded-[2px] bg-ink" />
              </span>
              Geist Bold captions
            </>,
            "M",
          )}
        </ul>
        <div className="flex items-center gap-4 border-t border-border px-3.5 py-2 text-[10.5px] text-fg-muted">
          <span className="flex items-center gap-1.5">
            <span className="font-mono">↑↓</span> Navigate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="font-mono">↵</span> Follow
          </span>
        </div>
      </div>
      <DemoCursor cursorRef={cursorRef} press={press} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* 02 · Clip it: clips are made one by one into a grid                  */
/* ─────────────────────────────────────────────────────────────────── */

const GRID = 15; // clips shown; a 16th "+" tile says there are more
const GRID_MS = 180;

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
      className="flex w-[min(17rem,100%)] flex-col items-center"
      aria-hidden="true"
    >
      {/* The stream being watched */}
      <div className="relative aspect-video w-[62%] overflow-hidden rounded-[10px] bg-midnight shadow-[0_18px_36px_-22px_rgb(1_8_43/0.55)]">
        <LazyVideo
          poster="/media/pipeline/stream.webp"
          sources={[
            { src: "/media/pipeline/stream.av1.mp4", type: 'video/mp4; codecs="av01.0.04M.08"' },
            { src: "/media/pipeline/stream.h264.mp4", type: "video/mp4" },
          ]}
          className="absolute inset-0 size-full object-cover"
        />
        <p className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-[3px] bg-midnight/70 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.08em] text-white uppercase backdrop-blur">
          <span className="size-1 animate-live rounded-full bg-live" />
          Live
        </p>
      </div>

      {/* Content flowing from the stream into the clipper */}
      <div className="relative flex h-10 w-4 flex-col items-center">
        <span className="feed-line w-[2px] flex-1 rounded-full" />
        <svg viewBox="0 0 10 6" className="-mt-px h-1.5 w-2.5 text-electric">
          <path d="M0 0h10L5 6Z" fill="currentColor" />
        </svg>
      </div>

      <div className="w-full rounded-[12px] border border-border bg-bg p-2.5 shadow-[0_24px_48px_-28px_rgb(1_8_43/0.45)]">
        <div className="mb-2 flex items-center justify-between px-0.5 text-[11px]">
          <span className="font-medium text-fg">Making clips</span>
          <span className="font-mono text-fg-muted tabular-nums">{made}</span>
        </div>
        <ul className="grid grid-cols-8 gap-1">
          {Array.from({ length: GRID }, (_, k) => (
            <li
              key={k}
              className="relative aspect-[9/16] overflow-hidden rounded-[3px] border border-dashed border-border"
            >
              {k < made && (
                <span className="absolute inset-0 animate-[clip-pop_300ms_var(--ease-out-expo)_both]">
                  <Image
                    src={`/media/pipeline/clip-${((k * 3) % 32) + 1}.webp`}
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </span>
              )}
            </li>
          ))}
          <li
            className={`flex aspect-[9/16] items-center justify-center rounded-[3px] bg-bg-subtle text-[13px] font-semibold text-fg-muted transition-opacity duration-300 ${
              made >= GRID ? "opacity-100" : "opacity-40"
            }`}
          >
            +
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* 03 · Post: zoom out, select every clip, download, green check        */
/* ─────────────────────────────────────────────────────────────────── */

const POST_CLIPS = [5, 12, 19, 23, 28, 9];
type PostPhase = "zoom" | "select" | "ask" | "yes" | "posted"; // "posted" = downloaded

export function PostVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const yesRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<PostPhase>("zoom");
  const [marquee, setMarquee] = useState(0); // 0 → 1, how far the selection box has been dragged
  const [press, setPress] = useState(0);

  useWhileVisible(rootRef, () => {
    if (reducedMotion()) {
      const t = window.setTimeout(() => {
        setMarquee(1);
        setPhase("posted");
      }, 0);
      return () => window.clearTimeout(t);
    }
    const root = rootRef.current!;
    const cursor = cursorRef.current!;
    const grid = gridRef.current!;
    const tl = makeTimeline();
    let raf = 0;

    const drag = (ms: number) => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / ms);
        const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        setMarquee(e);
        const r = root.getBoundingClientRect();
        const g = grid.getBoundingClientRect();
        const k = r.width / root.offsetWidth || 1;
        const x = (g.left - r.left - 6 + (g.width + 12) * e) / k;
        const y = (g.top - r.top - 6 + (g.height + 12) * e) / k;
        cursor.style.transition = "none";
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (t < 1) raf = requestAnimationFrame(step);
        else cursor.style.transition = "";
      };
      raf = requestAnimationFrame(step);
    };

    const loop = () => {
      setPhase("zoom");
      setMarquee(0);
      cursor.style.transition = "none";
      cursor.style.opacity = "0";
      cursor.style.transform = `translate3d(${root.offsetWidth * 0.2}px, ${root.offsetHeight + 10}px, 0)`;
      tl.at(900, () => {
        // The camera has pulled back; the cursor heads for the grid's top-left corner.
        setPhase("select");
        cursor.style.transition = "";
        cursor.style.opacity = "1";
        cursorTo(root, cursor, grid, 0, 0);
      });
      tl.at(1650, () => setPress((n) => n + 1));
      tl.at(1700, () => drag(900));
      tl.at(2750, () => setPhase("ask"));
      tl.at(3250, () => cursorTo(root, cursor, yesRef.current, 0.5, 0.55));
      tl.at(4000, () => {
        setPress((n) => n + 1);
        setPhase("yes");
      });
      tl.at(4250, () => setPhase("posted"));
      tl.at(4700, () => {
        cursor.style.transform = `translate3d(${root.offsetWidth + 16}px, ${root.offsetHeight * 0.85}px, 0)`;
        cursor.style.opacity = "0";
      });
      tl.at(6600, loop);
    };
    loop();
    return () => {
      tl.clear();
      cancelAnimationFrame(raf);
    };
  });

  const selectedCount = Math.round(marquee * POST_CLIPS.length);
  const asking = phase === "ask" || phase === "yes" || phase === "posted";

  return (
    <div
      ref={rootRef}
      className="relative w-[min(18.5rem,100%)] overflow-hidden"
      aria-hidden="true"
    >
      {/* The "camera": starts zoomed in on the first clip, then pulls back. */}
      <div className="relative p-3">
        <ul
          ref={gridRef}
          className="grid origin-top-left grid-cols-3 gap-2 transition-transform duration-[900ms] ease-out-expo"
          style={{ transform: phase === "zoom" ? "scale(1.45)" : "scale(1)" }}
        >
          {POST_CLIPS.map((c, i) => {
            const on = i < selectedCount;
            return (
              <li
                key={c}
                className={`relative aspect-[9/16] overflow-hidden rounded-[6px] transition-shadow duration-200 ${
                  on
                    ? "shadow-[0_0_0_2px_var(--bg),0_0_0_4px_var(--color-electric)]"
                    : "shadow-[0_12px_24px_-14px_rgb(1_8_43/0.5)]"
                }`}
              >
                <Image
                  src={`/media/pipeline/clip-${c}.webp`}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                <span
                  className={`absolute top-1 left-1 flex size-4 items-center justify-center rounded-[4px] border transition-colors duration-150 ${
                    on
                      ? "border-electric bg-electric text-white"
                      : "border-white/70 bg-black/20 text-transparent"
                  }`}
                >
                  <Tick className="size-2.5" />
                </span>
              </li>
            );
          })}
        </ul>

        {/* Selection box being dragged */}
        <span
          className="pointer-events-none absolute top-1.5 left-1.5 rounded-[6px] border border-electric bg-electric/10 transition-opacity duration-200"
          style={{
            width: `calc((100% - 0.75rem) * ${marquee})`,
            height: `calc((100% - 0.75rem) * ${marquee})`,
            opacity: phase === "select" && marquee > 0 && marquee < 1 ? 1 : 0,
          }}
        />

        {/* The prompt: ready to post? → green check */}
        <div
          className={`absolute inset-0 grid place-items-center bg-bg/40 backdrop-blur-[2px] transition-opacity duration-300 ${
            asking ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`w-[86%] rounded-[12px] border border-border bg-bg p-3.5 text-center shadow-[0_24px_48px_-20px_rgb(1_8_43/0.5)] transition-[transform,opacity] duration-500 ease-out-expo ${
              asking ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
            }`}
          >
            {phase === "posted" ? (
              <div className="flex flex-col items-center py-1">
                <span className="ok-check block size-11">
                  <svg viewBox="0 0 64 64" className="size-full overflow-visible">
                    <circle className="halo" cx="32" cy="32" r="30" />
                    <circle className="fill" cx="32" cy="32" r="30" />
                    <circle className="ring" cx="32" cy="32" r="30" pathLength={1} />
                    <path className="tick" d="M20 33.5 28 41.5 45 24" pathLength={1} />
                  </svg>
                </span>
                <p className="mt-2 text-[13px] font-semibold text-fg">Downloaded</p>
                <p className="text-[11px] text-fg-muted">6 clips · 1080×1920</p>
              </div>
            ) : (
              <>
                <p className="text-[13px] font-semibold text-fg">Ready to download 6 clips?</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <span className="flex h-8 items-center justify-center rounded-[8px] border border-border text-[12px] font-medium text-fg">
                    No
                  </span>
                  <span
                    ref={yesRef}
                    className={`flex h-8 items-center justify-center rounded-[8px] text-[12px] font-semibold text-white transition-colors duration-150 ${
                      phase === "yes" ? "bg-royal" : "bg-electric"
                    }`}
                  >
                    Download
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <DemoCursor cursorRef={cursorRef} press={press} />
    </div>
  );
}
