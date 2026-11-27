import Image from "next/image";
import { ExpandingCards } from "@/components/cards/expanding-cards";
import { testimonials } from "@/lib/testimonials";

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="scroll-mt-16 bg-bg pb-24 sm:pb-32"
    >
      <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
        <h2
          id="testimonials-title"
          className="px-2 text-[clamp(2rem,4vw,3.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance text-fg sm:px-1"
        >
          Clippers and streamers <span className="text-fg-muted">on Clippable.</span>
        </h2>
        <div className="mt-10 sm:mt-14">
          <ExpandingCards
            label="Testimonials"
            cards={testimonials.map((t, i) => ({
              index: String(i + 1).padStart(2, "0"),
              title: t.role,
              tone: "dark" as const,
              background: (
                <div aria-hidden="true" className="absolute inset-0 -z-20">
                  <Image
                    src={t.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover opacity-45 transition-transform duration-[1.2s] ease-out-expo group-hover/x:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-midnight/30 to-midnight/90" />
                </div>
              ),
              visual: (
                <blockquote
                  className={`max-w-[24ch] text-center text-[clamp(1.4rem,2vw,2rem)] leading-tight font-medium tracking-[-0.03em] text-balance ${
                    t.placeholder
                      ? "rounded-[8px] border border-dashed border-white/35 px-4 py-3 text-white/60"
                      : ""
                  }`}
                >
                  “{t.quote}”
                </blockquote>
              ),
              heading: t.name,
              body: (
                <>
                  {t.detail}
                  {t.placeholder && (
                    <span className="mt-2 block font-mono text-[10px] tracking-[0.08em] text-sky uppercase">
                      Placeholder: awaiting a real testimonial
                    </span>
                  )}
                </>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  );
}
