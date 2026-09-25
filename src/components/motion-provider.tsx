"use client";

import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () => import("@/components/motion-features").then((mod) => mod.default);

/**
 * Motion (penerus framer-motion). LazyMotion + domAnimation (animasi + gesture termasuk inView)
 * dimuat ASYNC → JS awal lebih kecil (terukur memperbaiki LCP simulasi Lighthouse mobile).
 * `strict` memaksa pemakaian `m.*` bukan `motion.*`.
 * reducedMotion="user": animasi transform/layout dimatikan bila OS meminta reduced motion.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
