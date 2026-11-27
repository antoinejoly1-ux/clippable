"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Inertial smooth scrolling (Lenis). Native scroll is kept, so sticky and scroll listeners still work.
 * Its rAF loop only runs while Lenis is scrolling, so an idle page doesn't keep the main thread awake.
 * Also pauses infinite CSS animations inside `[data-pause-offscreen]` sections while they're off screen.
 */
export function SmoothScroll() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        (e.target as HTMLElement).dataset.running = e.isIntersecting ? "true" : "false";
      }
    });
    document.querySelectorAll("[data-pause-offscreen]").forEach((el) => io.observe(el));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => io.disconnect();

    const lenis = new Lenis({ autoRaf: false, lerp: 0.09, anchors: true });
    let id = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      id = lenis.isScrolling ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!id) id = requestAnimationFrame(loop);
    };
    const events = ["wheel", "touchstart", "keydown", "click", "pointerdown"] as const;
    for (const ev of events) window.addEventListener(ev, kick, { passive: true });
    lenis.on("scroll", kick);
    kick();
    return () => {
      io.disconnect();
      cancelAnimationFrame(id);
      for (const ev of events) window.removeEventListener(ev, kick);
      lenis.destroy();
    };
  }, []);
  return null;
}
