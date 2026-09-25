# COMPONENTS.md — komponen pihak ketiga yang DISALIN ke repo

Aturan (plan 03 §2, CLAUDE.md §0.10): komponen disalin (bukan dependency runtime), lisensi dan
asal-usul dicatat, komponen tanpa lisensi jelas **ditolak**. Tidak ada request runtime ke 21st.dev.

## 21st.dev (`src/components/ui-21st/`)

Registry 21st.dev (`https://21st.dev/r/<author>/<component>`) sejak 2026 mengembalikan
`403 {"error":"Authentication required"}` (diverifikasi 2026-09-25), dan file kode di halaman
komponen menunjuk storage privat (`r2://components-code-private/...`). Karena itu:

1. **Lisensi & author** diambil dari data halaman publik 21st.dev (field `license`, `user`,
   `website_url`, `dependencies`, `created_at`) — diunduh 2026-09-25 dengan `curl`.
2. **Kode sumber** diambil dari repo upstream yang ditunjuk `website_url` halaman tersebut
   (Magic UI, author yang sama), di-pin ke commit, lisensi repo diverifikasi via GitHub API
   (`license.spdx_id = MIT`) dan file `LICENSE.md` pada commit tersebut.

Upstream: <https://github.com/magicuidesign/magicui> · commit
`d7207e5692d14c00dceafa8488d6d01f197fa0e4` (2026-09-20) · lisensi **MIT** (`Copyright (c) Magic UI`)
· repo aktif (push terakhir 2026-09-20, ±22 rb bintang, tidak diarsipkan).

| Komponen | Halaman 21st.dev | Author (21st.dev) | Lisensi (21st.dev → upstream) | Dibuat di 21st.dev | Path upstream @ commit | Dependency (21st.dev → dipakai di sini) | File lokal |
|---|---|---|---|---|---|---|---|
| Marquee | https://21st.dev/@dillionverma/components/marquee | Dillion Verma (`dillionverma`) | `mit` → MIT | 2024-12-04 | `apps/www/registry/magicui/marquee.tsx` | tidak ada; keyframes `marquee` (registry.json `cssVars`/`css`) → `src/app/globals.css` | `marquee.tsx` |
| Bento Grid | https://21st.dev/@dillionverma/components/bento-grid | Dillion Verma | `mit` → MIT | 2024-12-04 | `apps/www/registry/magicui/bento-grid.tsx` | `@radix-ui/react-icons` + `shadcn/button` → **diganti** `<Icon>` Iconsax + `next/link` (tanpa dependency baru) | `bento-grid.tsx` |
| Number Ticker | https://21st.dev/@dillionverma/components/number-ticker | Dillion Verma | `mit` → MIT | 2024-10-10 | `apps/www/registry/magicui/number-ticker.tsx` | `framer-motion` (21st) / `motion` (upstream) → `motion@13.4.3` | `number-ticker.tsx` |
| Animated Grid Pattern | https://21st.dev/@dillionverma/components/animated-grid-pattern | Dillion Verma | `mit` → MIT | 2024-12-04 | `apps/www/registry/magicui/animated-grid-pattern.tsx` | `framer-motion`/`motion` → `motion@13.4.3` (hanya hook kecil lokal, lihat bawah) | `animated-grid-pattern.tsx` |

Ditolak/tidak dipakai: **Border Beam** (MIT, author sama) — menganimasikan `offset-distance`
(bukan transform/opacity) → melanggar aturan animasi template.

### Perubahan terhadap upstream (ringkas; detail di header tiap file)

- **Semua**: warna hard-coded (`neutral-*`, `black/white`, `gray-400`) → token brand (kontras ≥ 4.5:1);
  gaya kode disesuaikan (prettier/eslint repo ini).
- **Marquee**: salinan ke-2..n `aria-hidden`; prop `paused` / atribut ancestor `data-marquee-paused`
  + tombol jeda (pulau client kecil) di section (WCAG 2.2.2);
  jeda saat hover **dan** fokus keyboard; reduced motion → animasi mati, satu salinan, bisa di-scroll.
- **Bento Grid**: ikon Iconsax; CTA juga tampil saat `focus-within` (bukan hover saja); grid
  responsif 1→2→3 kolom; permukaan kartu memakai utilitas `surface` (preset glass/solid).
- **Number Ticker**: SSR merender nilai akhir (tanpa JS/crawler melihat angka benar), angka animasi
  `aria-hidden` + `sr-only`; locale `id-ID`; **server component** — spring yang sama (damping 60,
  stiffness 100) dijalankan oleh `<ScrollEnhancer>` via `animate()` Motion yang di-import dinamis saat
  angka terlihat (bukan `useSpring` per instance) — alasan performa terukur.
- **Animated Grid Pattern**: kotak berkedip dirender sebagai elemen HTML + CSS keyframes opacity
  (compositor) alih-alih `<rect>` SVG yang dianimasikan JS per frame; grid SVG server-rendered,
  kotak = pulau client (`animated-grid-squares.tsx`) yang mulai saat idle; jeda di luar viewport;
  reduced motion → grid statis. Props API sama + prop opsional `animateMedia` (media query;
  di luar query hanya grid statis — hero memakai `(min-width: 768px)`).

## shadcn/ui (`src/components/ui/`)

CLI **`shadcn@4.21.0`** (MIT, <https://github.com/shadcn-ui/ui>), `init -t next -b radix -p nova`,
lalu `add input textarea label` (2026-09-25). Komponen: `button`, `input`, `textarea`, `label`.
Dependency runtime: `radix-ui@1.6.7` (MIT), `class-variance-authority@0.7.1` (Apache-2.0).
Penyesuaian: `cn` dari `@/lib/utils` (clsx + tailwind-merge) — CLI memasang paket `cn@0.4.0`,
`shadcn` (runtime, untuk `shadcn/tailwind.css`), `lucide-react`, `tw-animate-css`; keempatnya
**dicopot** (tidak dibutuhkan). Tinggi tombol/input dinaikkan ke ≥ 44 px (target sentuh).
Menambah komponen: `npm run ui:add <nama>` (CLI ter-pin), lalu ganti import `cn` bila perlu.

## Iconsax (`iconsax@0.1.1`, MIT, <https://github.com/iconsax/iconsax-npm>)

Web component resmi `<iconsax-icon>`. Hanya ikon **gratis**. Subset SVG yang dipakai diekstrak
dari data paket oleh `scripts/iconsax-subset.mjs` → `src/generated/iconsax-icons.json` (lihat
docs/design.md §Ikon untuk alasan). Paket komunitas `iconsax-react`/`iconsax-reactjs` ditolak.
