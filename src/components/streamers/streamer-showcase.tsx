"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PlatformIcon, platforms } from "@/components/platform-icons";
import { streamers } from "@/lib/streamers";

const CYCLE_MS = 2000;

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
        timer = window.setInterval(() => {
          if (!document.hidden) setActive((i) => (i + 1) % streamers.length);
        }, CYCLE_MS);
      }
    });
    io.observe(root);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [hovering]);

  /* Each side swaps with a blur as the active streamer changes. */
  const swap = (on: boolean) =>
    `transition-[opacity,filter,transform] duration-700 ease-out-expo ${
      on ? "blur-none scale-100 opacity-100" : "scale-[1.04] opacity-0 blur-xl"
    }`;

  // Left: the streamer's photo, nothing on top of it.
  const photoSide = (
    <div aria-hidden="true" className="relative hidden h-[40rem] lg:block">
      <div className="absolute top-[4%] right-[4%] aspect-[3/4] w-[82%] overflow-hidden rounded-[14px] bg-midnight shadow-[0_30px_60px_-30px_rgb(1_8_43/0.55)]">
        {streamers.map((st, s) => (
          <div key={st.id} className={`absolute inset-0 ${swap(s === active)}`}>
            <Image
              src={st.photo}
              alt=""
              fill
              sizes="(min-width: 1024px) 22vw, 1px"
              className="object-cover object-[50%_25%]"
            />
          </div>
        ))}
      </div>
    </div>
  );

  // Right: a second photo, full-bleed. Falls back to the channel banner, then a blurred avatar.
  const secondSide = (
    <div aria-hidden="true" className="relative hidden h-[40rem] lg:block">
      <div className="absolute bottom-[4%] left-[4%] aspect-[4/5] w-[78%] overflow-hidden rounded-[14px] bg-midnight shadow-[0_30px_60px_-30px_rgb(1_8_43/0.45)]">
        {streamers.map((st, s) => {
          const src = st.photo2 ?? st.banner;
          return (
            <div key={st.id} className={`absolute inset-0 ${swap(s === active)}`}>
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
                setActive(i);
              }}
              className={`flex cursor-default items-center text-[clamp(2.4rem,5.4vw,4.75rem)] leading-[1.06] font-semibold tracking-[-0.045em] transition-colors duration-500 ${
                on ? "text-fg" : "text-fg-subtle"
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
              <span className="sr-only">
                , on {platforms[s.platform].title}, {s.rate}
              </span>
            </li>
          );
        })}
      </ul>
      {secondSide}
      <p aria-hidden="true" className="-mt-4 text-center text-sm text-fg-muted lg:col-start-2">
        <span className="font-medium text-fg">{streamers[active].name}</span> ·{" "}
        {streamers[active].rate}
      </p>
    </div>
  );
}
