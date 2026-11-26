"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlatformIcon, platforms } from "@/components/platform-icons";
import { streamers, type Streamer } from "@/lib/streamers";

const byId = new Map(streamers.map((s) => [s.id, s]));
const DEFAULT_FOLLOWING = ["n3on", "plaqueboymax", "lacy"];
const MAX_CARDS = 8;
const NEW_CLIP_EVERY_MS = 2800;

type ClipCard = { key: number; streamerId: string; length: string; score: string; seed: number };

/* Deterministic pseudo-random so server and client render the same initial cards. */
const pseudo = (n: number) => {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};
const makeCard = (key: number, streamerId: string, seed = key): ClipCard => ({
  key,
  streamerId,
  length: `0:${String(14 + Math.floor(pseudo(seed) * 32)).padStart(2, "0")}`,
  score: (4.1 + pseudo(seed + 7) * 0.8).toFixed(1),
  seed,
});

/* ------------------------------------------------------------------ */

export function StreamerPicker() {
  const [following, setFollowing] = useState<string[]>(DEFAULT_FOLLOWING);
  const [paused, setPaused] = useState(false);

  const toggle = useCallback((id: string) => {
    setFollowing((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }, []);

  return (
    <div>
      <div className="relative">
        <TickerRow items={streamers} following={following} onToggle={toggle} paused={paused} />
        <TickerRow
          items={[...streamers].reverse()}
          following={following}
          onToggle={toggle}
          paused={paused}
          reverse
          interactive={false}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg-subtle to-transparent sm:w-32"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg-subtle to-transparent sm:w-32"
        />
      </div>

      <div className="mx-auto mt-5 flex max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <p className="text-sm text-fg-muted">
          <span className="font-medium text-fg">
            Tap<span className="hidden sm:inline"> a streamer</span> to follow.
          </span>{" "}
          Following <span className="font-mono text-fg tabular-nums">{following.length}</span> of{" "}
          {streamers.length}
        </p>
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-bg px-3.5 text-sm font-medium text-fg transition-colors hover:bg-bg-subtle motion-reduce:hidden"
        >
          {paused ? (
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
              <path d="M4 2.5v11l9-5.5-9-5.5Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
              <path d="M4 2.5h2.5v11H4zM9.5 2.5H12v11H9.5z" />
            </svg>
          )}
          {paused ? "Play" : "Pause"}
          <span className="sr-only"> streamer ticker</span>
        </button>
      </div>

      <LiveFeed following={following} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ticker                                                              */
/* ------------------------------------------------------------------ */

function TickerRow({
  items,
  following,
  onToggle,
  paused,
  reverse = false,
  interactive = true,
}: {
  items: Streamer[];
  following: string[];
  onToggle: (id: string) => void;
  paused: boolean;
  reverse?: boolean;
  interactive?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll velocity speeds the ticker up, then it eases back to cruising speed.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lastY = window.scrollY;
    let boost = 0;
    let raf = 0;
    let visible = false;

    const loop = () => {
      raf = 0;
      boost *= 0.92;
      const anim = track.getAnimations()[0];
      if (anim) anim.updatePlaybackRate(1 + boost);
      if (boost > 0.01 && visible) raf = requestAnimationFrame(loop);
    };
    const onScroll = () => {
      const y = window.scrollY;
      boost = Math.min(boost + Math.abs(y - lastY) * 0.02, 5);
      lastY = y;
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(track);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Two identical halves so translateX(-50%) loops seamlessly; each half repeats the list twice.
  const half = [...items, ...items];

  return (
    <div className="group/row overflow-hidden py-2 motion-reduce:overflow-x-auto">
      <div
        ref={trackRef}
        className={`flex w-max gap-3 [--marquee-duration:70s] group-focus-within/row:[animation-play-state:paused] group-hover/row:[animation-play-state:paused] motion-reduce:animate-none ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        } ${paused ? "[animation-play-state:paused]" : ""}`}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex gap-3"
            aria-hidden={copy === 1 || !interactive ? true : undefined}
          >
            {half.map((s, i) => {
              const primary = interactive && copy === 0 && i < items.length;
              return (
                <li key={`${s.id}-${i}`}>
                  <StreamerChip
                    streamer={s}
                    followed={following.includes(s.id)}
                    onToggle={onToggle}
                    focusable={primary}
                  />
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}

function StreamerChip({
  streamer,
  followed,
  onToggle,
  focusable,
}: {
  streamer: Streamer;
  followed: boolean;
  onToggle: (id: string) => void;
  focusable: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(streamer.id)}
      aria-pressed={followed}
      tabIndex={focusable ? 0 : -1}
      className="group/chip flex w-[17.5rem] items-center gap-3 rounded-[22px] border border-border bg-bg p-2 pr-3 text-left shadow-[0_1px_2px_rgb(1_8_43/0.04),0_8px_24px_-12px_rgb(1_8_43/0.12)] transition-[transform,border-color,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 aria-pressed:border-royal/40 aria-pressed:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-royal)_14%,transparent),0_10px_28px_-12px_rgb(1_8_43/0.2)]"
    >
      <span className="relative shrink-0">
        <span className="block size-14 overflow-hidden rounded-[16px] bg-bg-subtle shadow-[inset_0_0_0_1px_rgb(1_8_43/0.06)]">
          <Image
            src={streamer.avatar}
            alt=""
            width={56}
            height={56}
            className="size-full object-cover"
          />
        </span>
        <span
          className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-md ring-2 ring-bg"
          style={{ backgroundColor: platforms[streamer.platform].color }}
        >
          <PlatformIcon
            platform={streamer.platform}
            className={`size-3 ${streamer.platform === "kick" ? "text-black" : "text-white"}`}
          />
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate font-semibold text-fg">{streamer.name}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-live/10 px-1.5 py-px text-[10px] font-semibold tracking-wide text-live-ink">
            <span className="size-1.5 animate-live rounded-full bg-live" aria-hidden="true" />
            LIVE
          </span>
        </span>
        <span className="mt-0.5 block truncate font-mono text-[11px] text-fg-muted">
          {streamer.rate}
        </span>
        <span className="sr-only">on {platforms[streamer.platform].title}</span>
      </span>
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-fg-muted transition-colors duration-300 group-aria-pressed/chip:border-royal group-aria-pressed/chip:bg-royal group-aria-pressed/chip:text-white"
      >
        <svg
          viewBox="0 0 16 16"
          className="size-3.5 group-aria-pressed/chip:hidden"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M8 3v10M3 8h10" strokeLinecap="round" />
        </svg>
        <svg
          viewBox="0 0 16 16"
          className="hidden size-3.5 group-aria-pressed/chip:block"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="sr-only">{followed ? ", following" : ", follow"}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Live feed: a working preview of the Clippable app                  */
/* ------------------------------------------------------------------ */

function LiveFeed({ following }: { following: string[] }) {
  const [cards, setCards] = useState<ClipCard[]>(() =>
    DEFAULT_FOLLOWING.map((id, i) => makeCard(-(i + 1), id, i + 11)),
  );
  const [toast, setToast] = useState<{ key: number; streamerId: string; length: string } | null>(
    null,
  );
  const [counts, setCounts] = useState<Record<string, number>>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const followingRef = useRef(following);
  const nextKey = useRef(1);
  const cursor = useRef(0);

  useEffect(() => {
    followingRef.current = following;
  }, [following]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const toastTimers = new Set<number>();

    const spawn = () => {
      const list = followingRef.current;
      if (list.length === 0) return;
      const streamerId = list[cursor.current++ % list.length];
      const card = makeCard(nextKey.current++, streamerId);
      setCards((cur) => [card, ...cur].slice(0, MAX_CARDS));
      // The card finishes clipping ~2.6s after it appears; announce it then.
      const t = window.setTimeout(() => {
        toastTimers.delete(t);
        setToast({ key: card.key, streamerId, length: card.length });
        setCounts((c) => ({ ...c, [streamerId]: (c[streamerId] ?? 0) + 1 }));
      }, 2600);
      toastTimers.add(t);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        window.clearInterval(timer);
        if (e.isIntersecting) {
          spawn();
          timer = window.setInterval(spawn, NEW_CLIP_EVERY_MS);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
      toastTimers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Cards from streamers you unfollow drop out of the feed.
  const visibleCards = cards.filter((c) => following.includes(c.streamerId));
  const toastStreamer = toast ? byId.get(toast.streamerId) : undefined;

  return (
    <div ref={rootRef} className="mx-auto mt-14 max-w-6xl px-5 sm:px-8">
      <div className="relative overflow-hidden rounded-[28px] border border-border bg-bg shadow-[0_1px_2px_rgb(1_8_43/0.04),0_40px_80px_-40px_rgb(1_8_43/0.35)]">
        {/* Window bar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </div>
          <p className="font-mono text-xs text-fg-muted">Clippable · Live clips</p>
          <p className="flex items-center gap-1.5 font-mono text-xs text-fg-muted">
            <span className="size-1.5 animate-live rounded-full bg-live" aria-hidden="true" />
            <span className="hidden sm:inline">Watching</span> {following.length}
          </p>
        </div>

        <div className="grid lg:grid-cols-[15rem_1fr]">
          {/* Following */}
          <aside className="border-b border-border p-4 lg:border-r lg:border-b-0 lg:p-5">
            <h3 className="eyebrow text-fg-muted">Following</h3>
            {following.length === 0 ? (
              <p className="mt-3 text-sm text-fg-muted">
                Follow a streamer above to start your feed.
              </p>
            ) : (
              <ul className="mt-3 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                {following.map((id) => {
                  const s = byId.get(id);
                  if (!s) return null;
                  return (
                    <li
                      key={id}
                      className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border px-2 py-1.5 lg:border-0 lg:px-0"
                    >
                      <Image
                        src={s.avatar}
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 rounded-[9px] object-cover"
                      />
                      <span className="text-sm font-medium text-fg">{s.name}</span>
                      <span className="ml-auto hidden font-mono text-xs text-fg-muted tabular-nums lg:inline">
                        {counts[id] ? `${counts[id]} new` : "live"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          {/* Feed */}
          <div className="p-4 lg:p-5">
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold tracking-tight text-fg">Clips, as they happen</h3>
              <p className="text-xs text-fg-muted">Live preview · example clips</p>
            </div>
            {visibleCards.length === 0 ? (
              <div className="mt-4 flex aspect-[16/5] items-center justify-center rounded-2xl border border-dashed border-border text-sm text-fg-muted">
                Your clips land here the moment they&apos;re cut.
              </div>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {visibleCards.slice(0, 4).map((card) => (
                  <li key={card.key}>
                    <FeedCard card={card} fresh={card.key > 0} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Toast */}
        <div
          aria-hidden="true"
          data-show={toast ? "true" : "false"}
          className="pointer-events-none absolute bottom-4 left-1/2 flex w-max -translate-x-1/2 translate-y-2 items-center gap-2.5 rounded-full border border-border bg-bg py-1.5 pr-4 pl-1.5 opacity-0 shadow-[0_12px_32px_-12px_rgb(1_8_43/0.35)] transition-all duration-500 ease-out-expo data-[show=true]:translate-y-0 data-[show=true]:opacity-100 sm:top-14 sm:right-5 sm:bottom-auto sm:left-auto sm:translate-x-0"
        >
          {toastStreamer && (
            <>
              <span className="flex size-7 items-center justify-center rounded-full bg-success text-white">
                <svg
                  viewBox="0 0 16 16"
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                >
                  <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-sm font-medium text-fg">
                Clip ready{" "}
                <span className="text-fg-muted">
                  · {toastStreamer.name} · {toast?.length}
                </span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const PHASES = ["Moment found", "Trimming", "Captioning", "Scoring"] as const;

function FeedCard({ card, fresh }: { card: ClipCard; fresh: boolean }) {
  const s = byId.get(card.streamerId);
  const [phase, setPhase] = useState(fresh ? 0 : PHASES.length);

  useEffect(() => {
    if (!fresh) return;
    const timers = PHASES.map((_, i) => window.setTimeout(() => setPhase(i + 1), 650 * (i + 1)));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [fresh]);

  if (!s) return null;
  const ready = phase >= PHASES.length;

  return (
    <article
      className={`group/card relative aspect-[3/4] overflow-hidden rounded-2xl bg-midnight ${
        fresh ? "animate-[card-in_600ms_var(--ease-out-expo)_both]" : ""
      }`}
    >
      {/* Blurred avatar as the clip backdrop */}
      <Image
        src={s.avatar}
        alt=""
        fill
        sizes="200px"
        className="scale-150 object-cover opacity-70 blur-2xl"
      />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgb(53_116_239/0.55),rgb(1_8_43/0.85))]" />

      <div className="absolute inset-x-3 top-3 flex items-center justify-between font-mono text-[11px] text-white">
        <span className="rounded-full bg-black/30 px-2 py-0.5 backdrop-blur">{card.length}</span>
        <span className="rounded-full bg-black/30 px-2 py-0.5 backdrop-blur">★ {card.score}</span>
      </div>

      <div className="absolute inset-x-0 top-[18%] flex flex-col items-center gap-2.5 sm:top-[22%] sm:gap-3">
        <Image
          src={s.avatar}
          alt=""
          width={56}
          height={56}
          className="size-12 rounded-[14px] object-cover shadow-[0_8px_24px_-8px_rgb(0_0_0/0.6)] ring-2 ring-white/80 sm:size-14 sm:rounded-[16px]"
        />
        {/* Waveform: animates while the clip is being cut */}
        <div className="flex h-5 items-end gap-[3px] sm:h-6" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-white/80"
              style={{
                height: `${30 + ((i * 37) % 70)}%`,
                animation: ready ? "none" : `wave 900ms ${i * 60}ms ease-in-out infinite alternate`,
                opacity: ready ? 0.45 : 1,
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-3 bottom-3">
        <p className="truncate text-sm font-semibold text-white">{s.name}</p>
        {ready ? (
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-white/90">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              Ready<span className="hidden sm:inline"> to post</span>
            </span>
            <span
              aria-hidden="true"
              className="inline-flex h-7 items-center gap-1 rounded-full bg-white px-2.5 text-xs font-semibold text-ink"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Get
            </span>
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-xs text-white/85">{PHASES[Math.min(phase, PHASES.length - 1)]}…</p>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-sky transition-[width] duration-700 ease-out"
                style={{ width: `${(phase / PHASES.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
