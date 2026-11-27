"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { CtaButton } from "@/components/cta-button";
import { PlatformIcon, platforms } from "@/components/platform-icons";
import { formatViews, storyClips } from "@/lib/story";

/*
 * Scroll timeline, as a fraction of the section's scroll distance.
 * Rhythm: motion → centered text → motion → centered text → motion → centered counter.
 */
const T = {
  copyOut: [0, 0.07],
  expand: [0.01, 0.12],
  textA: [0.11, 0.15, 0.19, 0.22],
  cut: [0.22, 0.29],
  morph: [0.27, 0.41],
  clipsIn: [0.37, 0.46],
  textB: [0.47, 0.51, 0.57, 0.6],
  pan: [0.6, 0.86],
  textC: [0.86, 0.9],
  count: [0.87, 0.97],
} as const;

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
const TOTAL_VIEWS = storyClips.reduce((sum, c) => sum + c.views, 0);

export function ClipStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const overlayPathRef = useRef<SVGPathElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tileVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const checkRefs = useRef<(HTMLDivElement | null)[]>([]);
  const viewRefs = useRef<(HTMLSpanElement | null)[]>([]);

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
    const lastLabels: string[] = [];
    let lastCount = "";

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

      /* Text A, over the darkened live stream */
      const a = win(p, T.textA);
      if (scrimRef.current) scrimRef.current.style.opacity = String(a * 0.55);
      if (liveRef.current) liveRef.current.style.opacity = String(1 - seg(p, T.cut));

      /* ── 2 · Cut into vertical strips, which open into 9:16 clips ─────── */
      const c = easeInOut(seg(p, T.cut));
      const m = easeInOut(seg(p, T.morph));
      const gStrip = lerp(0, mobile ? 4 : 8, c);
      const sw = (W - gStrip * (N - 1)) / N;

      const ch = Math.min(H * (mobile ? 0.64 : 0.7), (W - 48) * (16 / 9));
      const cw = ch * (9 / 16);
      const G = mobile ? 12 : 20;
      const M = mobile ? 20 : Math.max(32, W * 0.04);
      const rowW = N * cw + (N - 1) * G;
      const panTravel = Math.max(0, rowW - (W - 2 * M));
      const pan = easeInOut(seg(p, T.pan));
      const panX = -panTravel * pan;
      const cardTop = (H - ch) / 2 + (mobile ? 16 : 24);
      const radius = lerp(0, mobile ? 10 : 12, m);

      const fadeIn = seg(p, T.clipsIn);
      const dim = Math.max(win(p, T.textB), seg(p, T.textC));
      const tileOpacityBase = 1 - 0.84 * dim;

      let d = "";
      for (let i = 0; i < N; i++) {
        const x0 = i * (sw + gStrip);
        const x1 = M + i * (cw + G) + panX;
        const x = lerp(x0, x1, m);
        const y = lerp(0, cardTop, m);
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
        tile.style.opacity = String(o * tileOpacityBase);
        tile.style.visibility = o > 0 ? "visible" : "hidden";

        /* ── 3 · Each clip posts itself: Apple Pay-style ring and tick ──── */
        const startAt = (i / N) * 0.82;
        const done = pan > startAt + 0.02 || p >= T.pan[1];
        const check = checkRefs.current[i];
        if (check) {
          if (check.dataset.done !== String(done)) check.dataset.done = String(done);
          const settle = p >= T.pan[1] ? 1 : easeInOut(seg(pan, [startAt + 0.1, startAt + 0.18]));
          const size = mobile ? 56 : 64;
          const tx = lerp(0, cw / 2 - size * 0.32 - 14, settle);
          const ty = lerp(0, -(ch / 2 - size * 0.32 - 14), settle);
          check.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${lerp(1, 0.5, settle)})`;
        }
        const grow = p >= T.pan[1] ? 1 : easeOut(seg(pan, [startAt + 0.04, startAt + 0.3]));
        const label = done ? `${formatViews(storyClips[i].views * grow)} views` : "Posting…";
        const viewEl = viewRefs.current[i];
        if (viewEl && lastLabels[i] !== label) {
          viewEl.textContent = label;
          lastLabels[i] = label;
        }
      }
      overlayPath.setAttribute("d", c > 0 ? `M0 0H${W}V${H}H0Z${d}` : "");

      // Once the clips are in, the original stream is gone: what's behind them is the page.
      const streamGone = fadeIn >= 1;
      if (streamRef.current) streamRef.current.style.visibility = streamGone ? "hidden" : "visible";
      media.style.backgroundColor = streamGone ? "var(--bg)" : "";

      /* ── Centered text ───────────────────────────────────────────────── */
      const b = win(p, T.textB);
      const cc = seg(p, T.textC);
      [a, b, cc].forEach((v, idx) => {
        const el = textRefs.current[idx];
        if (!el) return;
        el.style.opacity = String(v);
        el.style.transform = `translate3d(0, ${(1 - v) * 28}px, 0) scale(${lerp(0.98, 1, v)})`;
        el.style.visibility = v > 0 ? "visible" : "hidden";
      });
      const counted = formatViews(TOTAL_VIEWS * easeOut(seg(p, T.count)));
      if (counterRef.current && counted !== lastCount) {
        counterRef.current.textContent = counted;
        lastCount = counted;
      }

      if (!reduced) {
        setHeroPlaying(inView && !streamGone);
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
        className="relative h-[720svh] motion-reduce:h-svh"
      >
        <span id="how" aria-hidden="true" className="absolute top-[205svh]" />
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

          {/* Media: the hero stream, which expands, is cut, and becomes the reel */}
          <div
            ref={mediaRef}
            className="absolute top-[60svh] right-0 bottom-0 left-0 z-20 overflow-hidden bg-midnight md:top-0 md:left-1/2"
          >
            <div ref={streamRef} className="absolute inset-0">
              <Image
                src="/media/hero-poster.webp"
                alt=""
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 768px) 50vw, 100vw"
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
            <div
              ref={scrimRef}
              aria-hidden="true"
              className="absolute inset-0 bg-midnight opacity-0"
            />
            <div
              ref={liveRef}
              aria-hidden="true"
              className="absolute bottom-5 left-5 flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-white uppercase [text-shadow:0_1px_8px_rgb(0_0_0/0.5)]"
            >
              <span className="size-1.5 animate-live rounded-full bg-live" />
              Live · watching
            </div>

            {/* The cuts: page-coloured everywhere except the clip windows */}
            <svg
              ref={overlayRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full"
              preserveAspectRatio="none"
            >
              <path ref={overlayPathRef} fill="var(--bg)" fillRule="evenodd" />
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
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(1_8_43/0.7),transparent_35%)]" />

                {/* Apple Pay-style completion */}
                <div
                  ref={(el) => {
                    checkRefs.current[i] = el;
                  }}
                  data-done="false"
                  className="pay-check absolute top-1/2 left-1/2 -mt-7 -ml-7 size-14 md:-mt-8 md:-ml-8 md:size-16"
                >
                  <svg viewBox="0 0 64 64" className="size-full overflow-visible">
                    <circle className="halo" cx="32" cy="32" r="30" />
                    <circle className="fill" cx="32" cy="32" r="30" />
                    <circle className="ring" cx="32" cy="32" r="30" pathLength={1} />
                    <path className="tick" d="M20 33.5 28 41.5 45 24" pathLength={1} />
                  </svg>
                </div>

                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 text-white">
                  <span className="flex items-center gap-1.5 text-xs font-medium">
                    <PlatformIcon platform={clip.platform} className="size-3.5" />
                    <span className="hidden sm:inline">{platforms[clip.platform].title}</span>
                  </span>
                  <span
                    ref={(el) => {
                      viewRefs.current[i] = el;
                    }}
                    className="font-mono text-[11px] tabular-nums"
                  >
                    Posting…
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Centered statements */}
          <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center px-6 text-center">
            <div
              ref={(el) => {
                textRefs.current[0] = el;
              }}
              className="invisible col-start-1 row-start-1 text-white opacity-0"
            >
              <p className="eyebrow text-white/75">01 — Live</p>
              <h2 className="mt-4 text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance">
                One live stream.
              </h2>
              <p className="mx-auto mt-5 max-w-[34ch] text-lg text-pretty text-white/85">
                Clippable watches it in real time, every second, so you don&apos;t have to.
              </p>
            </div>
            <div
              ref={(el) => {
                textRefs.current[1] = el;
              }}
              className="invisible col-start-1 row-start-1 text-fg opacity-0"
            >
              <p className="eyebrow text-royal">02 — Clipped</p>
              <h2 className="mx-auto mt-4 max-w-[14ch] text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance">
                Cut the second it happens.
              </h2>
              <p className="mx-auto mt-5 max-w-[36ch] text-lg text-pretty text-fg-muted">
                The best moments are found, trimmed, captioned and scored. Vertical, ready for every
                feed.
              </p>
            </div>
            <div
              ref={(el) => {
                textRefs.current[2] = el;
              }}
              className="invisible col-start-1 row-start-1 text-fg opacity-0"
            >
              <p className="eyebrow text-royal">03 — Posted</p>
              <p className="mt-3 text-[clamp(5rem,17vw,15rem)] leading-[0.85] font-medium tracking-[-0.06em] tabular-nums">
                <span ref={counterRef}>0</span>
              </p>
              <h2 className="mx-auto mt-5 max-w-[22ch] text-[clamp(1.5rem,3vw,2.5rem)] leading-tight font-medium tracking-[-0.03em] text-balance">
                views across eight clips. Posted everywhere.
              </h2>
              <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-fg-muted uppercase">
                Example figures
              </p>
            </div>
          </div>
        </div>
      </section>

      <StaticStory />
    </>
  );
}

/** Reduced-motion version: the same three beats, laid out as a normal section. */
function StaticStory() {
  return (
    <section
      aria-label="How Clippable works"
      className="hidden px-5 py-20 motion-reduce:block sm:px-10"
    >
      <ol className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
        {[
          ["01 — Live", "One live stream.", "Clippable watches it in real time."],
          ["02 — Clipped", "Cut the second it happens.", "Found, trimmed, captioned and scored."],
          ["03 — Posted", "Posted everywhere.", "Vertical clips, ready for every feed."],
        ].map(([label, title, body]) => (
          <li key={label}>
            <p className="eyebrow text-royal">{label}</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">{title}</h2>
            <p className="mt-1 text-fg-muted">{body}</p>
          </li>
        ))}
      </ol>
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
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-white">
              <PlatformIcon platform={clip.platform} className="size-3.5" />
              <span className="font-mono text-xs">{formatViews(clip.views)} views</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
