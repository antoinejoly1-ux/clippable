import Image from "next/image";
import { Button } from "@/components/button";
import { site } from "@/lib/site";
import { streamers } from "@/lib/streamers";

const mail = (subject: string) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

/* Interim: both paths email us until the signup form ships. TODO(client): point at signup. */
const paths = [
  {
    id: "clippers",
    eyebrow: "For clippers",
    title: "Get paid for every view.",
    body: "Pick a streamer campaign, post the clips Clippable makes, and earn on every 1,000 views.",
    stat: "$0.10–$0.75",
    statLabel: "per 1,000 views on current campaigns",
    cta: "Start clipping",
    href: mail("Clippable early access: I clip"),
    variant: "primary" as const,
  },
  {
    id: "streamers",
    eyebrow: "For streamers",
    title: "Get clipped everywhere.",
    body: "Set your rate. Clippers post your best moments to TikTok, Shorts, Reels and X while you stream.",
    stat: "Kick + Twitch",
    statLabel: "streams supported at launch",
    cta: "Get clipped",
    href: mail("Clippable early access: I stream"),
    variant: "dark" as const,
  },
];

export function AudienceSection() {
  return (
    <section id="paths" aria-labelledby="paths-title" className="scroll-mt-20 bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        <h2
          id="paths-title"
          className="text-center text-[clamp(2rem,4vw,3.25rem)] leading-[1] font-medium tracking-[-0.045em] text-fg"
        >
          Two ways in.
        </h2>
        <ul className="mt-12 grid gap-3 sm:mt-14 md:grid-cols-2">
          {paths.map((p) => (
            <li
              key={p.id}
              className="flex flex-col rounded-[var(--radius-card)] border border-border bg-bg-subtle p-6 sm:p-10"
            >
              <p className="eyebrow text-fg-muted">{p.eyebrow}</p>
              <h3 className="mt-4 text-[clamp(1.6rem,2.6vw,2.25rem)] leading-[1.05] font-medium tracking-[-0.04em] text-fg">
                {p.title}
              </h3>
              <p className="mt-3 max-w-[52ch] text-base text-pretty text-fg-muted">{p.body}</p>
              <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
                {p.id === "streamers" && (
                  <span aria-hidden="true" className="flex -space-x-2">
                    {streamers.slice(0, 4).map((st) => (
                      <Image
                        key={st.id}
                        src={st.avatar}
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 rounded-full object-cover ring-2 ring-bg-subtle"
                      />
                    ))}
                  </span>
                )}
                <p className="text-sm leading-snug text-fg-muted">
                  <span className="block text-lg font-semibold tracking-[-0.02em] text-fg">
                    {p.stat}
                  </span>
                  {p.statLabel}
                </p>
              </div>
              <div className="mt-8">
                <Button href={p.href} variant={p.variant}>
                  {p.cta}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
