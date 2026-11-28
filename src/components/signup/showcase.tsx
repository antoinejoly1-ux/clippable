"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/logo";

/*
 * The sign-up page's left panel: three feature slides, each a real stream playing behind its
 * line, with story-style bars along the top that fill while a slide plays.
 */
const SLIDES = [
  {
    id: "kai",
    title: "Clip it while it's live.",
    body: "Clippable cuts vertical clips the second a moment happens on stream.",
    poster: "/media/cta-kai-poster.webp",
    av1: "/media/cta-kai.av1.mp4",
    h264: "/media/cta-kai.h264.mp4",
  },
  {
    id: "pbm",
    title: "Repeatable workflows.",
    body: "Set it up once. Every stream after that clips itself.",
    poster: "/media/signup/pbm.webp",
    av1: "/media/signup/pbm.av1.mp4",
    h264: "/media/signup/pbm.h264.mp4",
  },
  {
    id: "lacy",
    title: "Your branding, on every clip.",
    body: "Your captions, colours and fonts, applied to each clip automatically.",
    poster: "/media/signup/lacy.webp",
    av1: "/media/signup/lacy.av1.mp4",
    h264: "/media/signup/lacy.h264.mp4",
  },
] as const;

const SLIDE_MS = 6000;

export function Showcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const elapsed = useRef(0);

  // Play only the active slide's video, from its start.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) {
        v.preload = "auto";
        v.currentTime = 0;
        if (!paused) v.play().catch(() => {});
      } else v.pause();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pause is handled below
  }, [active]);

  useEffect(() => {
    const v = videos.current[active];
    if (!v) return;
    if (paused) v.pause();
    else v.play().catch(() => {});
  }, [paused, active]);

  // Fill the active bar; when it's full, move on. Bars are written directly (no re-renders).
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (!paused && !still) elapsed.current += now - last;
      last = now;
      const p = Math.min(1, elapsed.current / SLIDE_MS);
      fills.current.forEach((f, i) => {
        if (f) f.style.transform = `scaleX(${i < active ? 1 : i === active ? (still ? 1 : p) : 0})`;
      });
      if (p >= 1 && !still) {
        elapsed.current = 0;
        setActive((a) => (a + 1) % SLIDES.length);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, paused]);

  const go = (i: number) => {
    elapsed.current = 0;
    setActive(i);
  };

  return (
    <section
      aria-label="What Clippable does"
      className="relative isolate h-[46svh] min-h-[340px] overflow-hidden bg-midnight text-white lg:h-auto lg:rounded-[24px]"
    >
      {SLIDES.map((s, i) => (
        <video
          key={s.id}
          ref={(el) => {
            videos.current[i] = el;
          }}
          muted
          loop
          playsInline
          preload={i === 0 ? "auto" : "none"}
          poster={s.poster}
          aria-hidden="true"
          // Scaled from the top so the streams' own burned-in subtitles fall outside the panel.
          className={`absolute inset-0 -z-10 size-full origin-top scale-[1.14] object-cover transition-opacity duration-700 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={s.av1} type='video/mp4; codecs="av01.0.05M.10"' />
          <source src={s.h264} type="video/mp4" />
        </video>
      ))}
      {/* Legibility: darker at the top (bars, logo) and bottom (copy). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(1_8_43/0.55),transparent_28%,transparent_42%,rgb(1_8_43/0.7)_70%,rgb(1_8_43/0.92))]"
      />

      <div className="flex h-full flex-col p-6 sm:p-8 lg:p-10">
        {/* Progress tabs: one bar per slide, the active one fills. */}
        <div role="tablist" aria-label="Features" className="flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={s.title}
              onClick={() => go(i)}
              className="group relative h-6 flex-1"
            >
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/30 transition-colors group-hover:bg-white/45">
                <span
                  ref={(el) => {
                    fills.current[i] = el;
                  }}
                  className="block size-full origin-left rounded-full bg-white"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xl font-semibold tracking-[-0.02em] max-lg:invisible">
            <LogoMark className="h-[0.78em] w-auto text-sky" />
            Clippable
          </span>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play" : "Pause"}
            className="flex size-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-[background-color,scale] hover:bg-white/25 active:scale-95"
          >
            {paused ? (
              <svg
                viewBox="0 0 12 12"
                className="ml-0.5 size-3"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2.5 1.5v9l8-4.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" className="size-3" fill="currentColor" aria-hidden="true">
                <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />
              </svg>
            )}
          </button>
        </div>

        <div className="mt-auto" aria-live="polite">
          <h2
            key={SLIDES[active].id}
            className="max-w-[14ch] animate-[signup-rise_700ms_var(--ease-out-expo)_both] text-[clamp(2rem,4vw,3.75rem)] leading-[1] font-medium tracking-[-0.045em] text-balance"
          >
            {SLIDES[active].title}
          </h2>
          <p
            key={`${SLIDES[active].id}-b`}
            className="mt-3 max-w-[40ch] animate-[signup-rise_700ms_var(--ease-out-expo)_80ms_both] text-base text-pretty text-white/80 max-lg:hidden sm:text-lg"
          >
            {SLIDES[active].body}
          </p>
        </div>
      </div>
    </section>
  );
}
