import { CtaButton } from "@/components/cta-button";
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
      <div className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-6 px-5 text-center">
        <p className="text-lg text-pretty text-fg-muted">
          Follow the streamers you want. The moment they go live, Clippable clips them and sends
          every clip straight to you.
        </p>
        <CtaButton href="#early-access">Start clipping</CtaButton>
      </div>
    </section>
  );
}
