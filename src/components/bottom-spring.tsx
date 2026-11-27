"use client";

import { useEffect } from "react";

/**
 * Elastic end of page, iOS-style. Pulling past the bottom (wheel, trackpad or touch) lifts
 * the page with rubber-band resistance, and a spring is always pulling it back: no waiting
 * for the gesture to end, so trackpad momentum can't hold it up. It snaps home in ~0.4s with
 * a small, lively overshoot. Writes --pull (px) on <html>; CSS lifts the page by it.
 */
export function BottomSpring() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const MAX = 110;
    const K = 420; // stiffness: how hard it pulls home
    const C = 2 * 0.72 * Math.sqrt(K); // damping ratio 0.72: one quick, small overshoot
    let pull = 0;
    let vel = 0;
    let raf = 0;
    let last = 0;
    let holding = false; // a finger is down and dragging

    const atBottom = () => window.innerHeight + window.scrollY >= root.scrollHeight - 2;
    const write = () => {
      root.style.setProperty("--pull", pull.toFixed(2));
      const on = Math.abs(pull) > 0.3 ? "true" : "false";
      if (root.dataset.pulling !== on) root.dataset.pulling = on;
    };
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      if (!holding) {
        vel += (-K * pull - C * vel) * dt;
        pull += vel * dt;
      }
      write();
      if (holding || Math.abs(pull) > 0.2 || Math.abs(vel) > 2) raf = requestAnimationFrame(step);
      else {
        pull = vel = 0;
        raf = 0;
        write();
      }
    };
    const run = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };
    // Rubber band: the further it's pulled, the less each input moves it.
    const push = (delta: number) => {
      const r = 1 - Math.min(1, Math.max(0, pull) / MAX);
      pull = Math.min(MAX, pull + delta * 0.9 * r * r);
      run();
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && atBottom()) push(e.deltaY);
    };
    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      const y = e.touches[0].clientY;
      const dy = touchY - y;
      touchY = y;
      if (dy > 0 && atBottom()) {
        holding = true;
        vel = 0;
        push(dy * 1.4);
      } else if (holding) {
        pull = Math.max(0, pull + dy);
        if (pull === 0) holding = false;
      }
    };
    const onTouchEnd = () => {
      touchY = null;
      holding = false;
      run();
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
      cancelAnimationFrame(raf);
      root.style.removeProperty("--pull");
    };
  }, []);
  return null;
}
