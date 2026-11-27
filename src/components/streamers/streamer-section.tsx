import { StreamerShowcase } from "@/components/streamers/streamer-showcase";

export function StreamerSection() {
  return (
    <section
      id="streamers"
      aria-labelledby="streamers-title"
      className="relative scroll-mt-16 border-t border-border bg-bg py-24 sm:py-32"
    >
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-10">
        <h2
          id="streamers-title"
          className="text-[clamp(1.75rem,3vw,2.75rem)] leading-tight font-medium tracking-[-0.035em] text-fg"
        >
          Clip streamers like
        </h2>
      </div>
      <div className="mt-8 sm:mt-10">
        <StreamerShowcase />
      </div>
    </section>
  );
}
