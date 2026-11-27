import { Button } from "@/components/button";
import { LazyVideo } from "@/components/lazy-video";
import { site } from "@/lib/site";

export function FinalCta() {
  return (
    <section
      id="early-access"
      aria-labelledby="early-title"
      className="mx-auto max-w-[1360px] scroll-mt-4 bg-bg px-3 pb-16 sm:px-6 sm:pb-24"
    >
      <div className="relative isolate flex h-[max(78svh,560px)] items-center justify-center overflow-hidden rounded-[20px] bg-midnight px-6 text-center text-white sm:rounded-[28px]">
        <LazyVideo
          poster="/media/cta-poster.webp"
          sources={[
            { src: "/media/cta.av1.mp4", type: 'video/mp4; codecs="av01.0.05M.08"' },
            { src: "/media/cta.h264.mp4", type: "video/mp4" },
          ]}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(1_8_43/0.55),rgb(1_8_43/0.25)_70%)]"
        />
        <div className="flex flex-col items-center">
          <p className="eyebrow text-white/75">Early access</p>
          <h2
            id="early-title"
            className="mt-5 max-w-[14ch] text-[clamp(2.75rem,6.4vw,6rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance"
          >
            Start clipping before everyone else.
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg text-pretty text-white/85">
            Early access opens in waves. Tell us whether you clip or stream, and we&apos;ll get you
            in.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <Button
              href={`mailto:${site.email}?subject=${encodeURIComponent("Clippable early access")}`}
              variant="inverse"
              size="lg"
            >
              Get early access
            </Button>
            <p className="font-mono text-xs tracking-[0.04em] text-white/70 select-all">
              {site.email}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
