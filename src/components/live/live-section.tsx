import { ClipPipeline } from "@/components/live/clip-pipeline";

export function LiveSection() {
  return (
    <section
      data-pause-offscreen
      id="live"
      aria-labelledby="live-title"
      className="relative scroll-mt-16 bg-bg py-24 sm:py-32"
    >
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-10">
        <h2
          id="live-title"
          className="mx-auto text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance text-fg"
        >
          Build repeatable workflows.
        </h2>
      </div>
      <div className="mt-12 sm:mt-16">
        <ClipPipeline />
      </div>
    </section>
  );
}
