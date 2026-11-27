import { StreamerSelect } from "@/components/streamers/streamer-select";

export function StreamerSection() {
  return (
    <section
      id="streamers"
      aria-labelledby="streamers-title"
      className="relative scroll-mt-16 border-t border-border bg-bg py-28 sm:py-40"
    >
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-10">
        <p className="eyebrow text-royal">Pick your streamers</p>
        <h2
          id="streamers-title"
          className="mx-auto mt-5 max-w-[14ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance text-fg"
        >
          Choose who you clip.
        </h2>
        <p className="mx-auto mt-6 max-w-[46ch] text-lg leading-relaxed text-pretty text-fg-muted">
          Follow streamers on Kick and Twitch. The moment they go live, Clippable clips them and
          sends every clip straight to you.
        </p>
      </div>
      <StreamerSelect />
    </section>
  );
}
