import { Hero } from "@/components/hero/hero";
import { CallToAction } from "@/components/sections/cta";
import { Features } from "@/components/sections/features";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <CallToAction />
    </>
  );
}
