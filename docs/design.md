# Keputusan desain — web-starter

Dipilih dengan skill **ui-ux-pro-max** (commit `dcc40ff`, `/root/.claude/skills/ui-ux-pro-max`),
2026-09-25. Semua nilai diimplementasikan di **`src/config/brand.ts`** (satu-satunya tempat
mengubah branding per client).

## 1. Proses pemilihan (query nyata)

| Query | Hasil | Keputusan |
|---|---|---|
| `"agency business services marketing site modern professional" --design-system --variance 6 --motion 6 --density 3` | Brutalism, pink `#EC4899`, Poppins/Open Sans | **Ditolak** — terlalu spesifik (counter-culture) untuk template netral multi-client |
| `"professional services company landing trustworthy modern" --design-system …` | Accessible & Ethical, navy `#1E3A8A` + gold, EB Garamond/Lato | Pola "Trust & Authority" dipakai (bukti sosial, stats, CTA jelas); gaya/font terlalu formal (legal) |
| `"saas startup landing modern bento" --design-system …` | **Hero + Features + CTA**, **Glassmorphism**, biru `#2563EB` + oranye `#EA580C`, **Space Grotesk / DM Sans** | **Dipakai** sebagai basis |
| `"bento grid" --domain style` | Bento Box Grid (rounded 16–24px, varied spans, hover scale, tailwind/css-grid) | Section layanan = bento |
| UX (`--domain ux`): reduced motion, excessive motion, inline form errors + error summary fokus, contrast 4.5:1, focus visible, font loading/CLS, submit feedback, form labels | — | Diterapkan (lihat §5) |

Dial: variance 6 (modern seimbang), motion 6 (standar: stagger/scroll), density 3 (lapang).
Pola yang disarankan untuk carousel/marquee: *"provide pause/stop … stop on focus, hover, and
reduced motion"* → diterapkan di testimoni.

## 2. Gaya

- **Glassmorphism terkendali** (preset `stylePreset: "glass"`): header & kartu `surface` =
  `color-mix(card 72%) + backdrop-blur 14px`; latar hero bergradien + grid animasi.
  Preset alternatif `"solid"` (kartu padat, lebih hemat GPU) — ganti di brand.ts.
- **Bento grid** untuk layanan; radius dasar `0.875rem`; bayangan halus.
- Anti-pattern dari skill yang dihindari: animasi berlebihan, dark mode sebagai default
  (default = ikut sistem, toggle manual tersedia), gradien ungu/pink "AI".

## 3. Palet (semantic tokens → CSS variables)

| Token | Terang | Gelap |
|---|---|---|
| background / foreground | `#F8FAFC` / `#1E293B` | `#0B1120` / `#E2E8F0` |
| card / card-foreground | `#FFFFFF` / `#1E293B` | `#111A2E` / `#E2E8F0` |
| primary / on-primary | `#2563EB` / `#FFFFFF` (trust blue) | `#60A5FA` / `#0B1120` |
| accent / on-accent | `#EA580C` / `#000000` (CTA orange) | `#FB923C` / `#0B1120` |
| muted / muted-foreground | `#E9EFF8` / `#475569` | `#1E293B` / `#94A3B8` |
| border / input / ring | `#E2E8F0` / `#CBD5E1` / `#2563EB` | `#1E293B` / `#334155` / `#60A5FA` |
| destructive | `#DC2626` | `#F87171` |

Mode terang = output skill apa adanya. Mode gelap dirancang manual (skill tidak memberi palet
gelap untuk preset ini). **Kontras diuji otomatis** (`tests/unit/brand.test.ts`, WCAG ≥ 4.5:1 untuk
10 pasangan × 2 mode) — ganti warna client → test gagal bila kontras kurang. Hasil saat ini
(rasio): fg/bg 13.98 (terang) & 15.27 (gelap); on-primary/primary 5.17 & 7.41; muted-fg/bg 7.24 & 7.34.

## 4. Tipografi

**Space Grotesk** (heading) + **DM Sans** (body) — mood "tech, startup, modern" (skill). Dimuat
via `next/font/google` → di-self-host saat build (tanpa request ke Google saat runtime; cocok
dengan CSP `font-src 'self'`), `display: swap` + fallback metrik otomatis (CLS 0 terukur).
Heading `text-wrap: balance`, body 16px / line-height 1.6.

## 5. Gerak (motion) & aksesibilitas

| Lapisan | Library | Perilaku | Reduced motion |
|---|---|---|---|
| Intro hero (badge, garis bawah, CTA, kartu) | **anime.js 4.5.0** `createTimeline` + `stagger`, `createScope` (import modular, dinamis) | sekali, ±1.5 dtk | dilewati (`scope.matches`), elemen tampil via CSS |
| Gerak ambient (orb, kartu melayang) | CSS keyframes (compositor) | loop pelan; **hanya ≥ 768px** — mobile memakai gradien statis (keputusan user 2026-09-25) | `motion-reduce:animate-none` |
| Scroll reveal section | **Motion 13.4.3** `inView` + `animate` (import dinamis) | fade + naik 24px, sekali | tidak dijalankan |
| Angka statistik | Number Ticker (spring Motion) | saat masuk viewport | nilai akhir langsung |
| Grid latar hero | Animated Grid Pattern (CSS opacity) | kotak berkedip hanya ≥ 768px (`animateMedia`), jeda di luar viewport; mobile = grid statis | grid statis |
| Testimoni | Marquee CSS | loop; **tombol jeda**, jeda saat hover/fokus | mati, 1 salinan, scroll manual |
| Global | `<MotionConfig reducedMotion="user">` | berlaku untuk semua `m.*` Motion | — |

Hanya `transform`/`opacity` yang dianimasikan. Elemen hero yang dianimasikan disembunyikan hanya
bila `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`, dengan fallback CSS
(muncul setelah 2.5 dtk bila JS gagal). Reveal hanya menyembunyikan elemen yang sudah "armed" oleh
JS dan masih di luar viewport → tanpa JS semua konten tampil.

Aksesibilitas lain: skip link, landmark (`header/nav/main/footer`), satu `h1` per halaman,
fokus terlihat (`outline` ring), target sentuh ≥ 44 px, label form eksplisit, error per field
(`aria-describedby`) + ringkasan error `role="alert"` yang difokuskan, honeypot `aria-hidden`,
ikon dekoratif `aria-hidden`, menu mobile `<details>` (tanpa JS).

## 6. Ikon (Iconsax)

Web component resmi `<iconsax-icon>` (`iconsax@0.1.1`), ikon gratis saja, dibungkus `<Icon>`
bertipe (`src/components/icon.tsx`) dengan kotak ukuran tetap (tanpa CLS). Dua temuan saat
implementasi (terbukti, bukan asumsi):

1. `import "iconsax"` statis membuat SSR gagal (`ReferenceError: HTMLElement is not defined`) →
   custom element didaftarkan di browser via `import("iconsax")` (`<IconsaxLoader>`).
2. Loader data ikon gratis bawaan paket memakai
   `new URL(\`./data/${category}.json\`, import.meta.url)`; **Turbopack (Next 16.3.6) mengompilasinya
   menjadi referensi statis ke `ai.json` untuk SEMUA kategori** (dilihat di chunk hasil build) →
   ikon di luar kategori "ai" tidak pernah tampil. Solusi: `scripts/iconsax-subset.mjs` mengekstrak
   hanya ikon/gaya yang dipakai (`src/components/icon-names.ts`) dari data paket ke
   `src/generated/iconsax-icons.json` (±51 KB mentah untuk 16 ikon × 3 gaya), didaftarkan dengan API
   publik paket `registerProIcons()` dan dirender dengan atribut `pro` (= "ambil dari registry
   lokal"; isinya tetap ikon GRATIS). Bonus: tidak ada lagi unduhan ±180 KB JSON kategori.
   **Jangan jalankan `npx iconsax sync`** (itu untuk ikon Pro berbayar).

## 7. Performa — hasil pengukuran (Lighthouse 13.5.0 mobile, lokal)

Lihat laporan W1 untuk angka final. Keputusan yang diambil berdasarkan pengukuran:
loop anime.js per frame → CSS keyframes; `<rect>` SVG yang dianimasikan JS → elemen HTML + CSS;
anime.js, fitur Motion, reveal & number ticker dimuat dinamis (JS sebelum LCP 212 → 171 KB gzip);
`sharp` dibuang dari image (tidak ada optimasi gambar runtime).
