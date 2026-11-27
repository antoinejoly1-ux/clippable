"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * The campaign posters, held in place by a magnet. Hover one and it lifts a touch, in its
 * own slot (the order never changes: GTA VI in front, then Kai Cenat, then N3on). Grab it
 * and you can pull it around, against a pull that grows the further it goes; let go and
 * it springs back into its slot.
 */
const REACH = 140; // the furthest a poster can be pulled, px

export function CampaignFan({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tile: HTMLElement | null = null;
    let sx = 0;
    let sy = 0;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    // Magnetic resistance: moves freely at first, then ever more reluctantly.
    const magnet = (d: number) => Math.sign(d) * REACH * (1 - Math.exp(-Math.abs(d) / REACH));

    const paint = () => {
      raf = 0;
      if (!tile) return;
      const x = magnet(tx);
      const y = magnet(ty);
      tile.style.setProperty("--dx", `${x}px`);
      tile.style.setProperty("--dy", `${y}px`);
      tile.style.setProperty("--dr", `${x * 0.06}deg`);
    };
    const down = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>(".campaign-tile");
      if (!t || !root.contains(t)) return;
      tile = t;
      sx = e.clientX;
      sy = e.clientY;
      tx = ty = 0;
      tile.dataset.drag = "true";
      tile.setPointerCapture(e.pointerId);
      e.preventDefault();
    };
    const move = (e: PointerEvent) => {
      if (!tile) return;
      tx = e.clientX - sx;
      ty = e.clientY - sy;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const up = () => {
      if (!tile) return;
      // Releasing hands back to the CSS spring transition, which snaps it into its slot.
      tile.dataset.drag = "false";
      tile.style.setProperty("--dx", "0px");
      tile.style.setProperty("--dy", "0px");
      tile.style.setProperty("--dr", "0deg");
      tile = null;
    };
    root.addEventListener("pointerdown", down);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerup", up);
    root.addEventListener("pointercancel", up);
    return () => {
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointercancel", up);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      {children}
    </div>
  );
}
