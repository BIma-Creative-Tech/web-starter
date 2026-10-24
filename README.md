# web-starter

Template website marketing Next.js untuk client platform (setiap `web-<slug>` dibuat dari repo ini).
Next.js **16.3.6** (App Router, `output: standalone`) · React 19.3 · TypeScript strict · Tailwind CSS v4 ·
shadcn/ui · **Motion 13.4.3** · **anime.js 4.5.0** · **Iconsax 0.1.1** (web component resmi) ·
komponen 21st.dev (Magic UI, MIT). Node 24 · image `node:24.22.1-alpine`.

Dokumen terkait: [`docs/design.md`](docs/design.md) (keputusan desain via ui-ux-pro-max, performa),
[`COMPONENTS.md`](COMPONENTS.md) (asal-usul & lisensi komponen yang disalin), plan
`infra/docs/plans/03-web-client-template.md`.

## Isi

- `/` landing: hero animasi (anime.js timeline + grid animasi), layanan (bento), statistik
  (number ticker) + cara kerja, testimoni (marquee dengan tombol jeda), CTA, footer.
- `/contact`: info kontak + form (default **mati**, tampil tautan email). Aktif bila `CONTACT_ENABLED=true`.
- 404 kustom, `sitemap.xml`, `robots.txt`, OG image, favicon & apple-icon (dibuat dari brand config).
- Light/dark mode (ikut sistem + toggle, disimpan di cookie, tanpa kedip).
- `GET /api/health` → `{"status":"ok"}`; `POST /api/contact` (satu-satunya endpoint mutasi).

## Membuat website client `web-<slug>`

```bash
# 1. Salin template (tanpa history), buat repo baru
git clone --depth 1 git@github-web-starter:BIma-Creative-Tech/web-starter.git web-<slug>
cd web-<slug> && rm -rf .git && git init -b main && git config core.hooksPath .githooks
# 2. Ganti nama paket & image
sed -i 's/"name": "web-starter"/"name": "web-<slug>"/' package.json
sed -i 's#ghcr.io/bima-creative-tech/web-starter#ghcr.io/bima-creative-tech/web-<slug>#' .github/workflows/ci.yml
# 3. Ubah branding (src/config/brand.ts) dan konten (src/config/content.ts)
# 4. npm ci && npm run lint && npm run typecheck && npm test   (lihat "Menjalankan lokal")
git add -A && git commit -m "feat: initial web-<slug> from web-starter"
git remote add origin git@github-web-<slug>:BIma-Creative-Tech/web-<slug>.git
```

## Mengubah branding (satu tempat)

`src/config/brand.ts`:

| Field | Keterangan |
|---|---|
| `name`, `shortName`, `tagline` | Nama brand, huruf logo (inisial), kalimat OG image |
| `colors.light` / `colors.dark` | Token semantik (hex). **Kontras ≥ 4.5:1 diuji `npm test`** |
| `radius`, `stylePreset` | Radius dasar (`rem`/`px`); `"glass"` (frosted) atau `"solid"` |
| `fontHeading`, `fontBody` | `next/font/google` — ganti nama font di import & pemanggilan (nama `variable` jangan diubah) |
| `contact` | Email (juga **penerima** form kontak), telepon, WhatsApp, alamat, jam kerja |
| `seo` | Title, description, keywords (canonical/OG dari `SITE_URL`) |

Teks halaman: `src/config/content.ts` (bahasa Indonesia). Logo gambar: ganti `src/components/brand-mark.tsx`.
Ikon: hanya ikon **gratis** Iconsax — tambahkan nama di `src/components/icon-names.ts`, lalu
`npm run icons` (juga otomatis saat `npm run build`); commit `src/generated/iconsax-icons.json`.
Komponen shadcn baru: `npm run ui:add <nama>` (CLI ter-pin `shadcn@4.21.0`).

## Menjalankan lokal

Host VPS tidak punya Node; pakai container (repo di-mount):

```bash
docker run --rm -it -v "$PWD:/app" -w /app node:24.22.1-bookworm-slim sh -c '
  npm ci && npm run lint && npm run typecheck && npm test'
# dev server
docker run --rm -it -v "$PWD:/app" -w /app -p 127.0.0.1:3000:3000 -e SITE_URL=http://localhost:3000 \
  node:24.22.1-bookworm-slim npm run dev -- -H 0.0.0.0
```

Aktifkan hook gitleaks sekali per clone: `git config core.hooksPath .githooks` (butuh Docker).

## Env (kontrak container)

| Env | Wajib | Default | Keterangan |
|---|---|---|---|
| `SITE_URL` | ya | — | URL publik kanonik. Host mengandung label `staging` atau localhost → `noindex` + robots `Disallow: /` |
| `CONTACT_ENABLED` | tidak | `false` | `true` → form kontak aktif; semua `SMTP_*` di bawah wajib (dicek saat boot, gagal → container exit 1) |
| `SMTP_HOST`, `SMTP_PORT` | bila form aktif | port `587` | 465 = TLS implisit, lainnya STARTTLS wajib |
| `SMTP_USER`, `SMTP_FROM_ADDRESS` | bila form aktif | — | akun SMTP & alamat pengirim; penerima = `brand.contact.email`; Reply-To = pengunjung |
| `SMTP_PASSWORD_FILE` | bila form aktif | — | **path** file password (secret mount read-only), bukan password |

Tidak ada secret di `NEXT_PUBLIC_*` (boot gagal bila nama `NEXT_PUBLIC_*` mirip secret). Lihat `.env.example`.

## Build & jalankan image

```bash
docker build -t web-starter:dev-$(git rev-parse --short HEAD) .
docker run -d --name web --read-only --tmpfs /tmp --tmpfs /app/.next/cache \
  -u 1001:1001 --cap-drop ALL --security-opt no-new-privileges:true \
  -e SITE_URL=https://www.contoh.id -p 127.0.0.1:3000:3000 web-starter:dev-<sha>
curl -s 127.0.0.1:3000/api/health   # {"status":"ok"}
```

Kontrak runtime (dipakai `templates/web-client` di repo infra): port **3000** (`HOSTNAME=0.0.0.0`),
uid:gid **1001:1001**, rootfs read-only — hanya `/tmp` dan `/app/.next/cache` yang writable (tmpfs),
healthcheck compose:
`node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"`.
Image tanpa npm/devDeps/`sharp` (optimasi `next/image` dimatikan: `images.unoptimized`).

## Keamanan

- CSP per request (nonce, `src/proxy.ts`): `script-src 'self' 'nonce-…' 'strict-dynamic'`,
  `style-src 'self' 'unsafe-inline'` (disetujui user; hanya style — Motion/anime.js menulis
  atribut style), `object-src 'none'`, `frame-ancestors 'none'`, dll. Header statis lain di
  `next.config.ts`; HSTS di Traefik. Semua halaman dirender dinamis (nonce).
- **Tidak ada Server Action.** Form kontak → Route Handler `POST /api/contact` dengan body JSON
  (fetch) atau `multipart/form-data` (fallback tanpa JS); `text/plain` ditolak 415 (CrowdSec
  AppSec CRS 920420 memblokir POST text/plain). Cek `Origin` (CSRF), batas body 16 KB, honeypot,
  rate limit per IP (5/10 menit) + global (100/jam), validasi Zod server-side, pesan error generik.
  Traefik me-rate-limit `/contact` & `/api/contact` — jangan tambah endpoint POST lain tanpa
  koordinasi infra.
- IP klien = entri `X-Forwarded-For` paling kanan (ditambahkan Traefik).

## CI (`.github/workflows/ci.yml`)

actionlint · gitleaks (full history) · Semgrep (OWASP, TS, JS, React, Next.js, Dockerfile, secrets)
· Trivy fs + config · Hadolint · lint/typecheck/test/`npm audit --omit=dev`/build · build image →
Trivy image (gagal HIGH/CRITICAL) → smoke test kontrak → push `ghcr.io/bima-creative-tech/web-starter`
(`:sha-<12>` di `main`, `:X.Y.Z` untuk tag `vX.Y.Z` yang sama dengan `package.json`).
Semua action di-pin SHA, semua tool image di-pin digest.
