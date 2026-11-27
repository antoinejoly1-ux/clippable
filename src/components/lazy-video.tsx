"use client";

import { useEffect, useRef } from "react";

/** Muted looping video that loads and plays only while on screen. */
export function LazyVideo({
  sources,
  poster,
  className,
}: {
  sources: { src: string; type: string }[];
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          // The poster is set here, not in the HTML: browsers fetch a poster eagerly otherwise.
          if (!v.poster && v.dataset.poster) v.poster = v.dataset.poster;
          if (reduced) return;
          v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      data-poster={poster}
      aria-hidden="true"
      className={className}
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
