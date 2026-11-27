"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LazyVideo } from "@/components/lazy-video";

const SLOTS = 12; // 4 × 3 on desktop; the last row is hidden on phones
const START_FILLED = 3; // the page is complete at rest, never an empty shell
const STEP_MS = 2300;
const FLY_MS = 950;
const HOLD_FULL_MS = 2600;

const streams = [1, 2, 3] as const;

/** Three live streams; under each, a grid its clips fly down into as they are cut. */
export function LiveClipping() {
  return (
    <div className="mx-auto grid max-w-[1400px] gap-x-6 gap-y-16 px-5 sm:px-8 lg:grid-cols-3">
      {streams.map((n, i) => (
        <StreamColumn key={n} stream={n} delay={i * 760} />
      ))}
    </div>
  );
}

function StreamColumn({ stream, delay }: { stream: number; delay: number }) {
  const [filled, setFilled] = useState(START_FILLED);
  const rootRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const cutRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLLIElement | null)[]>([]);
  const filledRef = useRef(START_FILLED);

  useEffect(() => {
    const root = rootRef.current;
    const streamEl = streamRef.current;
    const cut = cutRef.current;
    if (!root || !streamEl || !cut) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = window.setTimeout(() => setFilled(SLOTS), 0);
      return () => window.clearTimeout(t);
    }

    let running = false;
    let timer: number | undefined;
    const flyers = new Set<HTMLElement>();

    const visibleSlots = () => slotRefs.current.filter((s) => s && s.offsetParent !== null).length;

    const setCount = (n: number) => {
      filledRef.current = n;
      setFilled(n);
    };

    const step = () => {
      if (!running) return;
      const total = visibleSlots();
      const next = filledRef.current;
      if (next >= total) {
        timer = window.setTimeout(() => {
          setCount(0);
          timer = window.setTimeout(step, 900);
        }, HOLD_FULL_MS);
        return;
      }
      const slot = slotRefs.current[next];
      if (!slot) return;

      // 1 · Mark the moment on the stream with a 9:16 cut frame.
      const s = streamEl.getBoundingClientRect();
      const r = root.getBoundingClientRect();
      const cutH = s.height;
      const cutW = (cutH * 9) / 16;
      const cx = 0.22 + ((next * 37 + stream * 11) % 56) / 100; // varied, deterministic
      const cutX = Math.min(Math.max(s.width * cx - cutW / 2, 0), s.width - cutW);
      cut.style.width = `${cutW}px`;
      cut.style.transform = `translate3d(${cutX}px, 0, 0)`;
      cut.dataset.on = "true";

      timer = window.setTimeout(() => {
        cut.dataset.on = "false";
        // 2 · Fly the clip down into the next empty slot (FLIP, transform only).
        const target = slot.getBoundingClientRect();
        const flyer = document.createElement("div");
        flyer.className = "live-flyer";
        flyer.style.left = `${target.left - r.left}px`;
        flyer.style.top = `${target.top - r.top}px`;
        flyer.style.width = `${target.width}px`;
        flyer.style.height = `${target.height}px`;
        flyer.style.backgroundImage = `url(${thumb(stream, next)})`;
        root.appendChild(flyer);
        flyers.add(flyer);

        const scale = cutW / target.width;
        const dx = s.left + cutX - target.left;
        const dy = s.top - target.top;
        const anim = flyer.animate(
          [
            { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.2 },
            {
              transform: `translate(${dx * 0.45}px, ${dy * 0.55 - 24}px) scale(${1 + (scale - 1) * 0.4}) rotate(-3deg)`,
              opacity: 1,
              offset: 0.45,
            },
            { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
          ],
          { duration: FLY_MS, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" },
        );
        anim.onfinish = () => {
          setCount(next + 1);
          // Let the slot paint before the flyer leaves, so there is no flash.
          requestAnimationFrame(() => {
            flyer.remove();
            flyers.delete(flyer);
          });
          timer = window.setTimeout(step, STEP_MS - FLY_MS);
        };
      }, 520);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          timer = window.setTimeout(step, delay + 400);
        } else if (!e.isIntersecting && running) {
          running = false;
          window.clearTimeout(timer);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(root);
    return () => {
      running = false;
      io.disconnect();
      window.clearTimeout(timer);
      flyers.forEach((f) => f.remove());
    };
  }, [stream, delay]);

  return (
    <div ref={rootRef} className="relative">
      <div
        ref={streamRef}
        className="relative aspect-video overflow-hidden rounded-[var(--radius-card)] bg-midnight"
      >
        <LazyVideo
          poster={`/media/streams/stream-${stream}.webp`}
          sources={[
            {
              src: `/media/streams/stream-${stream}.av1.mp4`,
              type: 'video/mp4; codecs="av01.0.04M.08"',
            },
            { src: `/media/streams/stream-${stream}.h264.mp4`, type: "video/mp4" },
          ]}
          className="absolute inset-0 size-full object-cover"
        />
        <div
          ref={cutRef}
          data-on="false"
          aria-hidden="true"
          className="absolute inset-y-0 left-0 rounded-[6px] opacity-0 shadow-[0_0_0_2px_white,0_0_0_9999px_rgb(1_8_43/0.45)] transition-opacity duration-300 data-[on=true]:opacity-100"
        />
        <p className="absolute top-3 left-3 flex items-center gap-1.5 rounded-[4px] bg-midnight/70 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-white uppercase backdrop-blur">
          <span className="size-1.5 animate-live rounded-full bg-live" aria-hidden="true" />
          Live
        </p>
      </div>

      <ul
        className="mt-4 grid grid-cols-4 gap-2"
        aria-label={`Clips cut from stream ${stream}: ${Math.min(filled, SLOTS)} so far`}
      >
        {Array.from({ length: SLOTS }, (_, k) => {
          const on = k < filled;
          return (
            <li
              key={k}
              ref={(el) => {
                slotRefs.current[k] = el;
              }}
              className={`relative aspect-[9/16] overflow-hidden rounded-[6px] ${k >= 8 ? "max-sm:hidden" : ""} ${
                on ? "bg-midnight" : "border border-dashed border-border bg-bg-subtle"
              }`}
            >
              {on && (
                <>
                  <Image
                    src={thumb(stream, k)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 8vw, 22vw"
                    className="object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-1.5 bottom-1.5 flex size-4 animate-[slot-check_420ms_var(--ease-spring)_both] items-center justify-center rounded-full bg-electric text-white"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="size-2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                    >
                      <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const thumb = (stream: number, k: number) => `/media/streams/s${stream}-clip-${k + 1}.webp`;
