"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { PlatformIcon, platforms } from "@/components/platform-icons";
import { formatViews, storyClips, storySteps } from "@/lib/story";

/* ------------------------------------------------------------------ */
/* Timeline (fraction of the section's scroll distance)                */
/* ------------------------------------------------------------------ */
const T = {
  copyOut: [0, 0.12],
  expand: [0.02, 0.2],
  caption: [0.15, 0.2],
  split: [0.24, 0.4],
  tiles: [0.38, 0.56],
  post: [0.58, 0.88],
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, [a, b]: readonly [number, number]) => clamp((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
  const rr = Math.min(r, w / 2, h / 2);
  return `M${x + rr} ${y}H${x + w - rr}A${rr} ${rr} 0 0 1 ${x + w} ${y + rr}V${y + h - rr}A${rr} ${rr} 0 0 1 ${x + w - rr} ${y + h}H${x + rr}A${rr} ${rr} 0 0 1 ${x} ${y + h - rr}V${y + rr}A${rr} ${rr} 0 0 1 ${x + rr} ${y}Z`;
};

const TOTAL_VIEWS = storyClips.reduce((sum, c) => sum + c.views, 0);

export function ClipStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const overlayPathRef = useRef<SVGPathElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const counterValueRef = useRef<HTMLSpanElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tileVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
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
    const lastViews: string[] = [];
    let lastTotal = "";
    let lastStep = -1;

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
        tilesLoaded = true;
        tileVideoRefs.current.forEach((v) => v && (v.preload = "auto"));
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
      mobile = W < 1024;
      copyBottom = copy.offsetTop + copy.offsetHeight;
      overlay.setAttribute("viewBox", `0 0 ${W} ${H}`);
      lastP = -1;
    };

    const render = (p: number) => {
      /* 1 · Hero copy leaves, media expands to fill the screen */
      const out = seg(p, T.copyOut);
      copy.style.opacity = String(1 - out);
      copy.style.transform = `translate3d(0, ${-32 * out}px, 0)`;
      copy.style.visibility = out >= 1 ? "hidden" : "visible";
      if (cueRef.current) cueRef.current.style.opacity = String(1 - seg(p, [0, 0.04]));

      const e = easeInOut(seg(p, T.expand));
      const start = mobile
        ? { t: Math.min(copyBottom + 20, H - 200), r: 12, b: 12, l: 12 }
        : { t: 12, r: 12, b: 12, l: W * 0.5 };
      media.style.inset = `${lerp(start.t, 0, e)}px ${lerp(start.r, 0, e)}px ${lerp(start.b, 0, e)}px ${lerp(start.l, 0, e)}px`;
      media.style.borderRadius = `${lerp(mobile ? 24 : 28, 0, e)}px`;

      /* 2 · The stream is cut into eight pieces */
      const s = easeInOut(seg(p, T.split));
      const cols = mobile ? 2 : 4;
      const rows = mobile ? 4 : 2;
      const m = lerp(0, mobile ? 12 : 24, s);
      const ay = lerp(0, mobile ? 72 : 92, s);
      const ah = H - ay - lerp(0, mobile ? 150 : 136, s);
      const aw = W - 2 * m;
      const g = lerp(0, mobile ? 8 : 14, s);
      const r = lerp(0, mobile ? 14 : 20, s);
      const tw = (aw - g * (cols - 1)) / cols;
      const th = (ah - g * (rows - 1)) / rows;

      if (s > 0) {
        let d = `M0 0H${W}V${H}H0Z`;
        for (let i = 0; i < 8; i++) {
          const c = i % cols;
          const rr = Math.floor(i / cols);
          d += roundedRect(m + c * (tw + g), ay + rr * (th + g), tw, th, r);
        }
        overlayPath.setAttribute("d", d);
      } else {
        overlayPath.setAttribute("d", "");
      }

      /* 3 · Each piece becomes its own clip */
      const v = seg(p, T.tiles);
      const q = seg(p, T.post);
      let total = 0;
      for (let i = 0; i < 8; i++) {
        const tile = tileRefs.current[i];
        if (!tile) continue;
        const c = i % cols;
        const rr = Math.floor(i / cols);
        const x = m + c * (tw + g);
        const y = ay + rr * (th + g);
        const o = easeOut(seg(v, [i * 0.07, i * 0.07 + 0.4]));
        tile.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        tile.style.width = `${tw}px`;
        tile.style.height = `${th}px`;
        tile.style.borderRadius = `${r}px`;
        tile.style.opacity = String(o);
        tile.style.visibility = o > 0 ? "visible" : "hidden";

        /* 4 · Posted, views climb */
        const k = seg(q, [i * 0.06, i * 0.06 + 0.45]);
        const posted = k > 0.2;
        const chip = chipRefs.current[i];
        if (chip && chip.dataset.posted !== String(posted)) chip.dataset.posted = String(posted);
        const views = storyClips[i].views * easeOut(seg(k, [0.2, 1]));
        total += views;
        const label = posted ? `${formatViews(views)} views` : "Ready to post";
        const viewEl = viewRefs.current[i];
        if (viewEl && lastViews[i] !== label) {
          viewEl.textContent = label;
          lastViews[i] = label;
        }
      }

      const totalLabel = formatViews(total);
      if (counterValueRef.current && totalLabel !== lastTotal) {
        counterValueRef.current.textContent = totalLabel;
        lastTotal = totalLabel;
      }

      /* Captions */
      const step = p < T.split[0] ? 0 : p < T.post[0] - 0.02 ? 1 : 2;
      if (step !== lastStep) {
        stepRefs.current.forEach((el, idx) => el && (el.dataset.active = String(idx === step)));
        lastStep = step;
      }
      if (captionRef.current) {
        const co = seg(p, T.caption);
        captionRef.current.style.opacity = String(co);
        captionRef.current.style.transform = `translate3d(0, ${(1 - co) * 16}px, 0)`;
        captionRef.current.style.visibility = co > 0 ? "visible" : "hidden";
      }
      if (counterRef.current) {
        const show = step === 2 ? 1 : 0;
        counterRef.current.dataset.visible = String(show === 1);
      }

      /* Media playback follows what's on screen */
      if (!reduced) {
        setHeroPlaying(inView && v < 1);
        setTilesPlaying(inView && p > T.split[0] - 0.04);
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
        className="relative h-[520svh] motion-reduce:h-svh"
      >
        <span id="how" aria-hidden="true" className="absolute top-[150svh]" />
        <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden bg-bg">
          {/* Soft brand glow behind the copy */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-48 -left-40 size-[44rem] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--color-sky) 45%, transparent), transparent)",
            }}
          />

          {/* Hero copy */}
          <div
            ref={copyRef}
            className="relative z-10 flex flex-col px-5 pt-24 sm:px-8 lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2 lg:justify-center lg:px-[clamp(2rem,5.5vw,5.5rem)] lg:pt-0"
          >
            <p className="eyebrow text-fg-muted">Automated clipping for livestreams</p>
            <h1
              id="hero-title"
              className="mt-4 max-w-[13ch] text-[clamp(2.4rem,4.8vw,4.6rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-fg"
            >
              Clips from every stream,{" "}
              <span className="text-gradient">the second they happen.</span>
            </h1>
            <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
              Pick your streamers. Clippable watches every live stream at once, cuts the best
              moments as they happen and hands you clips ready to post.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#early-access"
                className="inline-flex h-12 items-center rounded-full bg-accent px-6 font-medium text-accent-fg shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--color-royal)_70%,transparent)] transition-transform duration-300 ease-out-expo hover:-translate-y-0.5"
              >
                Get early access
              </a>
              <a
                href="#how"
                className="inline-flex h-12 items-center rounded-full border border-border bg-bg/80 px-6 font-medium text-fg backdrop-blur transition-colors hover:bg-bg-subtle"
              >
                See how it works
              </a>
            </div>
          </div>

          <div
            ref={cueRef}
            aria-hidden="true"
            className="absolute bottom-8 left-[clamp(2rem,5.5vw,5.5rem)] z-10 hidden items-center gap-3 text-fg-muted motion-reduce:hidden lg:flex"
          >
            <span className="relative flex size-5 items-center justify-center rounded-full border border-border">
              <span className="size-1.5 animate-bounce rounded-full bg-blue" />
            </span>
            <span className="eyebrow">Scroll to see it work</span>
          </div>

          {/* Media: starts as the hero panel, expands, splits into clips */}
          <div
            ref={mediaRef}
            className="absolute top-[58svh] right-3 bottom-3 left-3 z-20 overflow-hidden rounded-3xl bg-midnight lg:top-3 lg:left-1/2 lg:rounded-[28px]"
          >
            <Image
              src="/media/hero-poster.webp"
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <video
              ref={heroVideoRef}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 data-[ready=true]:opacity-100"
            >
              <source src="/media/hero.av1.mp4" type='video/mp4; codecs="av01.0.05M.08"' />
              <source src="/media/hero.h264.mp4" type="video/mp4" />
            </video>

            {/* Live badge on the hero panel */}
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-sm backdrop-blur">
              <span className="size-2 animate-live rounded-full bg-live" aria-hidden="true" />
              LIVE
              <span className="font-mono font-normal text-fg-muted">Clippable is watching</span>
            </div>

            {/* Gaps that cut the stream into tiles */}
            <svg
              ref={overlayRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full"
              preserveAspectRatio="none"
            >
              <path ref={overlayPathRef} fill="var(--bg)" fillRule="evenodd" />
            </svg>

            {/* The eight clips */}
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
                  poster={`/media/clips/clip-${clip.id}.webp`}
                  className="size-full object-cover"
                >
                  <source
                    src={`/media/clips/clip-${clip.id}.av1.mp4`}
                    type='video/mp4; codecs="av01.0.05M.08"'
                  />
                  <source src={`/media/clips/clip-${clip.id}.h264.mp4`} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(1_8_43/0.75),transparent_45%,transparent_75%,rgb(1_8_43/0.35))]" />
                <div className="absolute inset-x-2.5 top-2.5 hidden items-center justify-between font-mono text-[11px] text-white lg:flex">
                  <span className="rounded-full bg-black/35 px-2 py-0.5 backdrop-blur">
                    Clip {String(clip.id).padStart(2, "0")} · {clip.length}
                  </span>
                  <span className="rounded-full bg-black/35 px-2 py-0.5 backdrop-blur">
                    ★ {clip.score}
                  </span>
                </div>
                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 lg:inset-x-3 lg:bottom-3">
                  <span
                    ref={(el) => {
                      chipRefs.current[i] = el;
                    }}
                    data-posted="false"
                    className="post-chip group/chip relative inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-white/95 pr-2.5 pl-1 text-xs font-semibold text-ink transition-colors duration-300 data-[posted=true]:bg-royal data-[posted=true]:text-white"
                  >
                    <span className="flex size-5 items-center justify-center rounded-full bg-ink text-white group-data-[posted=true]/chip:bg-white">
                      <PlatformIcon
                        platform={clip.platform}
                        className="size-3 group-data-[posted=true]/chip:text-ink"
                      />
                    </span>
                    <span className="hidden group-data-[posted=true]/chip:hidden sm:inline">
                      Post
                    </span>
                    <span className="hidden group-data-[posted=true]/chip:sm:inline">Posted</span>
                    <svg
                      viewBox="0 0 16 16"
                      className="plane size-3.5"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M15 1 1 7l5 2 2 5 7-13Zm-8.3 7.6L12 3.4 7.6 9.5l-.9-.9Z" />
                    </svg>
                    <svg
                      viewBox="0 0 16 16"
                      className="check absolute right-2 size-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      aria-hidden="true"
                    >
                      <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span
                    ref={(el) => {
                      viewRefs.current[i] = el;
                    }}
                    className="truncate font-mono text-[11px] text-white tabular-nums lg:text-xs"
                  >
                    Ready to post
                  </span>
                </div>
                <span className="sr-only">{platforms[clip.platform].title}</span>
              </div>
            ))}
          </div>

          {/* Captions */}
          <div
            ref={captionRef}
            className="invisible absolute inset-x-3 bottom-3 z-30 flex items-end justify-between gap-4 opacity-0 lg:inset-x-6 lg:bottom-6"
          >
            <div className="relative grid min-w-0 flex-1 rounded-2xl border border-border bg-bg/95 px-4 py-3 shadow-[0_12px_40px_-16px_rgb(1_8_43/0.25)] backdrop-blur lg:max-w-xl lg:flex-none lg:basis-xl lg:px-5 lg:py-4">
              {storySteps.map((step, idx) => (
                <div
                  key={step.label}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  data-active={idx === 0 ? "true" : "false"}
                  className="col-start-1 row-start-1 translate-y-2 opacity-0 transition-all duration-500 ease-out-expo data-[active=true]:translate-y-0 data-[active=true]:opacity-100"
                >
                  <p className="eyebrow text-royal">{step.label}</p>
                  <h2 className="mt-1 text-lg leading-snug font-semibold tracking-tight text-fg lg:text-xl">
                    {step.title}
                  </h2>
                  <p className="mt-0.5 hidden text-sm text-fg-muted sm:block">{step.body}</p>
                </div>
              ))}
            </div>
            <div
              ref={counterRef}
              data-visible="false"
              aria-hidden="true"
              className="hidden shrink-0 rounded-2xl border border-border bg-bg/95 px-3 py-3 text-right shadow-[0_12px_40px_-16px_rgb(1_8_43/0.25)] backdrop-blur data-[visible=true]:block data-[visible=true]:animate-[card-in_500ms_var(--ease-out-expo)_both] lg:px-5 lg:py-4"
            >
              <p className="eyebrow text-fg-muted">
                Views<span className="hidden lg:inline"> across 8 clips</span>
              </p>
              <p className="mt-0.5 font-mono text-2xl font-medium tracking-tight text-fg tabular-nums lg:text-4xl">
                <span ref={counterValueRef}>0</span>
              </p>
              <p className="hidden text-[11px] text-fg-muted lg:block">Example figures</p>
            </div>
          </div>
        </div>
      </section>

      <StaticClipGrid />
    </>
  );
}

/** Reduced-motion version of the story: the end state, laid out as a normal section. */
function StaticClipGrid() {
  return (
    <section
      aria-label="How Clippable works"
      className="hidden px-5 py-20 motion-reduce:block sm:px-8"
    >
      <ol className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
        {storySteps.map((step) => (
          <li key={step.label}>
            <p className="eyebrow text-royal">{step.label}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">{step.title}</h2>
            <p className="mt-1 text-fg-muted">{step.body}</p>
          </li>
        ))}
      </ol>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 lg:grid-cols-4">
        {storyClips.map((clip) => (
          <div
            key={clip.id}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-midnight"
          >
            <Image
              src={`/media/clips/clip-${clip.id}.webp`}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
              <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-royal pr-2.5 pl-1 text-xs font-semibold text-white">
                <span className="flex size-5 items-center justify-center rounded-full bg-white text-ink">
                  <PlatformIcon platform={clip.platform} className="size-3" />
                </span>
                Posted
              </span>
              <span className="font-mono text-xs text-white">{formatViews(clip.views)} views</span>
            </div>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-4 max-w-6xl text-sm text-fg-muted">
        Example figures · {formatViews(TOTAL_VIEWS)} views across 8 clips
      </p>
    </section>
  );
}
