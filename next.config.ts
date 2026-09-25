import type { NextConfig } from "next";

// Docs: node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/
const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  // Template tidak memakai optimasi gambar runtime (aset SVG/CSS; OG image & ikon dibuat saat build).
  // Dengan `unoptimized`, /_next/image tidak dipakai → Dockerfile membuang `sharp` (±18 MB) dari
  // standalone. Bila client butuh next/image teroptimasi: hapus opsi ini DAN baris `rm` sharp di Dockerfile.
  images: { unoptimized: true },
  // Header keamanan statis. CSP ber-nonce diset per request di src/proxy.ts.
  // HSTS ditangani Traefik (CLAUDE.md §3.6).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
