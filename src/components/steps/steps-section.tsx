import { ExpandingCards } from "@/components/cards/expanding-cards";
import { ClipVisual, PostVisual, SetupVisual } from "@/components/steps/step-visuals";

export function StepsSection() {
  return (
    <section
      id="steps"
      data-pause-offscreen
      aria-labelledby="steps-title"
      className="scroll-mt-16 bg-bg py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
        <h2
          id="steps-title"
          className="text-center text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance text-fg"
        >
          Set it up once. <br />
          <span className="text-fg-muted">Clippable does the rest.</span>
        </h2>
        <div className="mt-12 sm:mt-16">
          <ExpandingCards
            label="How Clippable works, in three steps"
            cards={[
              {
                index: "01",
                title: "Set up",
                sky: "bl",
                visual: <SetupVisual />,
                heading: "Pick your streamers, set your style",
                body: "Follow the streamers you want to clip and set your brand template once: captions, colors and clip length.",
              },
              {
                index: "02",
                title: "Clip it",
                sky: "tl",
                visual: <ClipVisual />,
                heading: "Clipped the second it happens",
                body: "Clippable watches every stream live, then cuts, captions and scores the best moments for you.",
              },
              {
                index: "03",
                title: "Post",
                sky: "br",
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
