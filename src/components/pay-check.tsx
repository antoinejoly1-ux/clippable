/**
 * Apple Pay-style completion mark. Toggle `data-done` on the wrapper (or pass `done`)
 * and the ring draws, the disc fills and the tick strokes in. Styles live in globals.css.
 */
export function PayCheck({ done, className }: { done?: boolean; className?: string }) {
  return (
    <span data-done={done ? "true" : "false"} className={`pay-check block ${className ?? ""}`}>
      <svg viewBox="0 0 64 64" className="size-full overflow-visible" aria-hidden="true">
        <circle className="halo" cx="32" cy="32" r="30" />
        <circle className="fill" cx="32" cy="32" r="30" />
        <circle className="ring" cx="32" cy="32" r="30" pathLength={1} />
        <path className="tick" d="M20 33.5 28 41.5 45 24" pathLength={1} />
      </svg>
    </span>
  );
}
