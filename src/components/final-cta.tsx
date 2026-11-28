import { Button } from "@/components/button";
import { LazyVideo } from "@/components/lazy-video";
import { site } from "@/lib/site";

export function FinalCta() {
  return (
    <section
      id="early-access"
      aria-labelledby="early-title"
      className="mx-auto max-w-[1360px] scroll-mt-4 bg-bg px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24"
    >
      <div className="relative isolate flex h-[max(56svh,440px)] items-center justify-center overflow-hidden rounded-[20px] bg-midnight px-6 text-center text-white sm:rounded-[28px]">
        <LazyVideo
          poster="/media/cta-kai-poster.webp"
          sources={[
            {
              src: "/media/cta-kai.m.av1.mp4",
              type: 'video/mp4; codecs="av01.0.04M.10"',
              media: "(max-width: 767px)",
            },
            { src: "/media/cta-kai.m.h264.mp4", type: "video/mp4", media: "(max-width: 767px)" },
            { src: "/media/cta-kai.av1.mp4", type: 'video/mp4; codecs="av01.0.05M.10"' },
            { src: "/media/cta-kai.h264.mp4", type: "video/mp4" },
          ]}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(1_8_43/0.55),rgb(1_8_43/0.25)_70%)]"
        />
        <div className="flex flex-col items-center">
          <h2
            id="early-title"
            className="max-w-[14ch] text-[clamp(2.75rem,6.4vw,6rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance"
          >
            Make clips before everyone else.
          </h2>
          {/* TODO(client): point at the signup flow. Until it exists, this opens an email to the team
              (the page's other "Create account" buttons scroll here). */}
          <Button
            href={`mailto:${site.email}?subject=${encodeURIComponent("Create my Clippable account")}`}
            variant="inverse"
            size="lg"
            className="mt-10"
          >
            Create account
          </Button>
        </div>
      </div>
    </section>
  );
}
