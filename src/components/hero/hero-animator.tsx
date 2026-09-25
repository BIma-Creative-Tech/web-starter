"use client";

/**
 * Animasi intro hero dengan anime.js v4 (subpath modular `scope`/`waapi`/`utils`, di-import dinamis).
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
      void Promise.all([import("animejs/scope"), import("animejs/waapi"), import("animejs/utils")]).then(
        ([{ createScope }, { waapi }, { stagger }]) => {
          if (cancelled || !root.current) return;
          scope.current = createScope({
            root,
            mediaQueries: { reduce: "(prefers-reduced-motion: reduce)" },
          }).add((self) => {
            if (self?.matches.reduce) return;
            const el = root.current;
            if (!el) return;
            // anime.js mengambil alih garis bawah → matikan fallback CSS-nya.
            const underline = el.querySelectorAll<HTMLElement>('[data-hero-init="underline"]');
            underline.forEach((u) => (u.style.animation = "none"));
            // anime.js WAAPI adapter: transform dijalankan browser di thread compositor
            // (tanpa kerja main-thread per frame, terukur mengurangi TBT dibanding engine JS).
            waapi.animate(underline, {
              transform: ["scaleX(0)", "scaleX(1)"],
              duration: 1100,
              ease: "outExpo",
              persist: true,
            });
            waapi.animate('[data-hero-init="badge"]', {
              transform: ["translateY(0px)", "translateY(-4px)", "translateY(0px)"],
              duration: 700,
              delay: 200,
              ease: "outExpo",
            });
            waapi.animate('[data-hero-init="cta"]', {
              transform: ["translateY(0px)", "translateY(-6px)", "translateY(0px)"],
              duration: 800,
              delay: stagger(90, { start: 500 }),
              ease: "outExpo",
            });
            waapi.animate('[data-hero-init="card"]', {
              transform: ["translateY(0px)", "translateY(-12px)", "translateY(0px)"],
              duration: 1000,
              delay: stagger(140, { start: 700 }),
              ease: "outExpo",
            });
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
