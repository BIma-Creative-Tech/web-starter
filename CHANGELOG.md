# Changelog

Semua perubahan penting pada repo `web-starter` dicatat di file ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), dan proyek ini
memakai [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Versi = `version` di
`package.json`; tag git `vX.Y.Z` (annotated) harus sama dengan versi itu — CI menolak tag yang
berbeda dan mem-push image `ghcr.io/bima-creative-tech/web-starter:X.Y.Z`. Commit memakai Conventional
Commits (`feat` = minor, `fix`/`perf` = patch, `BREAKING CHANGE` = major).

Keputusan stack & lisensi: repo `infra` `docs/adr/0007-web-client-ui-stack.md`; asal-usul
komponen pihak ketiga: `COMPONENTS.md`.

## [Unreleased]

### Security

- (2026-10-24) base image Node.js 24.21.0 → 24.22.1 (rilis keamanan 2026-10-20: 5 High tls ×3/dns/brotli, 2 Medium http/crypto, 1 Low permission), `node:24.22.1-alpine` pin digest `sha256:06d7adf3…`, Trivy 0 HIGH/CRITICAL.
- (2026-10-24) `next` + `eslint-config-next` 16.3.8 → 16.4.2 (CRITICAL RCE tanpa login GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr; DoS GHSA-p3m5-59mp-jv5r), `zod` 4.6.5 → 4.6.7 (GHSA-mrhx-c7xc-m3w5, high), `nodemailer` 10.0.10 → 10.2.1 (GHSA-8c8m-p3m8-cjg8, GHSA-m943-m63m-w62w, GHSA-85x2-q946-cp5h). Lockfile hanya menyentuh paket ini + biner `@next/*`; `npm audit --omit=dev` 0 kerentanan; lint, typecheck, test, build hijau di node 24.22.1.
- `next` 16.3.6 → 16.3.8 (CVE-2026-94483), `sharp` 0.35.4 → 0.35.5 (GHSA-wq5f-xc86-pv6w),
  `source-map-js` 1.2.1 → 1.2.2 (CVE-2026-93749) — CI terjadwal merah 2026-10-12 (PR #1).

### Changed

- Image GHCR pindah ke `ghcr.io/bima-creative-tech/web-starter` (repo pindah ke org
  BIma-Creative-Tech; push ke `ghcr.io/bctech-adm/*` ditolak `permission_denied`). README
  (langkah membuat `web-<slug>`) dan tautan CHANGELOG ikut diganti.

## [0.1.0] - 2026-09-25

Rilis pertama template website client (plan 03 infra, task W1–W4). Demo:
`https://starter.staging.bimacreative.tech`.

### Added
- Scaffold Next.js 16.3.6 App Router (React 19.3.0, TypeScript strict, `output: standalone`,
  Tailwind 4.3.3), shadcn/ui (`shadcn@4.21.0`: button, input, textarea, label) (`4743b15`).
- Paket UI: `motion` 13.4.3, `animejs` 4.5.0, `iconsax` 0.1.1 (web component resmi, subset ikon
  gratis diekstrak saat build) (`4743b15`).
- Komponen 21st.dev bersumber upstream Magic UI (MIT, commit `d7207e5`): Marquee, Bento Grid,
  Number Ticker, Animated Grid Pattern — disalin & diadaptasi (token brand, a11y, performa) (`4743b15`).
- Branding satu tempat (`src/config/brand.ts`: warna → CSS variables, font self-host, radius,
  preset glass/solid, kontak, SEO), light/dark (`4743b15`).
- Halaman: landing, `/contact`, 404, sitemap, robots, OG image, favicon (`4743b15`).
- Form kontak Route Handler `POST /api/contact` (JSON/multipart, pemeriksaan Origin, Zod,
  honeypot, rate limit, SMTP opsional via `SMTP_PASSWORD_FILE`), default off; tanpa Server Action
  (`4743b15`).
- Kontrak container: port 3000, `GET /api/health`, uid 1001, root filesystem read-only, image
  `node:24.21.0-alpine` pin digest (`4743b15`).
- Test vitest (CSP, env, skema/route kontak, rate limiter, health, kontras brand); hook
  pre-commit gitleaks (`.githooks`) (`4743b15`).
- CI GitHub Actions: actionlint, gitleaks, Semgrep, Trivy fs+config+image (gagal HIGH/CRITICAL),
  Hadolint, lint/typecheck/test/`npm audit`/build, smoke test kontrak, push GHCR (`:sha-<12>` di
  `main`, `:X.Y.Z` untuk tag `vX.Y.Z`) (`3d4444e`).
- Dokumentasi: `README.md`, `COMPONENTS.md` (lisensi & asal-usul komponen), `docs/design.md`
  (keputusan desain via skill ui-ux-pro-max) (`99301fd`).
- Hero di layar < 768px: gradien statis tanpa animasi ambient (keputusan user); prop opsional
  `animateMedia` pada Animated Grid Pattern (`abf60f2`).
- `CHANGELOG.md`.

### Changed
- Performa — hydration dikurangi: section landing jadi server component, interaktivitas di pulau
  client kecil, `<ScrollEnhancer>` tunggal mulai saat idle, Motion keluar dari bundle awal, zod
  keluar dari bundle browser `/contact`. First-load JS `/` 160 → 146 KB gzip, `/contact`
  249 → 149 KB gzip (`fec4c76`).
- Performa — intro hero anime.js lewat adapter WAAPI (compositor), bukan engine JS (`d5f6148`).
  Lighthouse mobile lokal (median): Performance 92 (TBT 258 ms), Accessibility / Best Practices /
  SEO 100, CLS 0.

### Fixed
- Docker: `/app/.next/cache` mode 1777 agar tmpfs bisa ditulis uid 1001 (`80f452f`).

### Security
- CSP per request: `script-src` nonce + `'strict-dynamic'` (tanpa `'unsafe-inline'`);
  `style-src 'unsafe-inline'` khusus style (disetujui user — Motion/anime.js menulis `style` inline).
- Form kontak: pemeriksaan Origin + body JSON/multipart saja, tanpa token CSRF (website tanpa
  session; keputusan Lead).

[Unreleased]: https://github.com/BIma-Creative-Tech/web-starter/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/BIma-Creative-Tech/web-starter/releases/tag/v0.1.0
