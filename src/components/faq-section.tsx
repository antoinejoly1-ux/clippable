import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { faq } from "@/lib/faq";

export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <h2
          id="faq-title"
          className="text-center text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-fg"
        >
          Questions, answered.
        </h2>
        <div className="mt-12 sm:mt-14">
          <FaqList items={faq} />
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
