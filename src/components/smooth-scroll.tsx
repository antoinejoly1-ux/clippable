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
    // The header is clear over the hero's sky and frosts once the page moves.
    const root = document.documentElement;
    // The header blends in with the scroll instead of switching:
    // --hdr (frost) eases 0 → 1 over the first 30% of a screen; --hdr-ink (type colour)
    // crosses over in the middle of that, once the frost is light enough to read ink on.
    const ease = (t: number) => t * t * (3 - 2 * t);
    let last = "";
    const onScroll = () => {
      const t = window.scrollY / (window.innerHeight * 0.3);
      const frost = ease(Math.min(1, Math.max(0, t)));
      const ink = ease(Math.min(1, Math.max(0, (t - 0.42) / 0.2)));
      const key = `${frost.toFixed(2)}|${ink.toFixed(2)}`;
      if (key !== last) {
        last = key;
        root.style.setProperty("--hdr", frost.toFixed(3));
        root.style.setProperty("--hdr-ink", ink.toFixed(3));
      }
      const on = window.scrollY > 8 ? "true" : "false";
      if (root.dataset.scrolled !== on) root.dataset.scrolled = on;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        (e.target as HTMLElement).dataset.running = e.isIntersecting ? "true" : "false";
      }
    });
    document.querySelectorAll("[data-pause-offscreen]").forEach((el) => io.observe(el));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
      };
    }

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: true });
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
    // Shared so the clip story can glide onto its key frames. Starting a glide also wakes
    // the rAF loop, which otherwise only runs while the user is scrolling.
    (window as unknown as { __lenis?: object }).__lenis = {
      scrollTo: (y: number, o: object) => {
        lenis.scrollTo(y, o);
        kick();
      },
      get isScrolling() {
        return lenis.isScrolling;
      },
    };
    kick();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(id);
      for (const ev of events) window.removeEventListener(ev, kick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: object }).__lenis;
    };
  }, []);
  return null;
}
