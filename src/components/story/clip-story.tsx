"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { CtaButton } from "@/components/cta-button";
import { storyClips } from "@/lib/story";

/*
 * Scroll timeline, as a fraction of the section's scroll distance.
 * The stream fills the screen → it is cut into vertical strips → the strips open into
 * clips that are already sinking into the dark → one statement → the grid moves down
 * and each clip ticks off as posted. Everything moves vertically.
 */
const T = {
  copyOut: [0, 0.08],
  expand: [0.01, 0.16],
  cut: [0.18, 0.28],
  morph: [0.25, 0.44],
  clipsIn: [0.38, 0.5],
  text: [0.5, 0.56, 0.66, 0.71],
  pan: [0.7, 0.98],
} as const;

const VEIL_BASE = 0.38; // how dark the clips are as soon as they exist
const VEIL_TEXT = 0.7; // how dark everything gets behind the statement

type Range = readonly [number, number];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, [a, b]: Range) => clamp((p - a) / (b - a));
const win = (p: number, [a, b, c, d]: readonly [number, number, number, number]) =>
  Math.min(seg(p, [a, b]), 1 - seg(p, [c, d]));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  if (rr === 0) return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
  return `M${x + rr} ${y}H${x + w - rr}A${rr} ${rr} 0 0 1 ${x + w} ${y + rr}V${y + h - rr}A${rr} ${rr} 0 0 1 ${x + w - rr} ${y + h}H${x + rr}A${rr} ${rr} 0 0 1 ${x} ${y + h - rr}V${y + rr}A${rr} ${rr} 0 0 1 ${x + rr} ${y}Z`;
};

const N = storyClips.length;

export function ClipStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const overlayPathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tileVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const checkRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const copy = copyRef.current;
    const media = mediaRef.current;
    const heroVideo = heroVideoRef.current;
    const overlay = overlayRef.current;
    const overlayPath = overlayPathRef.current;
    if (!section || !stage || !copy || !media || !heroVideo || !overlay || !overlayPath) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;

    let W = 0;
    let H = 0;
    let mobile = false;
    let copyBottom = 0;
    let lastP = -1;
    let raf = 0;
    let inView = false;
    let tilesLoaded = false;
    let tilesPlaying = false;
    let heroPlaying = false;

    const playSafe = (v: HTMLVideoElement) => {
      const res = v.play();
      if (res) res.catch(() => {});
    };
    const setHeroPlaying = (on: boolean) => {
      if (on === heroPlaying) return;
      heroPlaying = on;
      if (on) playSafe(heroVideo);
      else heroVideo.pause();
    };
    const setTilesPlaying = (on: boolean) => {
      if (on && !tilesLoaded) {
        // Posters and video are only fetched once the story gets close, keeping the first load light.
        tilesLoaded = true;
        tileVideoRefs.current.forEach((v) => {
          if (!v) return;
          if (v.dataset.poster) v.poster = v.dataset.poster;
          v.preload = "auto";
        });
      }
      if (on === tilesPlaying) return;
      tilesPlaying = on;
      tileVideoRefs.current.forEach((v) => {
        if (!v) return;
        if (on) playSafe(v);
        else v.pause();
      });
    };

    const measure = () => {
      W = stage.clientWidth;
      H = stage.clientHeight;
      mobile = W < 768;
      copyBottom = copy.offsetTop + copy.offsetHeight;
      overlay.setAttribute("viewBox", `0 0 ${W} ${H}`);
      lastP = -1;
    };

    const render = (p: number) => {
      /* ── 1 · Hero: copy leaves, the stream fills the screen ───────────── */
      const out = seg(p, T.copyOut);
      copy.style.opacity = String(1 - out);
      copy.style.transform = `translate3d(0, ${-28 * out}px, 0)`;
      copy.style.visibility = out >= 1 ? "hidden" : "visible";
      if (cueRef.current) cueRef.current.style.opacity = String(1 - seg(p, [0, 0.03]));

      const e = easeInOut(seg(p, T.expand));
      const start = mobile ? { t: Math.min(copyBottom + 28, H - 220), l: 0 } : { t: 0, l: W * 0.5 };
      media.style.inset = `${lerp(start.t, 0, e)}px 0px 0px ${lerp(start.l, 0, e)}px`;

      /* ── 2 · Cut into vertical strips, which open into a grid of 9:16 clips ── */
      const c = easeInOut(seg(p, T.cut));
      const m = easeInOut(seg(p, T.morph));
      const gStrip = lerp(0, mobile ? 6 : 12, c);
      const sw = (W - gStrip * (N - 1)) / N;

      const cols = mobile ? 2 : 4;
      const rows = Math.ceil(N / cols);
      const G = mobile ? 10 : 20;
      const M = mobile ? 16 : Math.max(32, W * 0.05);
      const topPad = mobile ? 84 : 104;
      const botPad = mobile ? 24 : 40;
      const cw = Math.min(
        (H * (mobile ? 0.5 : 0.66) * 9) / 16,
        (W - 2 * M - (cols - 1) * G) / cols,
      );
      const ch = (cw * 16) / 9;
      const gridW = cols * cw + (cols - 1) * G;
      const gridH = rows * ch + (rows - 1) * G;
      const left = (W - gridW) / 2;
      // The grid is taller than the screen, so it moves up as you scroll down. Never sideways.
      const travel = Math.max(0, gridH - (H - topPad - botPad));
      const pan = easeInOut(seg(p, T.pan));
      const baseTop = travel > 0 ? topPad : (H - gridH) / 2 + (topPad - botPad) / 2;
      const top0 = baseTop - travel * pan;
      const radius = lerp(0, mobile ? 10 : 12, m);
      const fadeIn = seg(p, T.clipsIn);

      let d = "";
      for (let i = 0; i < N; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = lerp(i * (sw + gStrip), left + col * (cw + G), m);
        const y = lerp(0, top0 + row * (ch + G), m);
        const w = lerp(sw, cw, m);
        const h = lerp(H, ch, m);
        if (c > 0) d += roundedRect(x, y, w, h, radius);

        const tile = tileRefs.current[i];
        if (!tile) continue;
        const o = easeOut(seg(fadeIn, [i * 0.06, i * 0.06 + 0.5]));
        tile.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        tile.style.width = `${w}px`;
        tile.style.height = `${h}px`;
        tile.style.borderRadius = `${radius}px`;
        tile.style.opacity = String(o);
        tile.style.visibility = o > 0 ? "visible" : "hidden";

        /* ── 3 · As the grid moves, each clip ticks off: Apple Pay-style ── */
        const startAt = (row / rows) * 0.62 + (col / cols) * 0.16;
        const done = pan > startAt + 0.04 || p >= T.pan[1];
        const check = checkRefs.current[i];
        if (check && check.dataset.done !== String(done)) check.dataset.done = String(done);
      }
      // Outside the clips, the original stream stays visible under a dark veil.
      overlayPath.setAttribute("d", c > 0 ? `M0 0H${W}V${H}H0Z${d}` : "");
      overlayPath.setAttribute("fill-opacity", String(0.78 * c));

      // The clips never appear at full brightness: the veil builds with the cut,
      // deepens behind the statement, and eases back a little while the grid moves.
      const t = win(p, T.text);
      const base = VEIL_BASE * easeInOut(seg(p, [T.cut[0], T.morph[1]]));
      if (veilRef.current) veilRef.current.style.opacity = String(lerp(base, VEIL_TEXT, t));

      /* ── The statement ───────────────────────────────────────────────── */
      const text = textRef.current;
      if (text) {
        text.style.opacity = String(t);
        text.style.transform = `translate3d(0, ${(1 - t) * 24}px, 0) scale(${lerp(0.97, 1, t)})`;
        text.style.visibility = t > 0 ? "visible" : "hidden";
      }

      if (!reduced) {
        setHeroPlaying(inView);
        setTilesPlaying(inView && p > T.cut[0] - 0.03);
      }
    };

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - H;
      const p = reduced || distance <= 0 ? 0 : clamp(-rect.top / distance);
      if (p !== lastP) {
        render(p);
        lastP = p;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) {
          setHeroPlaying(false);
          setTilesPlaying(false);
        } else {
          lastP = -1;
          schedule();
        }
      },
      { rootMargin: "50px 0px" },
    );
    io.observe(section);

    const ro = new ResizeObserver(() => {
      measure();
      schedule();
    });
    ro.observe(stage);
    ro.observe(copy);

    const onReducedChange = () => {
      reduced = reducedQuery.matches;
      if (reduced) {
        setHeroPlaying(false);
        setTilesPlaying(false);
      }
      lastP = -1;
      schedule();
    };
    reducedQuery.addEventListener("change", onReducedChange);

    const showVideo = () => heroVideo.setAttribute("data-ready", "true");
    heroVideo.addEventListener("playing", showVideo);

    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      reducedQuery.removeEventListener("change", onReducedChange);
      heroVideo.removeEventListener("playing", showVideo);
      io.disconnect();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        aria-labelledby="hero-title"
        className="relative h-[560svh] motion-reduce:h-svh"
      >
        <span id="how" aria-hidden="true" className="absolute top-[100svh]" />
        <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden bg-bg">
          {/* Hero copy */}
          <div
            ref={copyRef}
            className="relative z-10 flex flex-col px-5 pt-24 sm:px-10 md:absolute md:inset-y-0 md:left-0 md:w-1/2 md:justify-center md:px-[clamp(2.5rem,5.5vw,5.5rem)] md:pt-0"
          >
            <p className="eyebrow text-fg-muted">Automated clipping for livestreams</p>
            <h1
              id="hero-title"
              className="mt-5 max-w-[15ch] text-[clamp(2.5rem,4.6vw,4.75rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance text-fg"
            >
              Every stream, clipped <span className="text-fg-muted">the second it happens.</span>
            </h1>
            <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-pretty text-fg-muted sm:text-[1.0625rem]">
              Pick your streamers. Clippable watches every live stream at once, cuts the best
              moments as they happen and hands you vertical clips, ready to post.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <CtaButton href="#early-access">Get early access</CtaButton>
              <a href="#how" className="btn btn-secondary">
                See how it works
              </a>
            </div>
          </div>

          <div
            ref={cueRef}
            aria-hidden="true"
            className="absolute bottom-8 left-[clamp(2.5rem,5.5vw,5.5rem)] z-10 hidden items-center gap-3 text-fg-muted motion-reduce:hidden md:flex"
          >
            <span className="relative block h-8 w-px overflow-hidden bg-border">
              <span className="absolute inset-x-0 top-0 h-3 animate-[scroll-cue_1.8s_var(--ease-out-expo)_infinite] bg-fg" />
            </span>
            <span className="eyebrow">Scroll to see it work</span>
          </div>

          {/* Media: the hero stream, which expands, is cut, and becomes the clips */}
          <div
            ref={mediaRef}
            className="absolute top-[60svh] right-0 bottom-0 left-0 z-20 overflow-hidden bg-midnight md:top-0 md:left-1/2"
          >
            <Image
              src="/media/hero-poster.webp"
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[64%_50%] md:object-center"
            />
            <video
              ref={heroVideoRef}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 size-full object-cover object-[64%_50%] opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100 md:object-center"
            >
              <source src="/media/hero.av1.mp4" type='video/mp4; codecs="av01.0.08M.08"' />
              <source src="/media/hero.h264.mp4" type="video/mp4" />
            </video>

            {/* The cuts: a dark veil everywhere except the clip windows */}
            <svg
              ref={overlayRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full"
              preserveAspectRatio="none"
            >
              <path
                ref={overlayPathRef}
                fill="var(--color-midnight)"
                fillOpacity="0"
                fillRule="evenodd"
              />
            </svg>

            {storyClips.map((clip, i) => (
              <div
                key={clip.id}
                ref={(el) => {
                  tileRefs.current[i] = el;
                }}
                aria-hidden="true"
                className="invisible absolute top-0 left-0 overflow-hidden bg-midnight opacity-0 will-change-transform"
              >
                <video
                  ref={(el) => {
                    tileVideoRefs.current[i] = el;
                  }}
                  muted
                  loop
                  playsInline
                  preload="none"
                  data-poster={`/media/clips/clip-${clip.id}.webp`}
                  className="size-full object-cover"
                >
                  <source
                    src={`/media/clips/clip-${clip.id}.av1.mp4`}
                    type='video/mp4; codecs="av01.0.05M.08"'
                  />
                  <source src={`/media/clips/clip-${clip.id}.h264.mp4`} type="video/mp4" />
                </video>

                {/* Apple Pay-style completion */}
                <div
                  ref={(el) => {
                    checkRefs.current[i] = el;
                  }}
                  data-done="false"
                  className="pay-check absolute top-1/2 left-1/2 z-10 -mt-7 -ml-7 size-14 md:-mt-8 md:-ml-8 md:size-16"
                >
                  <svg viewBox="0 0 64 64" className="size-full overflow-visible">
                    <circle className="halo" cx="32" cy="32" r="30" />
                    <circle className="fill" cx="32" cy="32" r="30" />
                    <circle className="ring" cx="32" cy="32" r="30" pathLength={1} />
                    <path className="tick" d="M20 33.5 28 41.5 45 24" pathLength={1} />
                  </svg>
                </div>
              </div>
            ))}

            <div
              ref={veilRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-midnight opacity-0"
            />
          </div>

          {/* The statement */}
          <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center px-6 text-center">
            <h2
              ref={textRef}
              className="invisible max-w-[13ch] text-[clamp(2.75rem,7.6vw,7rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance text-white opacity-0"
            >
              Clipped without lifting a finger.
            </h2>
          </div>
        </div>
      </section>

      <StaticStory />
    </>
  );
}

/** Reduced-motion version: the statement and the clips, laid out as a normal section. */
function StaticStory() {
  return (
    <section
      aria-label="How Clippable works"
      className="hidden bg-midnight px-5 py-20 text-white motion-reduce:block sm:px-10"
    >
      <h2 className="mx-auto max-w-[14ch] text-center text-4xl font-medium tracking-[-0.04em] text-balance sm:text-6xl">
        Clipped without lifting a finger.
      </h2>
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4">
        {storyClips.map((clip) => (
          <div
            key={clip.id}
            className="relative aspect-[9/16] overflow-hidden rounded-xl bg-midnight"
          >
            <Image
              src={`/media/clips/clip-${clip.id}.webp`}
              alt=""
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
