import { StreamerPicker } from "@/components/streamers/streamer-picker";

export function StreamerSection() {
  return (
    <section
      id="streamers"
      aria-labelledby="streamers-title"
      className="relative scroll-mt-20 bg-bg-subtle py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="eyebrow text-royal">Pick your streamers</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <h2
            id="streamers-title"
            className="max-w-[18ch] text-[clamp(2rem,4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-fg"
          >
            Follow your favorite streamers.{" "}
            <span className="text-gradient">Get every clip, live.</span>
          </h2>
          <p className="max-w-[46ch] text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
            Choose from streamer campaigns on Kick and Twitch. Clippable clips each one while
            they&apos;re live and drops every moment straight into your feed, trimmed, captioned and
            scored.
          </p>
        </div>
      </div>
      <div className="mt-12">
        <StreamerPicker />
      </div>
    </section>
  );
}
