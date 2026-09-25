# syntax=docker/dockerfile:1
# web-starter — website client Next.js 16 (output: standalone).
# Base `node:24.21.0-alpine` di-pin tag + digest index multi-arch (sama dengan control-plane;
# diverifikasi 2026-09-25 via `docker buildx imagetools inspect`).
#
# KONTRAK runtime (dipakai templates/web-client di repo infra):
#   port 3000 (HOSTNAME=0.0.0.0) · GET /api/health → 200 {"status":"ok"} · uid:gid 1001:1001 ·
#   rootfs read-only; hanya /tmp dan /app/.next/cache yang writable (tmpfs) ·
#   env: SITE_URL (wajib), CONTACT_ENABLED, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_FROM_ADDRESS,
#   SMTP_PASSWORD_FILE.
ARG NODE_IMAGE=node:24.21.0-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1

# ---- deps: dependency lengkap (devDeps dibutuhkan untuk build) ----
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

# ---- build: next build (standalone). next/font mengunduh font Google di tahap ini. ----
FROM ${NODE_IMAGE} AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# sharp (+ libvips @img/*) hanya untuk optimasi next/image, yang dimatikan (images.unoptimized
# di next.config.ts) → dibuang dari standalone (±18 MB).
RUN npm run build \
 && rm -rf .next/standalone/node_modules/sharp .next/standalone/node_modules/@img

# ---- runner: tanpa npm/devDeps, user non-root ----
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

# User non-root (uid/gid 1001); npm/corepack dihapus dari image runtime (tidak dipakai).
RUN addgroup -S -g 1001 nextjs \
 && adduser -S -D -H -u 1001 -G nextjs -s /sbin/nologin nextjs \
 && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
           /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack

# Standalone tidak menyalin public/ dan .next/static → salin manual (docs output.md).
COPY --from=build --chown=root:root /app/.next/standalone ./
COPY --from=build --chown=root:root /app/.next/static ./.next/static
COPY --from=build --chown=root:root /app/public ./public

# File aplikasi milik root (read-only bagi uid 1001). Cache Next → tmpfs di compose.
RUN mkdir -p /app/.next/cache && chown nextjs:nextjs /app/.next/cache

USER 1001:1001
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

CMD ["node", "server.js"]
