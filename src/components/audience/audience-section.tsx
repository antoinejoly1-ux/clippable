import Image from "next/image";
import { Button } from "@/components/button";
import { site } from "@/lib/site";

/*
 * Clipping campaigns: one premium blue banner. Left, the pitch and a live count; right, a
 * fan of campaign posters hanging off the banner's edge, spreading on hover.
 * TODO(client): real campaign names, counts and rates; licensed GTA VI key art.
 */
const AVAILABLE = 12;

const campaigns = [
  {
    id: "n3on",
    title: "N3on",
    tag: "Streamer",
    rate: "$0.40",
    image: "/media/streamers/n3on-photo.webp",
  },
  {
    id: "kaicenat",
    title: "Kai Cenat",
    tag: "Streamer",
    rate: "$0.50",
    image: "/media/streamers/kaicenat-photo.webp",
  },
  { id: "gta", title: "GTA VI", tag: "Game launch", rate: "$0.60", image: null },
] as const;

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

        <div className="campaign-card relative isolate mt-12 overflow-hidden rounded-[20px] text-white sm:mt-16 sm:rounded-[28px]">
          <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 -z-10" />

          {/* Pitch */}
          <div className="relative z-10 flex flex-col p-8 sm:p-12 lg:max-w-[54%] lg:py-14 lg:pl-16">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium ring-1 ring-white/20 backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-70" />
                <span className="relative size-2 rounded-full bg-success" />
              </span>
              {AVAILABLE} campaigns open now
            </p>
            <h3 className="mt-6 max-w-[15ch] text-[clamp(2rem,3.4vw,3.1rem)] leading-[1.02] font-medium tracking-[-0.04em]">
              Get paid for every 1,000 views.
            </h3>
            <p className="mt-4 max-w-[40ch] text-lg text-pretty text-white/70">
              Pick a campaign, post the clips Clippable makes for you, earn on every view.
            </p>
            <div className="mt-8">
              <Button href={site.signupUrl} variant="inverse" size="lg">
                Browse campaigns
              </Button>
            </div>
          </div>

          {/* Fan of posters, hanging off the right edge */}
          <div
            aria-hidden="true"
            className="campaign-fan relative h-[19rem] sm:h-[22rem] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[52%]"
          >
            {campaigns.map((c, i) => (
              <div
                key={c.id}
                className="campaign-tile absolute aspect-[3/4] w-[11rem] overflow-hidden rounded-[18px] bg-midnight shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/15 sm:w-[13rem] lg:w-[15.5rem]"
                style={{ "--i": i } as React.CSSProperties}
              >
                {c.image ? (
                  <Image src={c.image} alt="" fill sizes="250px" className="object-cover" />
                ) : (
                  <div className="gta-poster absolute inset-0">
                    <span className="absolute inset-x-0 top-[34%] text-center text-[4.5rem] leading-none font-black tracking-[-0.06em] text-white/95 italic">
                      VI
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.75),transparent_50%)]" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.06em] text-white/70 uppercase">
                      {c.tag}
                    </p>
                    <p className="mt-0.5 text-lg leading-tight font-semibold tracking-[-0.02em]">
                      {c.title}
                    </p>
                  </div>
                  <p className="rounded-[8px] bg-white px-2 py-1 text-xs font-semibold text-midnight">
                    {c.rate}
                    <span className="font-medium text-fg-muted">/1K</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
