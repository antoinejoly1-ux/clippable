import Image from "next/image";
import { CampaignFan } from "@/components/audience/campaign-fan";
import { Button } from "@/components/button";
import { site } from "@/lib/site";

/*
 * Clipping campaigns: one premium blue banner. Left, the pitch and a live count; right, a
 * fan of campaign posters hanging off the banner's edge, spreading on hover.
 * TODO(client): real campaign names, counts and rates; confirm GTA VI key art licensing.
 */
const AVAILABLE = 12;

const campaigns = [
  {
    id: "gta",
    title: "GTA VI",
    tag: "Game launch",
    rate: "$0.60",
    image: "/media/campaigns-gta6.webp",
  },
  {
    id: "kaicenat",
    title: "Kai Cenat",
    tag: "Streamer",
    rate: "$0.50",
    image: "/media/streamers/kaicenat-photo.webp",
  },
  {
    id: "n3on",
    title: "N3on",
    tag: "Streamer",
    rate: "$0.40",
    image: "/media/streamers/n3on-photo.webp",
  },
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
          <div aria-hidden="true" className="night-lift -z-10" />

          {/* Pitch */}
          <div className="relative z-10 flex flex-col p-8 sm:p-12 lg:max-w-[50%] lg:py-16 lg:pl-16">
            <p className="inline-flex w-fit items-center gap-2.5 rounded-full bg-white/12 py-2 pr-4 pl-3 text-base font-semibold ring-1 ring-white/25 backdrop-blur-md">
              <span className="relative flex size-2.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-75" />
                <span className="relative size-2.5 rounded-full bg-success shadow-[0_0_12px_rgb(18_161_80/0.9)]" />
              </span>
              <span>
                <span className="tabular-nums">{AVAILABLE}</span> campaigns live
              </span>
            </p>
            <h3 className="mt-7 max-w-[14ch] text-[clamp(2.4rem,4.4vw,4rem)] leading-[1] font-medium tracking-[-0.045em]">
              Get paid for every 1,000 views.
            </h3>
            <p className="mt-5 max-w-[38ch] text-xl text-pretty text-white/90">
              Pick a campaign, post the clips Clippable makes for you, earn on every view.
            </p>
            <div className="mt-8">
              <Button href={site.signupUrl} variant="inverse" size="lg">
                Browse campaigns
              </Button>
            </div>
          </div>

          {/* Fan of posters, hanging off the right edge */}
          <CampaignFan className="campaign-fan relative h-[20rem] sm:h-[24rem] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[54%]">
            {campaigns.map((c, i) => (
              <div
                key={c.id}
                className="campaign-tile absolute aspect-[5/7] w-[12.5rem] overflow-hidden rounded-[20px] bg-midnight shadow-[0_40px_80px_-30px_rgb(0_0_0/0.75)] ring-1 ring-white/15 sm:w-[15rem] lg:w-[19rem]"
                style={{ "--i": i } as React.CSSProperties}
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 304px, (min-width: 640px) 240px, 200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.7),transparent_40%)]" />
                <div className="absolute inset-x-4 top-4 flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.06em] text-white/70 uppercase">
                      {c.tag}
                    </p>
                    <p className="mt-0.5 text-lg leading-tight font-semibold tracking-[-0.02em]">
                      {c.title}
                    </p>
                  </div>
                  <p className="ui-light rounded-[8px] bg-white px-2 py-1 text-xs font-semibold text-midnight">
                    {c.rate}
                    <span className="font-medium text-fg-muted">/1K</span>
                  </p>
                </div>
              </div>
            ))}
          </CampaignFan>
          <ul className="sr-only">
            {campaigns.map((c) => (
              <li key={c.id}>
                {c.title}, {c.tag}: {c.rate} per 1,000 views
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
