"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { storyClips } from "@/lib/story";

/*
 * Hero + scroll story.
 *
 * Load:   the period lands, letters reveal, the CTA rises, then a gap opens in the
 *         headline and a 4:3 player springs in between the words.
 * Scroll: the player leaves the headline and grows to a large frame centred on white →
 *         white cuts slice it into vertical strips → the strips open into 9:16 clips while
 *         the page sinks to dark → one statement → the grid moves down, each clip ticks off.
 * Everything moves vertically.
 */
const T = {
  copyOut: [0, 0.1],
  grow: [0, 0.2],
  cut: [0.23, 0.31],
  morph: [0.29, 0.47],
  clipsIn: [0.36, 0.48],
  text: [0.5, 0.55, 0.64, 0.69],
  pan: [0.68, 0.98],
} as const;

const INTRO_MS = 2700; // how long the load animation keeps the player glued to its slot
const VEIL_BASE = 0.38; // clips are darkened as soon as they exist
const VEIL_TEXT = 0.7; // and darker still behind the statement

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
const WHITE = [255, 255, 255];
const MIDNIGHT = [1, 8, 43];
const mix = (t: number) =>
  `rgb(${WHITE.map((w, i) => Math.round(lerp(w, MIDNIGHT[i], t))).join(" ")})`;

/** Letter-by-letter reveal. Visual only: the h1 carries the real text in aria-label. */
function Letters({ text, delay }: { text: string; delay: number }) {
  return (
    <span aria-hidden="true" className="inline-block whitespace-nowrap">
      {[...text].map((ch, i) => (
        <span
          key={i}
          className="hero-letter inline-block"
          style={{ animationDelay: `${delay + i * 45}ms` }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export function ClipStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
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
    const slot = slotRef.current;
    const box = boxRef.current;
    const heroVideo = heroVideoRef.current;
    const overlay = overlayRef.current;
    const overlayPath = overlayPathRef.current;
    if (!section || !stage || !copy || !slot || !box || !heroVideo || !overlay || !overlayPath)
      return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;

    let W = 0;
    let H = 0;
    let mobile = false;
    let slotRect = { x: 0, y: 0, w: 0, h: 0, r: 0 };
    let lastP = -1;
    let raf = 0;
    let introRaf = 0;
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

    const measureSlot = () => {
      const s = stage.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      slotRect = {
        x: r.left - s.left,
        y: r.top - s.top,
        w: r.width,
        h: r.height,
        r: parseFloat(getComputedStyle(slot).borderTopLeftRadius) || 12,
      };
    };
    const measure = () => {
      W = stage.clientWidth;
      H = stage.clientHeight;
      mobile = W < 768;
      overlay.setAttribute("viewBox", `0 0 ${W} ${H}`);
      measureSlot();
      lastP = -1;
    };

    const render = (p: number) => {
      /* ── 1 · The player leaves the headline and grows, centred on white ── */
      const out = seg(p, T.copyOut);
      copy.style.opacity = String(1 - out);
      copy.style.transform = `translate3d(0, ${-24 * out}px, 0) scale(${lerp(1, 0.97, out)})`;
      copy.style.visibility = out >= 1 ? "hidden" : "visible";
      if (cueRef.current) cueRef.current.style.opacity = String(1 - seg(p, [0, 0.03]));

      const g = easeInOut(seg(p, T.grow));
      const ch0 = Math.min(H * (mobile ? 0.42 : 0.64), (W - (mobile ? 32 : 96)) * 0.75);
      const cw0 = (ch0 * 4) / 3;
      const center = { x: (W - cw0) / 2, y: (H - ch0) / 2 + (mobile ? 12 : 24), w: cw0, h: ch0 };
      const bx = lerp(slotRect.x, center.x, g);
      const by = lerp(slotRect.y, center.y, g);
      const bw = lerp(slotRect.w, center.w, g);
      const bh = lerp(slotRect.h, center.h, g);
      const br = lerp(slotRect.r, mobile ? 14 : 18, g);
      box.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
      box.style.width = `${bw}px`;
      box.style.height = `${bh}px`;
      box.style.borderRadius = `${br}px`;
      box.style.opacity = slotRect.w > 1 ? "1" : "0";
      // The slot's dark fill is only a stand-in until the player is drawn over it.
      slot.style.backgroundColor = "transparent";

      /* ── 2 · Cut into vertical strips, which open into a grid of 9:16 clips ── */
      const c = easeInOut(seg(p, T.cut));
      const m = easeInOut(seg(p, T.morph));
      const gStrip = lerp(0, mobile ? 5 : 10, c);
      const sw = (center.w - gStrip * (N - 1)) / N;

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
      const chh = (cw * 16) / 9;
      const gridW = cols * cw + (cols - 1) * G;
      const gridH = rows * chh + (rows - 1) * G;
      const left = (W - gridW) / 2;
      const travel = Math.max(0, gridH - (H - topPad - botPad));
      const pan = easeInOut(seg(p, T.pan));
      const baseTop = travel > 0 ? topPad : (H - gridH) / 2 + (topPad - botPad) / 2;
      const top0 = baseTop - travel * pan;
      const radius = lerp(mobile ? 4 : 6, mobile ? 10 : 12, m);
      const fadeIn = seg(p, T.clipsIn);

      let d = "";
      for (let i = 0; i < N; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = lerp(center.x + i * (sw + gStrip), left + col * (cw + G), m);
        const y = lerp(center.y, top0 + row * (chh + G), m);
        const w = lerp(sw, cw, m);
        const h = lerp(center.h, chh, m);
        if (c > 0) d += roundedRect(x, y, w, h, radius);

        const tile = tileRefs.current[i];
        if (!tile) continue;
        const o = easeOut(seg(fadeIn, [i * 0.06, i * 0.06 + 0.5]));
        tile.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        tile.style.width = `${w}px`;
        tile.style.height = `${h}px`;
        tile.style.borderRadius = `${radius}px`;
        // The tile's dark frame shows as soon as the cut starts; its clip fades in on top.
        tile.style.opacity = c > 0 ? "1" : "0";
        tile.style.visibility = c > 0 ? "visible" : "hidden";
        const tv = tileVideoRefs.current[i];
        if (tv) tv.style.opacity = String(o);

        /* ── 3 · As the grid moves, each clip ticks off: Apple Pay-style ── */
        const startAt = (row / rows) * 0.62 + (col / cols) * 0.16;
        const done = pan > startAt + 0.04 || p >= T.pan[1];
        const check = checkRefs.current[i];
        if (check && check.dataset.done !== String(done)) check.dataset.done = String(done);
      }
      // White cuts on white, deepening to dark as the strips open into clips.
      overlayPath.setAttribute("d", c > 0 ? `M0 0H${W}V${H}H0Z${d}` : "");
      overlayPath.setAttribute("fill", mix(m));
      stage.style.backgroundColor = mix(m);

      // Clips never show at full brightness: the veil builds with the morph.
      const t = win(p, T.text);
      const base = VEIL_BASE * m;
      if (veilRef.current) veilRef.current.style.opacity = String(lerp(base, VEIL_TEXT, t));

      const text = textRef.current;
      if (text) {
        text.style.opacity = String(t);
        text.style.transform = `translate3d(0, ${(1 - t) * 24}px, 0) scale(${lerp(0.97, 1, t)})`;
        text.style.visibility = t > 0 ? "visible" : "hidden";
      }

      if (!reduced) {
        setHeroPlaying(inView && fadeIn < 1);
        setTilesPlaying(inView && p > T.cut[0] - 0.03);
      }
    };

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - H;
      return reduced || distance <= 0 ? 0 : clamp(-rect.top / distance);
    };
    const update = () => {
      raf = 0;
      const p = progress();
      if (p !== lastP) {
        render(p);
        lastP = p;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // During the load animation the slot opens up, so the player follows it frame by frame.
    const introStart = performance.now();
    const intro = () => {
      measureSlot();
      render(progress());
      if (performance.now() - introStart < INTRO_MS) introRaf = requestAnimationFrame(intro);
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
    ro.observe(slot);

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
    introRaf = requestAnimationFrame(intro);
    window.addEventListener("scroll", schedule, { passive: true });
    document.fonts?.ready.then(() => {
      measure();
      schedule();
    });

    return () => {
      window.removeEventListener("scroll", schedule);
      reducedQuery.removeEventListener("change", onReducedChange);
      heroVideo.removeEventListener("playing", showVideo);
      io.disconnect();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (introRaf) cancelAnimationFrame(introRaf);
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        aria-labelledby="hero-title"
        className="relative h-[600svh] motion-reduce:h-svh"
      >
        <span id="how" aria-hidden="true" className="absolute top-[110svh]" />
        <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden bg-bg">
          {/* Media layer: the player, the cuts and the clips */}
          <div className="absolute inset-0 z-20 overflow-hidden">
            <div
              ref={boxRef}
              className="absolute top-0 left-0 overflow-hidden bg-midnight opacity-0 will-change-transform"
            >
              <Image
                src="/media/hero-poster.webp"
                alt=""
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 768px) 70vw, 100vw"
                className="object-cover"
              />
              <video
                ref={heroVideoRef}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
                className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100"
              >
                <source src="/media/hero.av1.mp4" type='video/mp4; codecs="av01.0.08M.08"' />
                <source src="/media/hero.h264.mp4" type="video/mp4" />
              </video>
            </div>

            <svg
              ref={overlayRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full"
              preserveAspectRatio="none"
            >
              <path ref={overlayPathRef} fill="#ffffff" fillRule="evenodd" />
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

          {/* Hero copy, centred. The player sits in the headline's slot. */}
          <div
            ref={copyRef}
            className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-4 pt-14 text-center"
          >
            <p className="hero-rise text-[clamp(1.05rem,1.6vw,1.5rem)] leading-tight font-medium tracking-[-0.02em] text-fg [animation-delay:120ms]">
              Watch less.
              <br />
              Clip every live stream.
            </p>
            <h1
              id="hero-title"
              aria-label="Clip everything."
              className="mt-6 flex flex-wrap items-center justify-center text-[clamp(3.25rem,8.4vw,9.5rem)] leading-[0.9] font-semibold tracking-[-0.055em] text-fg"
            >
              <Letters text="Clip" delay={260} />
              <span
                ref={slotRef}
                aria-hidden="true"
                className="hero-slot inline-block h-[0.8em] overflow-hidden rounded-[0.12em] bg-midnight"
              />
              <span className="inline-flex items-baseline">
                <Letters text="everything" delay={440} />
                <span aria-hidden="true" className="hero-dot inline-block">
                  .
                </span>
              </span>
            </h1>
            <a
              href="#early-access"
              className="hero-rise pointer-events-auto mt-10 inline-flex h-14 items-center gap-3 rounded-[10px] bg-electric px-7 text-lg font-medium text-white shadow-[0_16px_40px_-16px_rgb(0_97_255/0.7)] ring-1 ring-ink/15 transition-transform duration-300 ease-out-expo [animation-delay:1100ms] hover:-translate-y-0.5"
            >
              Get early access
              <svg
                viewBox="0 0 20 20"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  d="M4 10h11M11 5.5 15.5 10 11 14.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <div
            ref={cueRef}
            aria-hidden="true"
            className="hero-rise absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 text-fg-muted [animation-delay:1600ms] motion-reduce:hidden"
          >
            <span className="relative block h-8 w-px overflow-hidden bg-border">
              <span className="absolute inset-x-0 top-0 h-3 animate-[scroll-cue_1.8s_var(--ease-out-expo)_infinite] bg-fg" />
            </span>
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
