"use client";

import { useEffect } from "react";
import { markIconsReady } from "@/components/iconsax-registry";

/**
 * Mendaftarkan web component resmi <iconsax-icon> HANYA di browser, lalu mendaftarkan subset
 * ikon gratis (src/generated/iconsax-icons.json, hasil scripts/iconsax-subset.mjs) lewat API
 * publik paket `registerProIcons()`.
 *
 * - Import statis `import "iconsax"` tidak bisa: modul paket mengevaluasi
 *   `class … extends HTMLElement` di top-level → SSR gagal (ReferenceError, terbukti di smoke test).
 * - Loader data gratis bawaan paket rusak di Turbopack (selalu memuat ai.json) → dipakai subset.
 * Dipasang sekali di root layout; kedua modul dimuat lazy (tidak menambah JS awal).
 */
export function IconsaxLoader() {
  useEffect(() => {
    let cancelled = false;
    void Promise.all([import("iconsax"), import("@/generated/iconsax-icons.json")]).then(([mod, icons]) => {
      if (cancelled) return;
      mod.registerProIcons(icons.default as Record<string, Record<string, string>>);
      markIconsReady();
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
