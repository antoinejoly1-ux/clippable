import { LiveClipping } from "@/components/live/live-clipping";

export function LiveSection() {
  return (
    <section
      id="live"
      aria-labelledby="live-title"
      className="relative scroll-mt-16 border-t border-border bg-bg py-24 sm:py-36"
    >
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-10">
        <h2
          id="live-title"
          className="mx-auto max-w-[16ch] text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance text-fg"
        >
          Automatic clips from <span className="text-fg-muted">every live stream.</span>
        </h2>
      </div>
      <div className="mt-14 sm:mt-20">
        <LiveClipping />
      </div>
    </section>
  );
}
