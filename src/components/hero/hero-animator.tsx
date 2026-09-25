"use client";

/**
 * Animasi intro hero dengan anime.js v4 (subpath modular, di-import dinamis).
 * - Dimulai saat IDLE (requestIdleCallback + fallback) → di luar jendela TBT; teks hero sudah
 *   tampil penuh sejak first paint (LCP tidak menunggu JS). Intro hanya "aksen": garis bawah
 *   digambar (scaleX), badge/CTA/kartu diberi gerak lift singkat dari posisi akhirnya.
 * - createScope({ root }) membatasi selector ke subtree hero; `scope.revert()` saat unmount.
 * - Dilewati bila `prefers-reduced-motion: reduce` (garis bawah tampil penuh via CSS).
 * - Hanya transform (compositor-only, tanpa layout shift).
 * Gerak ambient tanpa akhir (orb, kartu melayang) memakai CSS keyframes, bukan anime.js.
 */
import { useEffect, useRef } from "react";
import type { Scope } from "animejs";
import { onIdle } from "@/lib/idle";

export function HeroAnimator({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<Scope | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cancelIdle = onIdle(() => {
      void Promise.all([import("animejs/scope"), import("animejs/timeline"), import("animejs/utils")]).then(
        ([{ createScope }, { createTimeline }, { stagger }]) => {
          if (cancelled || !root.current) return;
          scope.current = createScope({
            root,
            mediaQueries: { reduce: "(prefers-reduced-motion: reduce)" },
          }).add((self) => {
            if (self?.matches.reduce) return;
            // anime.js mengambil alih garis bawah → matikan fallback CSS-nya.
            root.current
              ?.querySelectorAll<HTMLElement>('[data-hero-init="underline"]')
              .forEach((el) => (el.style.animation = "none"));
            createTimeline({ defaults: { ease: "outExpo", duration: 900 } })
              .add('[data-hero-init="underline"]', { scaleX: [0, 1], duration: 1100 })
              .add('[data-hero-init="badge"]', { translateY: [0, -4, 0], duration: 700 }, "-=900")
              .add('[data-hero-init="cta"]', { translateY: [0, -6, 0], delay: stagger(90), duration: 800 }, "-=600")
              .add('[data-hero-init="card"]', { translateY: [0, -12, 0], delay: stagger(140), duration: 1000 }, "-=800");
          });
        },
      );
    }, 1200);
    return () => {
      cancelled = true;
      cancelIdle();
      scope.current?.revert();
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
