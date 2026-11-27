import Image from "next/image";
import { Button } from "@/components/button";
import { site } from "@/lib/site";

/*
 * Clipping campaigns: one premium blue card. Left, the pitch and a live count; right, a
 * fanned stack of campaign cards that spreads out on hover, hinting at what's inside.
 * TODO(client): real campaign names, counts and rates from the platform.
 */
const AVAILABLE = 12;

const campaigns = [
  {
    id: "gta",
    title: "GTA VI reactions",
    brand: "Gaming campaign",
    rate: "$0.60 / 1K views",
    image: "/media/pipeline/clip-14.webp",
    avatar: null,
  },
  {
    id: "kaicenat",
    title: "Kai Cenat",
    brand: "Streamer campaign",
    rate: "$0.50 / 1K views",
    image: "/media/streamers/kaicenat-photo.webp",
    avatar: "/media/streamers/kaicenat.webp",
  },
  {
    id: "n3on",
    title: "N3on",
    brand: "Streamer campaign",
    rate: "up to $0.40 / 1K views",
    image: "/media/streamers/n3on-photo.webp",
    avatar: "/media/streamers/n3on.webp",
  },
];

export function AudienceSection() {
  return (
    <section
      id="campaigns"
      aria-labelledby="campaigns-title"
      className="scroll-mt-20 bg-bg py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        <h2
          id="campaigns-title"
          className="text-center text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance text-fg"
        >
          <span className="block text-fg-muted">Get paid.</span>
          Join clipping campaigns.
        </h2>

        <div className="campaign-card relative isolate mt-12 grid overflow-hidden rounded-[20px] text-white sm:mt-16 sm:rounded-[28px] lg:grid-cols-[1fr_1.1fr]">
          <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 -z-10" />

          {/* Pitch */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-sm font-medium ring-1 ring-white/20 backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-70" />
                <span className="relative size-2 rounded-full bg-success" />
              </span>
              {AVAILABLE} campaigns available
            </p>
            <h3 className="mt-6 max-w-[16ch] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.04em]">
              Get paid for every 1,000 views.
            </h3>
            <p className="mt-4 max-w-[42ch] text-lg text-pretty text-white/75">
              Pick a campaign, post the clips Clippable makes for you, and earn on every view. New
              campaigns open every week.
            </p>
            <div className="mt-9">
              <Button href={site.signupUrl} variant="inverse" size="lg">
                Browse campaigns
              </Button>
            </div>
          </div>

          {/* Fanned campaign cards */}
          <div
            aria-hidden="true"
            className="campaign-stack relative h-[24rem] sm:h-[28rem] lg:h-auto lg:min-h-[34rem]"
          >
            {campaigns.map((c, i) => (
              <div
                key={c.id}
                className="campaign-tile absolute top-1/2 left-1/2 w-[13.5rem] overflow-hidden rounded-[16px] bg-white text-fg shadow-[0_30px_60px_-24px_rgb(0_0_0/0.6)] sm:w-[15rem]"
                style={{ "--i": i - 1 } as React.CSSProperties}
              >
                <div className="relative aspect-[4/5] bg-midnight">
                  <Image src={c.image} alt="" fill sizes="240px" className="object-cover" />
                  <span className="absolute top-3 left-3 rounded-[6px] bg-black/55 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                    {c.brand}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-3.5">
                  {c.avatar ? (
                    <Image
                      src={c.avatar}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-8 items-center justify-center rounded-full bg-midnight text-[11px] font-bold text-white">
                      VI
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{c.title}</span>
                    <span className="block text-xs text-fg-muted">{c.rate}</span>
                  </span>
                  <span className="rounded-[6px] bg-electric px-2 py-1 text-[11px] font-semibold text-white">
                    Join
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
