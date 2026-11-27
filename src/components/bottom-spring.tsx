"use client";

import { useEffect } from "react";

/*
 * Elastic end of page, modelled on iOS overscroll.
 *
 * - While you pull (wheel, trackpad or finger) the page follows the input directly, through
 *   Apple's rubber-band curve: easy at first, stiffer the further you go, never past MAX.
 * - The moment the gesture ends (input stops, or trackpad momentum starts decaying), a
 *   spring takes over. Its pull is proportional to the stretch, so the further you pulled,
 *   the faster it snaps back, with one small settle.
 * - Rendering is one rAF loop writing a transform straight onto the page and footer. No
 *   layout reads on input (the scroll limit is cached), no global CSS variables.
 */
const MAX = 160; // the most the page can lift, in px
const RUBBER = 0.55; // Apple's rubber-band constant
const K = 260; // spring stiffness on release
const ZETA = 0.78; // damping ratio: <1 gives one small, quick settle
const FOLLOW = 0.45; // per-frame smoothing while pulling, so mouse wheel steps glide

const rubber = (x: number) => (1 - 1 / ((x * RUBBER) / MAX + 1)) * MAX;
const unrubber = (y: number) => (MAX / RUBBER) * (1 / (1 - Math.min(y, MAX - 0.01) / MAX) - 1);

export function BottomSpring() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".page-lift"));
    if (!targets.length) return;

    let limit = 0; // max scrollY, cached
    const measure = () => {
      limit = document.documentElement.scrollHeight - window.innerHeight;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    // Lenis knows the scroll position without a layout read; fall back to the window.
    const lenis = () =>
      (window as unknown as { __lenis?: { scroll: number; limit: number } }).__lenis;
    const atBottom = () => {
      const l = lenis();
      return l ? l.scroll >= l.limit - 2 : window.scrollY >= limit - 2;
    };

    let raw = 0; // accumulated overscroll input, px
    let pull = 0; // what's on screen, px
    let vel = 0;
    let mode: "idle" | "pull" | "spring" = "idle";
    let raf = 0;
    let last = 0;
    let lastInput = 0;
    let lastDelta = 0;
    let decays = 0;
    let lockout = 0; // ignore trackpad momentum after a release

    const paint = () => {
      const t = pull > 0.05 ? `translate3d(0, ${(-pull).toFixed(2)}px, 0)` : "";
      for (const el of targets) el.style.transform = t;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
      last = now;
      if (mode === "pull") {
        const target = rubber(raw);
        const prev = pull;
        pull += (target - pull) * (1 - Math.pow(1 - FOLLOW, dt * 60));
        vel = (pull - prev) / dt;
        // The gesture has ended when input stops for a moment.
        if (now - lastInput > 90) release(now);
      } else if (mode === "spring") {
        const c = 2 * ZETA * Math.sqrt(K);
        vel += (-K * pull - c * vel) * dt;
        pull += vel * dt;
        if (Math.abs(pull) < 0.15 && Math.abs(vel) < 4) {
          pull = vel = raw = 0;
          mode = "idle";
        }
      }
      paint();
      raf = mode === "idle" ? 0 : requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const release = (now: number) => {
      mode = "spring";
      raw = 0;
      lockout = now + 260;
      decays = 0;
    };

    const input = (delta: number, now: number) => {
      if (mode === "spring") {
        if (now < lockout) return; // momentum tail of the gesture just released
        raw = unrubber(Math.max(0, pull)); // a new pull grabs the page mid-spring
        vel = 0;
      }
      mode = "pull";
      raw = Math.max(0, raw + delta);
      lastInput = now;
      start();
    };

    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      if (mode === "idle" && (d <= 0 || !atBottom())) return;
      if (mode === "pull") {
        // Trackpad momentum: deltas shrinking event after event means the finger has lifted.
        decays = Math.abs(d) < Math.abs(lastDelta) * 0.92 && Math.abs(d) < 60 ? decays + 1 : 0;
        lastDelta = d;
        if (decays >= 3) {
          release(now);
          return;
        }
      } else lastDelta = d;
      input(d, now);
    };

    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      const y = e.touches[0].clientY;
      const d = touchY - y;
      touchY = y;
      if (mode === "idle" && (d <= 0 || !atBottom())) return;
      lockout = 0;
      input(d, performance.now() + 1e6); // fingers never time out; touchend releases
    };
    const onTouchEnd = () => {
      touchY = null;
      if (mode === "pull") release(performance.now());
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      cancelAnimationFrame(raf);
      for (const el of targets) el.style.transform = "";
    };
  }, []);
  return null;
}
