import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ClipStory } from "@/components/story/clip-story";
import { StreamerSection } from "@/components/streamers/streamer-section";
import { site } from "@/lib/site";

const appLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
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
        <FinalCta />
      </main>
      <SiteFooter />
      <JsonLd data={appLd} />
    </>
  );
}
