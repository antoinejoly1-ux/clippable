"use client";

import Image from "next/image";
import { Button } from "@/components/button";
import { site } from "@/lib/site";
import { useEffect, useRef, useState } from "react";
import { storyClips } from "@/lib/story";
import { streamers } from "@/lib/streamers";

/*
 * Hero + scroll story.
 *
 * Load:   letters reveal, the period lands, the CTA rises, then a gap opens in
 *         "Make clips ▶ instantly." and the 4:3 player springs in.
 * Scroll: the player leaves the headline and takes the full screen → it is cut in half
 *         top to bottom and into four across → each piece becomes its own vertical clip.
 *         White throughout; everything moves vertically.
 */
const T = {
  copyOut: [0, 0.1],
  grow: [0, 0.26],
  cut: [0.27, 0.33],
  morph: [0.32, 0.46],
  clipsIn: [0.36, 0.48],
  send: [0.5, 0.72],
  split: [0.74, 0.88],
  text: [0.8, 0.92],
} as const;

const INTRO_MS = 2400; // how long the load animation keeps the player glued to its slot

type Range = readonly [number, number];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, [a, b]: Range) => clamp((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  if (rr === 0) return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
  return `M${x + rr} ${y}H${x + w - rr}A${rr} ${rr} 0 0 1 ${x + w} ${y + rr}V${y + h - rr}A${rr} ${rr} 0 0 1 ${x + w - rr} ${y + h}H${x + rr}A${rr} ${rr} 0 0 1 ${x} ${y + h - rr}V${y + rr}A${rr} ${rr} 0 0 1 ${x + rr} ${y}Z`;
};

const N = storyClips.length;

type Audience = "clipper" | "streamer";

/** Hero copy for each side of the marketplace. The switch flips between them. */
const HERO: Record<
  Audience,
  { title: string; lead: string; sub: string; cta: string; proof: [string, string] }
> = {
  clipper: {
    title: "Make clips instantly.",
    lead: "Make clips",
    sub: "Clippable turns Kick and Twitch streams into vertical clips while they're live. Post them and earn on every 1,000 views.",
    cta: "Start clipping now",
    proof: ["100+ streamer campaigns", "on Kick and Twitch"],
  },
  streamer: {
    title: "Get clipped instantly.",
    lead: "Get clipped",
    sub: "Go live as usual. Clippers post your best moments to TikTok, Shorts, Reels and X, and you only pay per 1,000 views.",
    cta: "Start a campaign",
    proof: ["Join 100+ streamers", "already getting clipped"],
  },
};

/** Clipper / streamer switch: a sliding thumb inside a pill track. */
function AudienceSwitch({ value, onChange }: { value: Audience; onChange: (a: Audience) => void }) {
  const options: { id: Audience; label: string }[] = [
    { id: "clipper", label: "I clip" },
    { id: "streamer", label: "I stream" },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="Show Clippable for"
      className="hero-rise pointer-events-auto relative grid grid-cols-2 rounded-[14px] border border-white/80 bg-white/55 p-1 shadow-[0_10px_30px_-18px_rgb(1_8_43/0.4)] backdrop-blur-md [animation-delay:60ms]"
      onKeyDown={(e) => {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
          e.preventDefault();
          const next = value === "clipper" ? "streamer" : "clipper";
          onChange(next);
          (e.currentTarget.querySelector(`[data-id="${next}"]`) as HTMLElement | null)?.focus();
        }
      }}
    >
      {/* The thumb slides under the chosen option. */}
      <span
        aria-hidden="true"
        className="switch-thumb absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-[10px] bg-midnight shadow-[0_6px_16px_-6px_rgb(1_8_43/0.6)]"
        style={{ transform: value === "streamer" ? "translateX(100%)" : "translateX(0)" }}
      />
      {options.map((o) => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            data-id={o.id}
            onClick={() => onChange(o.id)}
            className={`relative z-[1] h-10 rounded-[10px] px-5 text-[15px] font-medium whitespace-nowrap transition-[color,scale] duration-300 select-none [-webkit-tap-highlight-color:transparent] active:scale-[0.96] sm:px-6 ${
              on ? "text-white" : "text-fg hover:text-fg-muted"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Letter-by-letter reveal. Visual only: the h1 carries the real text in an sr-only span. */
function Letters({ text, delay }: { text: string; delay: number }) {
  return (
    <span aria-hidden="true" className="inline-block whitespace-nowrap">
      {[...text].map((ch, i) => (
        <span
          key={i}
          className="hero-letter inline-block"
          style={{ animationDelay: `${delay + i * 32}ms` }}
        >
          {ch === " " ? "\u00a0" : ch}
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
  const overlayRef = useRef<SVGSVGElement>(null);
  const overlayPathRef = useRef<SVGPathElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tileVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const textRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const followRef = useRef<() => void>(() => {});
  const [audience, setAudience] = useState<Audience>("clipper");
  const [swapped, setSwapped] = useState(false);
  const copy = HERO[audience];

  // Restore the visitor's side (?for=streamers or their last choice) after hydration.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = new URLSearchParams(location.search).get("for") ?? localStorage.getItem("audience");
    } catch {}
    if (saved === "streamer" || saved === "streamers") {
      const t = window.setTimeout(() => setAudience("streamer"), 0);
      return () => window.clearTimeout(t);
    }
  }, []);
  useEffect(() => {
    document.documentElement.dataset.audience = audience;
  }, [audience]);

  const switchAudience = (next: Audience) => {
    if (next === audience) return;
    setSwapped(true);
    setAudience(next);
    try {
      localStorage.setItem("audience", next);
    } catch {}
    // The headline's first word changes width, so the player follows its slot for a moment.
    requestAnimationFrame(() => followRef.current());
  };
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
    let short = false;
    let headerH = 64;
    let lastBox = "";
    let lastOverlay = "x";
    let textRatio = 0; // statement width per px of font size, on one line
    let disposed = false;
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
      // Measure with the copy's scroll transform removed, so the slot is always found
      // where it sits at rest, even if the page loads part-way down.
      const prev = copy.style.transform;
      copy.style.transform = "none";
      const s = stage.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      copy.style.transform = prev;
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
      // Grid shape follows the screen's shape, so landscape phones get the wide layout.
      mobile = W < 768 && H >= W;
      short = H < 520;
      // The fixed header is 64px, or 80px from sm up. Read it so the full-screen player clears it.
      headerH = document.querySelector<HTMLElement>("header > div")?.offsetHeight ?? 64;
      const st = textRef.current;
      if (st) {
        st.style.fontSize = "100px";
        st.style.whiteSpace = "nowrap";
        st.style.width = "auto";
        st.style.display = "inline-block";
        textRatio = st.offsetWidth / 100;
        st.style.display = "";
      }
      overlay.setAttribute("viewBox", `0 0 ${W} ${H}`);
      measureSlot();
      lastP = -1;
      lastBox = "";
    };

    const render = (p: number) => {
      /* ── 1 · The player leaves the headline and grows, centred on white ── */
      const out = seg(p, T.copyOut);
      copy.style.opacity = String(1 - out);
      copy.style.transform = `translate3d(0, ${-24 * out}px, 0) scale(${lerp(1, 0.97, out)})`;
      copy.style.visibility = out >= 1 ? "hidden" : "visible";
      if (glowRef.current) glowRef.current.style.opacity = String(1 - seg(p, [0, 0.12]));
      if (cueRef.current) {
        cueRef.current.style.opacity = String(1 - seg(p, [0, 0.03]));
        // display:none stops the looping cue animation; opacity 0 alone does not.
        cueRef.current.style.display = p > 0.03 ? "none" : "";
      }

      const g = easeInOut(seg(p, T.grow));
      const pad = mobile ? 12 : 24;
      const top = headerH + (short ? 8 : mobile ? 12 : 16);
      // "Full screen": the whole viewport below the nav, minus a small margin.
      const full = { x: pad, y: top, w: W - 2 * pad, h: H - top - pad };
      const bx = lerp(slotRect.x, full.x, g);
      const by = lerp(slotRect.y, full.y, g);
      const bw = lerp(slotRect.w, full.w, g);
      const bh = lerp(slotRect.h, full.h, g);
      const br = lerp(slotRect.r, mobile ? 14 : 18, g);
      // Only touch the player when it actually changes (each write can cost a layout).
      const boxKey = `${bx.toFixed(1)}|${by.toFixed(1)}|${bw.toFixed(1)}|${bh.toFixed(1)}|${br.toFixed(1)}`;
      if (boxKey !== lastBox) {
        lastBox = boxKey;
        box.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        box.style.width = `${bw}px`;
        box.style.height = `${bh}px`;
        box.style.borderRadius = `${br}px`;
      }
      box.style.opacity = slotRect.w > 1 ? "1" : "0";
      // The slot's dark fill is only a stand-in until the player is drawn over it.
      if (slotRect.w > 1) {
        slot.style.backgroundColor = "transparent";
        slot.style.backgroundImage = "none";
      }

      /* ── 2 · Cut into a grid (2 rows × 4 across; 4 × 2 on phones) ─────── */
      const cols = mobile ? 2 : 4;
      const rows = Math.ceil(N / cols);
      const c = easeInOut(seg(p, T.cut));
      const m = easeInOut(seg(p, T.morph));
      const cutGap = lerp(0, mobile ? 8 : 14, c);
      const pw = (full.w - cutGap * (cols - 1)) / cols;
      const ph = (full.h - cutGap * (rows - 1)) / rows;

      /* ── 3 · Each piece becomes a vertical 9:16 clip ─────────────────── */
      const G = mobile ? 10 : 18;
      const clipH0 = Math.min(
        (full.h - G * (rows - 1)) / rows,
        (((full.w - G * (cols - 1)) / cols) * 16) / 9,
      );
      /* ── 5 · Then the clips shrink a little and the rows part around a statement ── */
      const sp = easeInOut(seg(p, T.split));
      const TG = short ? 56 : mobile ? 96 : 150; // the gap that opens between the middle rows
      const clipH1 = Math.min(clipH0 * 0.84, (full.h - G * (rows - 1) - TG) / rows);
      const clipH = lerp(clipH0, clipH1, sp);
      const extra = TG * sp;
      const clipW = (clipH * 9) / 16;
      const gridW = cols * clipW + (cols - 1) * G;
      const gridH = rows * clipH + (rows - 1) * G + extra;
      const gx = (W - gridW) / 2;
      const gy = full.y + (full.h - gridH) / 2;
      const half = rows / 2;
      const radius = lerp(mobile ? 8 : 12, mobile ? 10 : 12, m);
      const fadeIn = seg(p, T.clipsIn);
      const k = seg(p, T.send);

      let d = "";
      for (let i = 0; i < N; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const rowY = gy + row * (clipH + G) + (row >= half ? extra : 0);
        const x = lerp(full.x + col * (pw + cutGap), gx + col * (clipW + G), m);
        const y = lerp(full.y + row * (ph + cutGap), rowY, m);
        const w = lerp(pw, clipW, m);
        const h = lerp(ph, clipH, m);
        if (c > 0) d += roundedRect(x, y, w, h, radius);

        const tile = tileRefs.current[i];
        if (!tile) continue;
        const o = easeOut(seg(fadeIn, [i * 0.06, i * 0.06 + 0.5]));
        // The tile frame shows as soon as the cut starts; its own clip fades in on top.
        tile.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        tile.style.width = `${w}px`;
        tile.style.height = `${h}px`;
        tile.style.borderRadius = `${radius}px`;
        tile.style.opacity = o > 0 ? "1" : "0";
        tile.style.visibility = o > 0 ? "visible" : "hidden";
        const tv = tileVideoRefs.current[i];
        if (tv) tv.style.opacity = String(o);

        /* ── 4 · Posting: a paper plane flies off, then a green check ──── */
        const startAt = (i / N) * 0.7;
        const state = k > startAt + 0.14 ? "done" : k > startAt ? "sending" : "idle";
        const check = checkRefs.current[i];
        if (check) {
          if (check.dataset.state !== state) check.dataset.state = state;
          // Never wider than ~half the tile, so it fits on small or short screens.
          const size = Math.min(mobile ? 48 : 56, w * 0.5);
          check.style.width = check.style.height = `${size}px`;
          check.style.margin = `${-size / 2}px 0 0 ${-size / 2}px`;
        }
      }

      const text = textRef.current;
      if (text) {
        const t = seg(p, T.text);
        const midY = gy + half * clipH + (half - 1) * G + (G + extra) / 2;
        // Sized to span the clip grid exactly: one line where it fits, two on narrow screens.
        const gridW1 = cols * ((clipH1 * 9) / 16) + (cols - 1) * G;
        const one = textRatio ? (gridW1 / textRatio) * 0.98 : 48;
        const twoLines = one < 30;
        // Narrow screens: two lines across the screen width, sized to fit the gap between rows.
        const wide = W - 40;
        const size = twoLines
          ? Math.min(textRatio ? ((wide * 1.6) / textRatio) * 0.95 : 36, (TG + G) * 0.4)
          : Math.min(one, TG * 0.78);
        text.style.fontSize = `${size}px`;
        text.style.whiteSpace = twoLines ? "normal" : "nowrap";
        text.style.width = `${twoLines ? wide : gridW1}px`;
        text.style.opacity = String(t);
        // Lands with a slight settle: rises 18px as it fades in.
        text.style.transform = `translate3d(0, ${midY + (1 - easeOut(t)) * 18}px, 0) translateY(-50%)`;
        text.style.visibility = t > 0 ? "visible" : "hidden";
      }

      // White cuts: the page shows through everywhere except the pieces.
      // Once every clip has faded in it covers the player and the cut-out mask, so both
      // switch off: no full-screen mask redraw or video decode for the rest of the story.
      const covered = fadeIn >= 1;
      box.style.visibility = covered ? "hidden" : "visible";
      const od = c > 0 && !covered ? `M0 0H${W}V${H}H0Z${d}` : "";
      if (od !== lastOverlay) {
        lastOverlay = od;
        overlayPath.setAttribute("d", od);
      }

      if (!reduced) {
        setHeroPlaying(inView && fadeIn < 1);
        setTilesPlaying(inView && p > T.cut[0] - 0.05);
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
    let followUntil = introStart + INTRO_MS;
    const intro = () => {
      measureSlot();
      render(progress());
      introRaf = performance.now() < followUntil ? requestAnimationFrame(intro) : 0;
    };
    followRef.current = () => {
      followUntil = performance.now() + 900;
      if (!introRaf) introRaf = requestAnimationFrame(intro);
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

    // Magnetic stops: when scrolling settles near a key frame of the story (the hero, the
    // full player, the clip grid, the posted grid, the statement), glide onto it.
    const STOPS = [0, T.grow[1], T.clipsIn[1], T.send[1], T.text[1]];
    let idle = 0;
    const settle = () => {
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (y: number, o: object) => void; isScrolling: unknown };
        }
      ).__lenis;
      if (!lenis || lenis.isScrolling || reduced || !inView) return;
      const distance = section.offsetHeight - H;
      const p = progress();
      if (p <= 0 || p >= 1) return;
      const k = STOPS.reduce((a, b) => (Math.abs(b - p) < Math.abs(a - p) ? b : a));
      if (Math.abs(k - p) > 0.06 || Math.abs(k - p) < 0.003) return;
      lenis.scrollTo(section.offsetTop + k * distance, {
        duration: 0.9,
        easing: (x: number) => 1 - Math.pow(1 - x, 3),
      });
    };
    const onScrollIdle = () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, 180);
    };
    window.addEventListener("scroll", onScrollIdle, { passive: true });
    document.fonts?.ready.then(() => {
      if (disposed) return;
      measure();
      schedule();
    });

    return () => {
      disposed = true;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("scroll", onScrollIdle);
      window.clearTimeout(idle);
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
        className="relative h-[420svh] motion-reduce:h-svh"
      >
        <span id="how" aria-hidden="true" className="absolute top-[120svh]" />
        <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden bg-bg">
          {/* A squeezed blue ellipse pressing down from the top; fades as the story starts. */}
          <div ref={glowRef} aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
            <div className="hero-sky absolute inset-0" />
            <div className="hero-grain absolute inset-0" />
          </div>
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
                preload
                fetchPriority="high"
                sizes="(min-width: 768px) 70vw, 100vw"
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
            </div>

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
                  {/* Phones get a 270×480 set: tiles render ~100px wide there. */}
                  <source
                    media="(max-width: 767px)"
                    src={`/media/clips/clip-${clip.id}.m.av1.mp4`}
                    type='video/mp4; codecs="av01.0.04M.08"'
                  />
                  <source
                    media="(max-width: 767px)"
                    src={`/media/clips/clip-${clip.id}.m.h264.mp4`}
                    type="video/mp4"
                  />
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
                  data-state="idle"
                  className="send-check absolute top-1/2 left-1/2 z-10 size-12"
                >
                  <span className="send-disc" />
                  <svg viewBox="0 0 24 24" className="send-plane" fill="currentColor">
                    <path d="M21.7 2.3 2.9 9.6c-.8.3-.8 1.4 0 1.7l6.6 2.3 2.3 6.6c.3.8 1.4.8 1.7 0L21.7 2.3Zm-10.4 11L19 5.6l-6.3 8.9-1.4-1.2Z" />
                  </svg>
                  <svg viewBox="0 0 24 24" className="send-tick" fill="none">
                    <path d="m6 12.5 4 4 8-9" pathLength={1} />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Hero copy, centred. The player sits in the headline's slot. */}
          <div
            ref={copyRef}
            className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-4 pt-20 text-center [@media(max-height:520px)]:pt-14"
          >
            <AudienceSwitch value={audience} onChange={switchAudience} />
            <h1
              id="hero-title"
              className="mt-7 text-[clamp(2.5rem,min(8.4vw,15svh),9.5rem)] leading-[0.9] font-semibold tracking-[-0.055em] text-fg [@media(max-height:520px)]:mt-3"
            >
              {/* Real text for crawlers and screen readers; the animated letters are aria-hidden. */}
              <span className="sr-only">{copy.title}</span>
              {/* A dot leads the reveal left to right, then becomes the full stop (desktop). */}
              <span className="relative inline-block">
                <span
                  className={`hero-reveal relative inline-flex flex-wrap items-center justify-center ${
                    swapped ? "hero-swap" : ""
                  }`}
                >
                  <Letters key={`a-${audience}`} text={copy.lead} delay={swapped ? 0 : 150} />
                  <span
                    ref={slotRef}
                    aria-hidden="true"
                    className="hero-slot inline-block h-[0.8em] overflow-hidden rounded-[0.12em] bg-midnight"
                  />
                  <span className="inline-flex items-baseline">
                    <Letters text="instantly" delay={420} />
                    <span aria-hidden="true" className="hero-dot inline-block">
                      .
                    </span>
                  </span>
                </span>
                <span aria-hidden="true" className="hero-cover">
                  <span className="hero-cover-dot" />
                </span>
              </span>
            </h1>

            <p
              key={`s-${audience}`}
              className={`${swapped ? "swap-in" : "hero-rise [animation-delay:950ms]"} mt-6 max-w-[50ch] text-[clamp(1rem,1.3vw,1.2rem)] leading-snug text-pretty text-fg-muted [@media(max-height:520px)]:hidden`}
            >
              {copy.sub}
            </p>

            {/* The CTA spans the proof row below it, so the two read as one block. */}
            <div className="mt-8 inline-flex flex-col items-stretch [@media(max-height:520px)]:mt-5">
              <Button
                href={site.signupUrl}
                size="xl"
                className="hero-rise pointer-events-auto [animation-delay:1050ms]"
              >
                <span key={`c-${audience}`} className={swapped ? "swap-in" : ""}>
                  {copy.cta}
                </span>
              </Button>

              <div className="hero-rise mt-5 flex items-center gap-3 [animation-delay:1150ms] [@media(max-height:520px)]:hidden">
                <span aria-hidden="true" className="flex -space-x-2">
                  {streamers.slice(0, 5).map((st) => (
                    <Image
                      key={st.id}
                      src={st.avatar}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 rounded-full object-cover ring-2 ring-white"
                    />
                  ))}
                </span>
                <p
                  key={`t-${audience}`}
                  className={`text-left text-sm leading-snug text-fg-muted ${swapped ? "swap-in" : ""}`}
                >
                  <span className="font-medium text-fg">{copy.proof[0]}</span> <br />
                  {copy.proof[1]}
                </p>
              </div>
            </div>
          </div>

          {/* The statement that appears as the rows part */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-6 text-center">
            <p
              ref={textRef}
              className="invisible mx-auto leading-[1.02] font-medium tracking-[-0.045em] text-balance text-fg opacity-0"
            >
              While it&apos;s happening live.
            </p>
          </div>

          <div
            ref={cueRef}
            aria-hidden="true"
            className="hero-rise absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2.5 [animation-delay:1300ms] motion-reduce:hidden"
          >
            <span className="font-mono text-[10px] tracking-[0.14em] text-fg-muted uppercase">
              Scroll
            </span>
            <span className="relative block h-14 w-[2px] overflow-hidden rounded-full bg-fg/12">
              <span className="absolute inset-x-0 top-0 h-6 animate-[scroll-cue_1.6s_var(--ease-out-expo)_infinite] rounded-full bg-electric" />
            </span>
          </div>
        </div>
      </section>

      <StaticStory />
    </>
  );
}

/** Reduced-motion version: the clips, laid out as a normal section. */
function StaticStory() {
  return (
    <section
      aria-label="Clips made instantly"
      className="hidden px-5 py-16 motion-reduce:block sm:px-10"
    >
      <p className="mx-auto mb-10 max-w-[18ch] text-center text-3xl font-medium tracking-[-0.04em] text-balance sm:text-5xl">
        While it&apos;s happening live.
      </p>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
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
