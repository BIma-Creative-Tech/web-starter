import Link from "next/link";
import { hero } from "@/config/content";
import { HeroAnimator } from "@/components/hero/hero-animator";
import { Icon } from "@/components/icon";
import { AnimatedGridPattern } from "@/components/ui-21st/animated-grid-pattern";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative -mt-19 overflow-hidden pt-19">
      <HeroAnimator className="relative">
        {/* Latar dekoratif */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <AnimatedGridPattern
            numSquares={24}
            animateMedia="(min-width: 768px)"
            maxOpacity={0.25}
            duration={3}
            className="mask-[radial-gradient(640px_circle_at_50%_30%,white,transparent)]"
          />
          {/* Mobile (<768px): gradien statis — tanpa gerak ambient (hemat CPU/baterai, skor
              Lighthouse mobile; keputusan user 2026-09-25). Desktop: orb blur bergerak. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_15%_0%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_70%),radial-gradient(ellipse_70%_40%_at_100%_35%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_70%)] md:hidden" />
          <div className="animate-hero-orb absolute -top-24 left-[8%] hidden size-72 rounded-full bg-primary/20 blur-3xl motion-reduce:animate-none md:block" />
          <div className="animate-hero-orb absolute top-40 right-[6%] hidden size-80 rounded-full bg-accent/15 blur-3xl [animation-delay:-4.5s] motion-reduce:animate-none md:block" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-20 sm:px-6 md:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:pb-28">
          <div>
            <p
              data-hero-init="badge"
              className="surface inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium"
            >
              <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
              {hero.badge}
            </p>

            <h1 id="hero-title" className="mt-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
              {hero.titleBefore}{" "}
              <span className="relative inline-block whitespace-nowrap text-primary">
                {hero.titleHighlight}
                <span
                  data-hero-init="underline"
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-2 w-full origin-left rounded-full bg-linear-to-r from-primary to-accent opacity-70"
                />
              </span>{" "}
              {hero.titleAfter}
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{hero.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span data-hero-init="cta">
                <Button asChild size="lg">
                  <Link href={hero.primaryCta.href}>
                    {hero.primaryCta.label}
                    <Icon name="arrow-right-02" size={18} />
                  </Link>
                </Button>
              </span>
              <span data-hero-init="cta">
                <Button asChild size="lg" variant="outline">
                  <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
                </Button>
              </span>
            </div>

            <p data-hero-init="trust" className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="tick-circle" size={18} type="bold" className="text-primary" />
              {hero.trust}
            </p>
          </div>

          {/* Komposisi kartu (desktop). */}
          <div aria-hidden="true" className="relative hidden h-[26rem] lg:block">
            {hero.cards.map((card, i) => (
              <div
                key={card.title}
                data-hero-init="card"
                className={[
                  "absolute w-64",
                  i === 0 ? "top-0 left-4" : i === 1 ? "top-32 right-0" : "bottom-0 left-12",
                ].join(" ")}
              >
                <div
                  className="surface animate-hero-float rounded-2xl p-5 shadow-xl motion-reduce:animate-none"
                  style={{ animationDelay: `${-i * 1.4}s` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon name={card.icon} size={24} type="bulk" />
                    </span>
                    <div>
                      <p className="text-sm text-muted-foreground">{card.title}</p>
                      <p className="font-heading text-2xl font-bold">{card.value}</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-linear-to-r from-primary to-accent" style={{ width: `${70 + i * 10}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </HeroAnimator>
    </section>
  );
}
