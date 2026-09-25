import Link from "next/link";
import { cta } from "@/config/content";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,.22),transparent_45%),radial-gradient(circle_at_90%_100%,rgba(0,0,0,.18),transparent_50%)]"
          />
          <h2 id="cta-title" className="relative text-3xl font-bold sm:text-4xl">
            {cta.title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg opacity-90">{cta.description}</p>
          <div className="relative mt-8 flex justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href={cta.button.href}>
                {cta.button.label}
                <Icon name="send-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
