import Image from "next/image";
import { ExpandingCards } from "@/components/cards/expanding-cards";
import { PlatformIcon, platforms, type Platform } from "@/components/platform-icons";
import { streamers } from "@/lib/streamers";

const Check = ({ className }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`flex size-5 items-center justify-center rounded-full bg-electric text-white ring-2 ring-bg ${className ?? ""}`}
  >
    <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.6">
      <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

/* 01 · Set up: pick streamers, set the brand template once. */
function SetupVisual() {
  return (
    <div className="flex flex-col items-center gap-5" aria-hidden="true">
      <div className="flex gap-3">
        {streamers.slice(0, 4).map((s, i) => (
          <span
            key={s.id}
            className="relative block animate-[float-y_5s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.35}s` }}
          >
            <span className="block size-14 overflow-hidden rounded-[14px] shadow-[0_12px_28px_-14px_rgb(1_8_43/0.5)] sm:size-16">
              <Image
                src={s.avatar}
                alt=""
                width={64}
                height={64}
                className="size-full object-cover"
              />
            </span>
            {i < 3 && <Check className="absolute -top-1.5 -right-1.5" />}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-[10px] border border-border bg-bg px-3.5 py-2.5 text-xs shadow-[0_12px_28px_-18px_rgb(1_8_43/0.45)]">
        <span className="font-medium text-fg">Brand template</span>
        <span className="h-3 w-px bg-border" />
        <span className="text-fg-muted">Geist Bold</span>
        <span className="flex gap-1">
          <span className="size-3 rounded-[3px] bg-white ring-1 ring-border" />
          <span className="size-3 rounded-[3px] bg-electric" />
          <span className="size-3 rounded-[3px] bg-midnight" />
        </span>
      </div>
    </div>
  );
}

/* 02 · Clip it: a moment is framed on the live stream and cut into vertical clips. */
function ClipVisual() {
  return (
    <div className="flex flex-col items-center gap-4" aria-hidden="true">
      <div className="relative aspect-video w-[min(18rem,100%)] overflow-hidden rounded-[10px] bg-midnight shadow-[0_18px_40px_-22px_rgb(1_8_43/0.6)]">
        <Image
          src="/media/pipeline/stream.webp"
          alt=""
          fill
          sizes="288px"
          className="object-cover"
        />
        <span className="absolute inset-y-0 left-[40%] w-[31.6%] rounded-[6px] shadow-[0_0_0_2px_white,0_0_0_9999px_rgb(1_8_43/0.45)]" />
        <span className="absolute top-2 left-2 flex items-center gap-1 rounded-[4px] bg-midnight/70 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.08em] text-white uppercase">
          <span className="size-1 animate-live rounded-full bg-live" />
          Live
        </span>
      </div>
      <div className="flex gap-2">
        {[4, 11, 19, 27].map((k, i) => (
          <span
            key={k}
            className="relative block aspect-[9/16] w-11 animate-[float-y_4.5s_ease-in-out_infinite] overflow-hidden rounded-[5px] shadow-[0_10px_22px_-12px_rgb(1_8_43/0.55)]"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            <Image
              src={`/media/pipeline/clip-${k}.webp`}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/* 03 · Post: vertical clips, posted to every platform. */
function PostVisual() {
  const fan: { k: number; platform: Platform; rot: string }[] = [
    { k: 8, platform: "tiktok", rot: "-rotate-[8deg] translate-y-3" },
    { k: 16, platform: "youtubeShorts", rot: "z-10" },
    { k: 24, platform: "instagram", rot: "rotate-[8deg] translate-y-3" },
  ];
  return (
    <div className="flex items-center -space-x-5" aria-hidden="true">
      {fan.map(({ k, platform, rot }, i) => (
        <span key={k} className={`relative block ${rot}`}>
          <span
            className="relative block animate-[float-y_5.5s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            <span className="relative block aspect-[9/16] w-[5.5rem] overflow-hidden rounded-[8px] shadow-[0_18px_36px_-18px_rgb(1_8_43/0.65)] ring-2 ring-bg xl:w-28">
              <Image
                src={`/media/pipeline/clip-${k}.webp`}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
              <span
                className="absolute bottom-1.5 left-1.5 flex size-5 items-center justify-center rounded-[4px] text-white"
                style={{
                  backgroundColor:
                    platform === "tiktok" ? "var(--color-ink)" : platforms[platform].color,
                }}
              >
                <PlatformIcon platform={platform} className="size-3" />
              </span>
            </span>
            <Check className="absolute -top-2 -right-2" />
          </span>
        </span>
      ))}
    </div>
  );
}

export function StepsSection() {
  return (
    <section id="steps" aria-labelledby="steps-title" className="scroll-mt-16 bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
        <h2
          id="steps-title"
          className="max-w-[20ch] px-2 text-[clamp(2rem,4vw,3.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance text-fg sm:px-1"
        >
          Set it up once. <span className="text-fg-muted">Clippable does the rest.</span>
        </h2>
        <div className="mt-10 sm:mt-14">
          <ExpandingCards
            label="How Clippable works, in three steps"
            cards={[
              {
                index: "01",
                title: "Set up",
                visual: <SetupVisual />,
                heading: "Pick your streamers, set your style",
                body: "Follow the streamers you want to clip and set your brand template once: captions, colors and clip length.",
              },
              {
                index: "02",
                title: "Clip it",
                visual: <ClipVisual />,
                heading: "Clipped the second it happens",
                body: "Clippable watches every stream live, then cuts, captions and scores the best moments for you.",
              },
              {
                index: "03",
                title: "Post",
                visual: <PostVisual />,
                heading: "Post everywhere, get paid",
                body: "Download vertical clips for TikTok, Shorts, Reels and X, and earn per 1,000 views on streamer campaigns.",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
