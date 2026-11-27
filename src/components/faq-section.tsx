import { JsonLd } from "@/components/json-ld";
import { faq } from "@/lib/faq";

export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2
          id="faq-title"
          className="text-center text-[clamp(2rem,4vw,3.25rem)] leading-[1] font-medium tracking-[-0.045em] text-fg"
        >
          Questions, answered.
        </h2>
        <div className="mt-12 border-t border-border sm:mt-14">
          {faq.map((item) => (
            <details key={item.q} className="group border-b border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-medium text-fg [&::-webkit-details-marker]:hidden">
                {item.q}
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="size-4 shrink-0 text-fg-muted transition-transform duration-300 group-open:rotate-45"
                >
                  <path
                    d="M8 3v10M3 8h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </summary>
              <p className="max-w-[60ch] pb-6 text-[15px] leading-relaxed text-pretty text-fg-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </section>
  );
}
