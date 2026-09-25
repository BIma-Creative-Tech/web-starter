import { brand } from "@/config/brand";
import { stats, steps } from "@/config/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { NumberTicker } from "@/components/ui-21st/number-ticker";

export function Stats() {
  return (
    <section id="keunggulan" aria-labelledby="keunggulan-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal>
        <SectionHeading id="keunggulan-title" eyebrow={stats.eyebrow} title={stats.title} />
      </Reveal>
      <dl className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.items.map((item, i) => (
          // <dl> > <div> (Reveal) > <dt>/<dd> — struktur definition list yang valid.
          <Reveal key={item.label} delay={i * 0.06} className="surface flex h-full flex-col-reverse rounded-2xl p-6 text-center">
            <dt className="mt-2 text-sm text-muted-foreground">{item.label}</dt>
            <dd className="font-heading text-4xl font-bold text-foreground">
              <NumberTicker value={item.value} locale={brand.locale} />
              <span>{item.suffix}</span>
            </dd>
          </Reveal>
        ))}
      </dl>

      <div className="mt-20">
        <Reveal>
          <h3 className="text-center text-2xl font-bold">{steps.title}</h3>
        </Reveal>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.items.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 0.08} className="h-full">
                <div className="relative h-full rounded-2xl border border-border p-6">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-10 items-center justify-center rounded-full bg-primary font-heading font-bold text-primary-foreground"
                  >
                    {i + 1}
                  </span>
                  <p className="mt-4 font-heading text-lg font-semibold">
                    <span className="sr-only">Langkah {i + 1}: </span>
                    {step.title}
                  </p>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
