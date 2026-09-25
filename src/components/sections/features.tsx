import { features } from "@/config/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { BentoCard, BentoGrid } from "@/components/ui-21st/bento-grid";

const backgrounds = [
  "bg-[radial-gradient(circle_at_80%_10%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_55%)]",
  "bg-[radial-gradient(circle_at_90%_0%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_60%)]",
  "bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_60%)]",
  "bg-[radial-gradient(circle_at_0%_0%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_60%)]",
  "bg-[radial-gradient(circle_at_100%_100%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_60%)]",
];

export function Features() {
  return (
    <section id="layanan" aria-labelledby="layanan-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal>
        <SectionHeading id="layanan-title" eyebrow={features.eyebrow} title={features.title} description={features.description} />
      </Reveal>
      <BentoGrid className="mt-12">
        {features.items.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.06} className={`${item.span} ${i === 0 ? "md:col-span-2" : ""}`}>
            <BentoCard
              className="h-full"
              name={item.name}
              description={item.description}
              icon={item.icon}
              href="/contact"
              cta="Diskusikan"
              background={<div className={`absolute inset-0 ${backgrounds[i % backgrounds.length]}`} />}
            />
          </Reveal>
        ))}
      </BentoGrid>
    </section>
  );
}
