"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Detik. */
  delay?: number;
  /** Jarak geser awal (px) — hanya transform + opacity (murah untuk GPU, tanpa layout shift). */
  y?: number;
};

/**
 * Reveal saat di-scroll ke viewport (sekali) dengan Motion (`inView` + `animate`, API vanilla
 * paket `motion`) yang di-import dinamis → tidak menambah JS awal (terukur: `m.div` menambah
 * ±40 KB gzip ke jalur kritis LCP).
 * Aman tanpa JS/reduced motion: elemen hanya disembunyikan setelah JS "mempersenjatai"-nya
 * (data-reveal="armed") dan hanya bila masih di luar viewport — tidak ada kedip, dan konten
 * tidak pernah terjebak tersembunyi bila Motion gagal dimuat.
 */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let stop: VoidFunction | undefined;
    void import("@/lib/motion-lazy").then(({ inView, animate }) => {
      if (cancelled) return;
      // Sudah terlihat saat Motion siap → biarkan tampil apa adanya.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.dataset.reveal = "armed";
      stop = inView(
        el,
        () => {
          animate(el, { opacity: [0, 1], y: [y, 0] }, { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }).then(() => {
            el.dataset.reveal = "done";
          });
          stop?.();
        },
        { margin: "0px 0px -10% 0px" },
      );
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
