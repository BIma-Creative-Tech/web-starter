"use client";

/**
 * Animasi intro hero dengan anime.js v4 (import modular → tree-shaking, dimuat dinamis).
 * - createScope({ root }) membatasi selector ke subtree hero dan `scope.revert()` membersihkan
 *   semua animasi saat unmount (pola resmi anime.js untuk React).
 * - Dilewati total bila `prefers-reduced-motion: reduce` (elemen sudah tampil via CSS).
 * - Hanya transform + opacity (compositor-only, tanpa layout shift).
 * Status awal elemen [data-hero-init] ada di globals.css. Gerak ambient tanpa akhir (orb, kartu
 * melayang) sengaja memakai CSS keyframes (thread compositor, tanpa kerja JS per frame) —
 * loop anime.js per frame terukur menaikkan Total Blocking Time di Lighthouse mobile.
 */
import { useEffect, useRef } from "react";
import type { Scope } from "animejs";

export function HeroAnimator({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<Scope | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Dimuat dinamis (subpath modular) → anime.js tidak ikut JS awal; first paint/LCP tidak
    // menunggu. Bila gagal dimuat, fallback CSS di globals.css tetap menampilkan elemen.
    void Promise.all([import("animejs/scope"), import("animejs/timeline"), import("animejs/utils")]).then(
      ([{ createScope }, { createTimeline }, { stagger }]) => {
        if (cancelled || !root.current) return;
        scope.current = createScope({
          root,
          mediaQueries: { reduce: "(prefers-reduced-motion: reduce)" },
        }).add((self) => {
          if (self?.matches.reduce) return;
          createTimeline({ defaults: { ease: "outExpo", duration: 900 } })
            .add('[data-hero-init="badge"]', { opacity: [0, 1], translateY: [14, 0] })
            .add('[data-hero-init="underline"]', { scaleX: [0, 1], duration: 1100 }, "-=650")
            .add('[data-hero-init="cta"]', { opacity: [0, 1], translateY: [16, 0], delay: stagger(90) }, "-=900")
            .add('[data-hero-init="trust"]', { opacity: [0, 1] }, "-=700")
            .add(
              '[data-hero-init="card"]',
              { opacity: [0, 1], translateY: [28, 0], scale: [0.96, 1], delay: stagger(140) },
              "-=1000",
            );
        });
      },
    );
    return () => {
      cancelled = true;
      scope.current?.revert();
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
