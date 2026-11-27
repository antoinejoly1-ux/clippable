import { AgentsSection } from "@/components/agents/agents-section";
import { AudienceSection } from "@/components/audience/audience-section";
import { FaqSection } from "@/components/faq-section";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { LiveSection } from "@/components/live/live-section";
import { SiteFooter } from "@/components/site-footer";
import { StepsSection } from "@/components/steps/steps-section";
import { SiteHeader } from "@/components/site-header";
import { ClipStory } from "@/components/story/clip-story";
import { StreamerSection } from "@/components/streamers/streamer-section";
import { site } from "@/lib/site";

const appLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${site.url}/#software`,
  name: site.name,
  image: `${site.url}/brand/clippable-app-icon-512.png`,
  url: site.url,
  description: site.description,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  publisher: { "@id": `${site.url}/#organization` },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="relative z-[1] bg-bg">
        <span id="top" aria-hidden="true" />
        <ClipStory />
        <StreamerSection />
        <StepsSection />
        <AgentsSection />
        <LiveSection />
        <AudienceSection />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
      <JsonLd data={appLd} />
    </>
  );
}
