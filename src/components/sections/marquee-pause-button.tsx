"use client";

import { useState } from "react";

/**
 * Tombol jeda/putar marquee (WCAG 2.2.2). Pulau client kecil: hanya men-toggle atribut
 * `data-marquee-paused` pada elemen target; Marquee (server) membaca atribut itu via CSS.
 */
export function MarqueePauseButton({ targetId }: { targetId: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={paused}
      aria-controls={targetId}
      onClick={() => {
        const next = !paused;
        setPaused(next);
        document.getElementById(targetId)?.setAttribute("data-marquee-paused", String(next));
      }}
      className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-medium transition-colors duration-200 hover:bg-muted"
    >
      {paused ? "Putar animasi testimoni" : "Jeda animasi testimoni"}
    </button>
  );
}
