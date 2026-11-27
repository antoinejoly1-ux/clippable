"use client";

import { useEffect } from "react";

/**
 * Elastic end of page. Pull past the bottom (wheel or touch) and the page lifts a little with
 * rising resistance, showing a touch more of the footer sky. Let go and it springs back. Writes --pull (px) on <html>; CSS does the rest.
 */
export function BottomSpring() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const MAX = 90;
    let pull = 0;
    let vel = 0;
    let raf = 0;
    let release = 0;
    let touchY: number | null = null;

    const atBottom = () => window.innerHeight + window.scrollY >= root.scrollHeight - 2;
    const write = () => {
      root.style.setProperty("--pull", pull.toFixed(2));
      root.dataset.pulling = pull > 0.5 ? "true" : "false";
    };
    // Rubber band: each extra pixel moves the page less the further it's already pulled.
    const stretch = (delta: number) => {
      pull = Math.min(MAX, Math.max(0, pull + delta * 0.45 * (1 - pull / MAX)));
      write();
    };
    // Critically damped spring back to 0.
    const settle = () => {
      cancelAnimationFrame(raf);
      let last = performance.now();
      const step = (now: number) => {
        const dt = Math.min(0.032, (now - last) / 1000);
        last = now;
        const k = 210;
        const c = 2 * Math.sqrt(k);
        vel += (-k * pull - c * vel) * dt;
        pull = Math.max(0, pull + vel * dt);
        write();
        if (pull > 0.2 || Math.abs(vel) > 1) raf = requestAnimationFrame(step);
        else {
          pull = 0;
          vel = 0;
          write();
        }
      };
      raf = requestAnimationFrame(step);
    };
    const scheduleRelease = () => {
      window.clearTimeout(release);
      release = window.setTimeout(settle, 140);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && atBottom()) {
        cancelAnimationFrame(raf);
        vel = 0;
        stretch(e.deltaY);
        scheduleRelease();
      } else if (pull > 0 && e.deltaY < 0) {
        stretch(e.deltaY * 1.6);
        scheduleRelease();
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      const y = e.touches[0].clientY;
      const dy = touchY - y;
      touchY = y;
      if ((dy > 0 && atBottom()) || pull > 0) {
        cancelAnimationFrame(raf);
        vel = 0;
        stretch(dy);
      }
    };
    const onTouchEnd = () => {
      touchY = null;
      if (pull > 0) settle();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.clearTimeout(release);
      cancelAnimationFrame(raf);
      root.style.removeProperty("--pull");
    };
  }, []);
  return null;
}
