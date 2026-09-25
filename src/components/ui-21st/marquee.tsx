/**
 * Marquee — 21st.dev: https://21st.dev/@dillionverma/components/marquee (license: MIT)
 * Author: Dillion Verma / Magic UI. Upstream source: magicuidesign/magicui
 * @ d7207e5692d14c00dceafa8488d6d01f197fa0e4 apps/www/registry/magicui/marquee.tsx (MIT).
 * Detail provenance & perubahan: COMPONENTS.md.
 *
 * Adaptasi: salinan konten ke-2..n `aria-hidden` (pembaca layar hanya membaca sekali);
 * prop `paused` dan/atau atribut `data-marquee-paused="true"` pada ancestor (kontrol jeda eksplisit,
 * WCAG 2.2.2 — lihat MarqueePauseButton); jeda saat hover/fokus; reduced motion →
 * animasi mati, hanya salinan pertama yang tampil dan bisa di-scroll horizontal.
 */
import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  paused?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  paused = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem] motion-reduce:overflow-x-auto",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 ? true : undefined}
          className={cn(
            "flex shrink-0 justify-around gap-(--gap) motion-reduce:animate-none",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
            paused && "[animation-play-state:paused]",
            "[[data-marquee-paused=true]_&]:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
            i > 0 && "motion-reduce:hidden",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
