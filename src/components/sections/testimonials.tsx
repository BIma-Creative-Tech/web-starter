"use client";

import { useState } from "react";
import { testimonials } from "@/config/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { Marquee } from "@/components/ui-21st/marquee";

type Item = (typeof testimonials.items)[number];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

function TestimonialCard({ item }: { item: Item }) {
  return (
    <figure className="surface w-80 shrink-0 rounded-2xl p-6">
      <blockquote className="text-card-foreground">“{item.quote}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="inline-flex size-10 items-center justify-center rounded-full bg-secondary font-heading text-sm font-bold text-secondary-foreground"
        >
          {initials(item.name)}
        </span>
        <span>
          <span className="block font-semibold">{item.name}</span>
          <span className="block text-sm text-muted-foreground">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const [paused, setPaused] = useState(false);
  const half = Math.ceil(testimonials.items.length / 2);
  const rows = [testimonials.items.slice(0, half), testimonials.items.slice(half)];

  return (
    <section id="testimoni" aria-labelledby="testimoni-title" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading id="testimoni-title" eyebrow={testimonials.eyebrow} title={testimonials.title} />
        </Reveal>
        <div className="mt-6 flex justify-center motion-reduce:hidden">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-medium transition-colors duration-200 hover:bg-muted"
          >
            {paused ? "Putar animasi testimoni" : "Jeda animasi testimoni"}
          </button>
        </div>
      </div>
      <div className="relative mt-8">
        {rows.map((row, i) => (
          <Marquee key={i} pauseOnHover paused={paused} reverse={i === 1} repeat={3} className="[--duration:50s]">
            {row.map((item) => (
              <TestimonialCard key={item.name} item={item} />
            ))}
          </Marquee>
        ))}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-linear-to-r from-background motion-reduce:hidden" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-linear-to-l from-background motion-reduce:hidden" />
      </div>
    </section>
  );
}
