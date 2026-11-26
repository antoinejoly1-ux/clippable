import { LogoMark } from "@/components/logo";
import { site } from "@/lib/site";

/**
 * Pre-launch holding page. Proves the token system, logo, fonts and headers
 * end to end. Replaced by the real homepage once the inspiration and brief land.
 */
export default function Home() {
  return (
    <main
      id="main"
      className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center text-white"
      style={{ backgroundImage: "var(--gradient-hero)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -bottom-40 -z-10 hidden size-[36rem] rotate-12 rounded-[6rem] bg-white/10 sm:block"
      />
      <LogoMark className="h-14 w-auto sm:h-20" />
      <h1 className="mt-8 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
        {site.name}
      </h1>
      <p className="mt-4 max-w-md text-xl font-semibold text-pretty">{site.tagline}.</p>
    </main>
  );
}
