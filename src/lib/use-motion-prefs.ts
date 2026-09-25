"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

/**
 * Hook kecil pengganti `useReducedMotion`/`useInView` dari motion/react untuk komponen yang
 * dirender di atas lipatan — agar mesin Motion tidak masuk JS awal (terukur ±40 KB gzip pada
 * LCP simulasi Lighthouse mobile). Motion tetap dipakai untuk animasinya (import dinamis).
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** true bila pengguna meminta reduced motion. Server: null (belum diketahui). */
export function usePrefersReducedMotion(): boolean | null {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => null,
  );
}

/** true selama elemen berada di viewport (IntersectionObserver). */
export function useIsVisible(ref: RefObject<Element | null>, rootMargin = "0px"): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return visible;
}
