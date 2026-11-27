"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PlatformIcon, platforms } from "@/components/platform-icons";
import { streamers } from "@/lib/streamers";

const CYCLE_MS = 1000;

export function StreamerShowcase() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(-1);
  // Track the photo being replaced, so it stays fully opaque underneath while the new one
  // fades in on top (a true crossfade, no dip to the background).
  const select = (next: number | ((i: number) => number)) =>
    setActive((cur) => {
      const n = typeof next === "function" ? next(cur) : next;
      if (n !== cur) setPrev(cur);
      return n;
    });
  const [hovering, setHovering] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || hovering || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(timer);
      if (e.isIntersecting) {
        timer = window.setInterval(() => {
          if (!document.hidden) select((i) => (i + 1) % streamers.length);
        }, CYCLE_MS);
      }
    });
    io.observe(root);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [hovering]);

  /* Incoming photo fades and settles in on top; the outgoing one holds still beneath it. */
  const n = streamers.length;
  const near = (s: number) => s === active || s === prev || s === (active + 1) % n; // only these are mounted
  const swap = (s: number) =>
    s === active
      ? "z-10 scale-100 opacity-100 transition-[opacity,scale] duration-[450ms] ease-out-expo"
      : s === prev
        ? "z-0 opacity-100"
        : "z-0 scale-[1.04] opacity-0";

  // Left: the streamer's photo, nothing on top of it.
  const photoSide = (
    <div aria-hidden="true" className="relative hidden h-[min(40rem,72svh)] lg:block">
      <div className="absolute top-[4%] right-[4%] aspect-[3/4] w-[82%] overflow-hidden rounded-[14px] bg-bg-subtle shadow-[0_30px_60px_-30px_rgb(1_8_43/0.55)]">
        {streamers.map((st, s) =>
          !near(s) ? null : (
            <div key={st.id} className={`absolute inset-0 ${swap(s)}`}>
              <Image
                src={st.photo}
                alt=""
                fill
                sizes="(min-width: 1024px) 22vw, 1px"
                className="object-cover object-[50%_25%]"
              />
            </div>
          ),
        )}
      </div>
    </div>
  );

  // Right: a second photo, full-bleed. Falls back to the channel banner, then a blurred avatar.
  const secondSide = (
    <div aria-hidden="true" className="relative hidden h-[min(40rem,72svh)] lg:block">
      <div className="absolute bottom-[4%] left-[4%] aspect-[4/5] w-[78%] overflow-hidden rounded-[14px] bg-bg-subtle shadow-[0_30px_60px_-30px_rgb(1_8_43/0.45)]">
        {streamers.map((st, s) => {
          if (!near(s)) return null;
          const src = st.photo2 ?? st.banner;
          return (
            <div key={st.id} className={`absolute inset-0 ${swap(s)}`}>
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 20vw, 1px"
                  className="object-cover object-[50%_25%]"
                />
              ) : (
                <>
                  <Image
                    src={st.avatar}
                    alt=""
                    fill
                    sizes="120px"
                    className="scale-125 object-cover opacity-60 blur-2xl"
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <Image
                      src={st.avatar}
                      alt=""
                      width={112}
                      height={112}
                      className="size-28 rounded-[22px] object-cover shadow-[0_18px_40px_-16px_rgb(0_0_0/0.6)] ring-2 ring-white/80"
                    />
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      ref={rootRef}
      className="mx-auto grid max-w-[1680px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_minmax(0,38rem)_1fr]"
    >
      {photoSide}
      <ul
        className="flex flex-col items-center py-4 text-center"
        onPointerLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
      >
        {streamers.map((s, i) => {
          const on = i === active;
          return (
            <li
              key={s.id}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                setHovering(true);
                select(i);
              }}
              className={`cursor-default text-[clamp(1.75rem,3.4vw,3.1rem)] leading-[1.06] font-semibold tracking-[-0.045em] transition-colors duration-500 ${
                on ? "text-fg" : "text-fg-subtle"
              }`}
            >
              {/* The name stays centred; avatar and platform badge hang outside it. */}
              <span className="relative inline-block">
                <span
                  aria-hidden="true"
                  className={`absolute top-1/2 right-full mr-[0.22em] block aspect-square w-[0.86em] -translate-y-1/2 overflow-hidden rounded-[0.2em] transition-[opacity,scale] duration-500 ease-out-expo ${
                    on ? "scale-100 opacity-100" : "scale-75 opacity-0"
                  }`}
                >
                  <Image src={s.avatar} alt="" fill sizes="80px" className="object-cover" />
                </span>
                {s.name}
                {s.platform && (
                  <span
                    aria-hidden="true"
                    className={`absolute top-[0.08em] left-full ml-[0.06em] flex size-[0.36em] items-center justify-center rounded-[0.08em] transition-[opacity,scale] duration-500 ease-out-expo ${
                      on ? "scale-100 opacity-100" : "scale-75 opacity-0"
                    }`}
                    style={{ backgroundColor: platforms[s.platform!].color }}
                  >
                    <PlatformIcon
                      platform={s.platform!}
                      className={`size-[62%] ${s.platform === "kick" ? "text-black" : "text-white"}`}
                    />
                  </span>
                )}
              </span>
              <span className="sr-only">
                {s.platform ? `, on ${platforms[s.platform].title}` : ""}
              </span>
            </li>
          );
        })}
        <li className="mt-6 text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.2] font-medium tracking-[-0.035em] text-fg-subtle">
          and much more.
        </li>
      </ul>
      {secondSide}
    </div>
  );
}
