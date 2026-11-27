import { LogoMark } from "@/components/logo";
import { site } from "@/lib/site";

export function EarlyAccess() {
  return (
    <section
      id="early-access"
      aria-labelledby="early-title"
      className="scroll-mt-20 px-3 py-3 sm:px-6 sm:py-6"
    >
      <div
        className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[var(--radius-card)] px-6 py-20 text-center text-white sm:py-28"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      >
        <LogoMark
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -bottom-20 -z-10 w-[34rem] max-w-none text-white/10"
        />
        <p className="eyebrow text-white/85">Early access</p>
        <h2
          id="early-title"
          className="mx-auto mt-4 max-w-[16ch] text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] font-medium tracking-[-0.045em] text-balance"
        >
          Start clipping before everyone else.
        </h2>
        <p className="mx-auto mt-5 max-w-[44ch] text-lg font-medium text-pretty">
          Early access opens in waves. Tell us whether you clip or stream, and we&apos;ll get you
          in.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent("Clippable early access")}`}
            className="btn bg-white text-midnight hover:bg-sky"
          >
            Request early access
          </a>
        </div>
      </div>
    </section>
  );
}
