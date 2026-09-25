"use client";

/**
 * Number Ticker — 21st.dev: https://21st.dev/@dillionverma/components/number-ticker (license: MIT)
 * Author: Dillion Verma / Magic UI. Upstream source: magicuidesign/magicui
 * @ d7207e5692d14c00dceafa8488d6d01f197fa0e4 apps/www/registry/magicui/number-ticker.tsx (MIT).
 * Detail provenance & perubahan: COMPONENTS.md.
 *
 * Adaptasi: SSR merender NILAI AKHIR (tanpa JS / crawler / reduced motion melihat angka benar);
 * angka animasi `aria-hidden` + teks `sr-only` berisi nilai akhir; format locale brand (id-ID);
 * warna mengikuti token (tanpa text-black/white); dilewati bila prefers-reduced-motion.
 * Performa: upstream memakai useMotionValue+useSpring (menarik mesin animasi Motion ke JS awal,
 * terukur ±50 KB gzip). Di sini spring yang SAMA (damping 60, stiffness 100) dijalankan lewat
 * `animate()` Motion yang di-import dinamis saat angka masuk viewport; useInView/useReducedMotion
 * diganti hook kecil lokal (src/lib/use-motion-prefs.ts).
 */
import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { useIsVisible, usePrefersReducedMotion } from "@/lib/use-motion-prefs";
import { cn } from "@/lib/utils";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  locale?: string;
}

function formatter(locale: string, decimalPlaces: number) {
  const nf = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
  return (n: number) => nf.format(Number(n.toFixed(decimalPlaces)));
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  locale = "id-ID",
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion() !== false;
  const visible = useIsVisible(ref);
  // "once": sekali terlihat, tetap dianggap terlihat.
  const [isInView, setIsInView] = useState(false);
  if (visible && !isInView) setIsInView(true);
  const from = direction === "down" ? value : startValue;
  const to = direction === "down" ? startValue : value;
  const format = formatter(locale, decimalPlaces);

  // Sebelum terlihat: tampilkan nilai awal (elemen masih di luar viewport → tidak berkedip).
  useEffect(() => {
    if (reduce || !ref.current) return;
    if (!isInView) ref.current.textContent = formatter(locale, decimalPlaces)(from);
  }, [reduce, isInView, from, locale, decimalPlaces]);

  useEffect(() => {
    if (reduce || !isInView) return;
    let cancelled = false;
    let stop: (() => void) | undefined;
    const fmt = formatter(locale, decimalPlaces);
    const timer = setTimeout(() => {
      void import("@/lib/motion-lazy").then(({ animate }) => {
        if (cancelled) return;
        const controls = animate(from, to, {
          type: "spring",
          damping: 60,
          stiffness: 100,
          onUpdate: (latest) => {
            if (ref.current) ref.current.textContent = fmt(latest);
          },
        });
        stop = () => controls.stop();
      });
    }, delay * 1000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      stop?.();
    };
  }, [isInView, reduce, delay, from, to, locale, decimalPlaces]);

  return (
    <>
      <span ref={ref} aria-hidden="true" className={cn("inline-block tracking-wider tabular-nums", className)} {...props}>
        {format(value)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
