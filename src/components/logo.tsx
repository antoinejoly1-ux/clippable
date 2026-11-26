import type { SVGProps } from "react";

/**
 * Clippable camera-clip mark, vectorised from the supplied 200px icon.
 * Inherits colour via `currentColor`. Swap the path for the official
 * vector file once the client provides it.
 */
const MARK_PATH =
  "m529 404-64 9-16 3-15 4-12 4q-6 1-10 4l-10 4q-6 1-10 4l-9 4-9 4-8 4-7 4-8 4-6 4-6 3-8 6-7 4a352 352 0 0 0-93 90l-4 5-3 4-3 6-5 7-4 6-4 5q-1 5-5 9l-3 6-3 7-5 9-4 8q-3 5-4 9l-4 10-5 12-3 10-4 12-4 17-6 24-4 25a462 462 0 0 0 18 172l4 11 4 10 4 10 4 10 4 8 3 7q3 3 5 8l4 7 4 7 5 9 19 27 20 25a652 652 0 0 0 72 63l5 4 7 4 6 4 6 4 9 5 5 2 9 5 10 4 7 4q5 3 9 4l10 4 12 4 11 4 14 4 16 4 24 5 23 3c10 2 407 1 418-1l44-7 15-4 14-4 12-4 11-4 9-4 12-4 8-4 6-4 8-4 9-5 7-3 6-4 6-4 6-4 8-5 6-4c29-24 36-29 36-31q0-4-16-12l-6-4-6-4-8-4-6-4-8-4-5-4-9-5-7-4-7-4-7-4-6-3-7-4-6-3-7-4-8-5-7-4-6-4-7-4-7-4-7-4-7-4-10-6-7-3-5 2-9 3-8 4-15 4-17 4c-16 4-19 4-202 4a1132 1132 0 0 1-221-8l-16-5-8-3a202 202 0 0 1-106-99l-4-8-4-10-4-11q-1-7-4-13a235 235 0 0 1 8-126l4-10 4-7 4-7 4-8 5-7a221 221 0 0 1 98-79q7 0 11-4l15-3 16-4c18-5 376-5 394 0l17 4q8 0 15 4l12 4 8 4q7 5 13 1 2-3 7-5 3-1 8-5l6-3 6-3 8-5 6-4 8-4 8-5 6-3 6-3 9-5 6-4 5-4 9-5 6-3 7-4 7-4 6-3 8-5 8-5 6-3 6-3 10-6q10-5 10-10 2 0-10-10l-9-7a169 169 0 0 0-32-24l-8-4-6-4-6-4-9-5-6-3-7-4-10-5q-5-1-9-4l-8-3-10-4-12-4-12-4-15-4-17-4c-5-2-32-6-58-8zm908 81-5 3-7 4-7 4-7 4-29 17-6 3-6 3-9 5-5 4-6 4-9 5-6 3-6 3-8 5-8 4-6 4-7 4-7 4-8 5-6 3-6 3-9 5-5 4-7 4-8 4-6 4-8 5-6 3-6 3-8 5-7 4-7 4-8 5-6 3-6 3-9 5-5 4-7 4-8 4-5 4-9 5-7 4-7 4-7 4-6 3-8 4-8 6-3 4v110c0 126-1 115 9 120l8 4 7 4 7 4 5 4 9 5 7 4 6 3 7 4 7 4 6 3 7 4 9 5 5 4 8 4 7 4 7 4 7 4 5 4 9 5 7 4 6 3 6 3 7 4 8 5 6 4 8 4 7 4 7 4 7 4 6 4 8 4 6 4 7 4 8 5 7 4 6 3 7 4 7 4 6 4 8 4 6 4 8 4 7 4 7 4 7 4 5 4 9 5 7 3 6 4q8 6 11 3c2-2 2-635 0-637q-3-3-10 3";

export function LogoMark({
  title = "Clippable",
  ...props
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg viewBox="152 403 1296 794" fill="currentColor" role="img" aria-label={title} {...props}>
      <path fillRule="evenodd" d={MARK_PATH} />
    </svg>
  );
}

/** Mark + wordmark lockup. Wordmark is live text until the official vector wordmark is supplied. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark aria-hidden="true" title="" className="h-[0.9em] w-auto" />
      <span className="font-semibold tracking-tight">Clippable</span>
    </span>
  );
}
