"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PlatformIcon, platforms } from "@/components/platform-icons";
import { streamers } from "@/lib/streamers";

const CYCLE_MS = 2400;
const CLIPS = 8;

/*
 * Four floating clips: two left, two right. Each streamer gets its own set.
 * Footage is placeholder stock until real clips per streamer are supplied,
 * so it is never paired with a streamer's name or face.
 */
const slots = [
  "left-[6%] top-[4%] w-[66%] z-0",
  "right-[2%] bottom-[2%] w-[48%] z-10 shadow-[0_24px_48px_-24px_rgb(1_8_43/0.45)]",
  "right-[6%] top-[12%] w-[62%] z-0",
  "left-[0%] bottom-[0%] w-[46%] z-10 shadow-[0_24px_48px_-24px_rgb(1_8_43/0.45)]",
] as const;
const clipFor = (streamer: number, slot: number) => ((streamer * 3 + slot * 2) % CLIPS) + 1;

export function StreamerShowcase() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || hovering || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(timer);
      if (e.isIntersecting) {
        timer = window.setInterval(() => setActive((i) => (i + 1) % streamers.length), CYCLE_MS);
      }
    });
    io.observe(root);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [hovering]);

  const side = (from: number) => (
    <div aria-hidden="true" className="relative hidden h-[40rem] lg:block">
      {[from, from + 1].map((slot) => (
        <div
          key={slot}
          className={`absolute aspect-[3/4] overflow-hidden rounded-[10px] ${slots[slot]}`}
        >
          {streamers.map((_, s) => {
            const on = s === active;
            return (
              <Image
                key={s}
                src={`/media/clips/clip-${clipFor(s, slot)}.webp`}
                alt=""
                fill
                sizes="(min-width: 1024px) 18vw, 1px"
                className={`object-cover transition-[opacity,filter,transform] duration-700 ease-out-expo ${
                  on ? "blur-0 scale-100 opacity-100" : "scale-[1.04] opacity-0 blur-xl"
                }`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <div
      ref={rootRef}
      className="mx-auto grid max-w-[1680px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_minmax(0,38rem)_1fr]"
    >
      {side(0)}
      <ul
        className="flex flex-col items-center py-4 text-center"
        onMouseLeave={() => setHovering(false)}
      >
        {streamers.map((s, i) => {
          const on = i === active;
          return (
            <li
              key={s.id}
              onMouseEnter={() => {
                setHovering(true);
                setActive(i);
              }}
              className={`flex cursor-default items-center text-[clamp(2.4rem,5.4vw,4.75rem)] leading-[1.06] font-semibold tracking-[-0.045em] transition-colors duration-500 ${
                on ? "text-fg" : "text-fg-faint"
              }`}
            >
              <span
                aria-hidden="true"
                className={`relative block shrink-0 overflow-hidden rounded-[0.2em] transition-[width,margin,opacity] duration-500 ease-out-expo ${
                  on ? "mr-[0.22em] w-[0.86em] opacity-100" : "mr-0 w-0 opacity-0"
                }`}
              >
                <span className="relative block aspect-square w-[0.86em]">
                  <Image src={s.avatar} alt="" fill sizes="80px" className="object-cover" />
                </span>
              </span>
              <span>{s.name}</span>
              <span
                aria-hidden="true"
                className={`ml-[0.25em] flex size-[0.4em] items-center justify-center rounded-[0.08em] transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}
                style={{ backgroundColor: platforms[s.platform].color }}
              >
                <PlatformIcon
                  platform={s.platform}
                  className={`size-[62%] ${s.platform === "kick" ? "text-black" : "text-white"}`}
                />
              </span>
              <span className="sr-only">, on {platforms[s.platform].title}</span>
            </li>
          );
        })}
      </ul>
      {side(2)}
    </div>
  );
}
