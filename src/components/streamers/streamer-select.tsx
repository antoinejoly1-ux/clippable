"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PayCheck } from "@/components/pay-check";
import { PlatformIcon, platforms } from "@/components/platform-icons";
import { streamers } from "@/lib/streamers";

const STEP_MS = 1100;
const HOLD_MS = 2200;

export function StreamerSelect() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [auto, setAuto] = useState(true);
  const [press, setPress] = useState(0);
  const gridRef = useRef<HTMLUListElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = useCallback((id: string) => {
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // The demo: a cursor visits each streamer in turn and follows them.
  useEffect(() => {
    const grid = gridRef.current;
    const cursor = cursorRef.current;
    if (!auto || !grid || !cursor) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Static stand-in: a few streamers already followed, no cursor.
      const t = window.setTimeout(() => {
        setSelected(new Set(streamers.slice(0, 3).map((s) => s.id)));
        setAuto(false);
      }, 0);
      return () => window.clearTimeout(t);
    }

    let index = 0;
    let timer: number | undefined;
    let running = false;

    const moveTo = (i: number) => {
      const el = itemRefs.current[i]?.querySelector<HTMLElement>("[data-icon]");
      if (!el) return;
      const g = grid.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const x = r.left - g.left + r.width * 0.62;
      const y = r.top - g.top + r.height * 0.6;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const step = () => {
      if (!running) return;
      if (index < streamers.length) {
        const i = index;
        moveTo(i);
        timer = window.setTimeout(() => {
          setPress((n) => n + 1);
          toggle(streamers[i].id);
          index += 1;
          timer = window.setTimeout(step, STEP_MS - 600);
        }, 600);
      } else {
        timer = window.setTimeout(() => {
          setSelected(new Set());
          index = 0;
          timer = window.setTimeout(step, 700);
        }, HOLD_MS);
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          cursor.style.opacity = "1";
          step();
        } else if (!e.isIntersecting && running) {
          running = false;
          window.clearTimeout(timer);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(grid);
    return () => {
      running = false;
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [auto, toggle]);

  const onUserToggle = (id: string) => {
    if (auto) {
      setAuto(false);
      setSelected(new Set([id]));
      return;
    }
    toggle(id);
  };

  const count = selected.size;

  return (
    <div className="mx-auto mt-16 max-w-6xl px-5 sm:mt-20 sm:px-10">
      <div className="relative">
        <ul
          ref={gridRef}
          className="relative grid grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-8"
        >
          {streamers.map((s, i) => {
            const on = selected.has(s.id);
            return (
              <li key={s.id} className="flex justify-center">
                <button
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onUserToggle(s.id)}
                  className="group/s flex w-full flex-col items-center gap-3 rounded-[var(--radius-card)] py-2 text-center"
                >
                  <span data-icon className="relative block">
                    <span className="block size-16 overflow-hidden rounded-[14px] bg-bg-subtle shadow-[0_1px_2px_rgb(1_8_43/0.08),0_12px_28px_-14px_rgb(1_8_43/0.4)] transition-[transform,box-shadow] duration-500 ease-out-expo group-hover/s:-translate-y-1 group-aria-pressed/s:shadow-[0_0_0_2px_var(--bg),0_0_0_4px_var(--color-royal),0_16px_32px_-14px_rgb(32_79_206/0.6)] sm:size-[5.5rem] sm:rounded-[18px]">
                      <Image
                        src={s.avatar}
                        alt=""
                        width={88}
                        height={88}
                        className="size-full object-cover grayscale-[35%] transition-[filter] duration-500 group-aria-pressed/s:grayscale-0"
                      />
                    </span>
                    <span
                      className="absolute -bottom-1 -left-1 flex size-5 items-center justify-center rounded-[5px] ring-2 ring-bg"
                      style={{ backgroundColor: platforms[s.platform].color }}
                    >
                      <PlatformIcon
                        platform={s.platform}
                        className={`size-3 ${s.platform === "kick" ? "text-black" : "text-white"}`}
                      />
                    </span>
                    <PayCheck
                      done={on}
                      className="on-light absolute -top-2.5 -right-2.5 size-7 sm:size-8"
                    />
                  </span>
                  <span className="max-w-full truncate text-sm font-medium text-fg">{s.name}</span>
                  <span className="-mt-2 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] text-fg-muted uppercase">
                    {on ? (
                      <>
                        <span
                          className="size-1.5 animate-live rounded-full bg-live"
                          aria-hidden="true"
                        />
                        Clipping
                      </>
                    ) : (
                      platforms[s.platform].title
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Demo cursor */}
        <div
          ref={cursorRef}
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 left-0 z-10 opacity-0 transition-[transform,opacity] duration-[650ms] ease-out-expo ${auto ? "" : "hidden"}`}
        >
          <span key={press} className="block animate-[cursor-click_380ms_ease-out]">
            <svg viewBox="0 0 24 24" className="size-7 drop-shadow-[0_4px_8px_rgb(1_8_43/0.35)]">
              <path
                d="M4 2.5v17.2l4.6-4.3 3 6.6 3.1-1.4-3-6.5h6.3L4 2.5Z"
                fill="#01082B"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span className="absolute -top-2 -left-2 size-8 animate-[cursor-ripple_600ms_ease-out_both] rounded-full border-2 border-royal" />
          </span>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center gap-5 text-center">
        <p className="text-fg-muted">
          <span className="font-mono text-fg tabular-nums">{count}</span>{" "}
          {count === 1 ? "streamer" : "streamers"} followed
          <span className="hidden sm:inline"> · every clip lands the second it&apos;s cut</span>
        </p>
        <a href="#early-access" className="btn btn-primary">
          Start clipping
        </a>
      </div>
    </div>
  );
}
