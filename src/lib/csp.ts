/**
 * Content-Security-Policy ber-nonce (pola docs Next 16: guides/content-security-policy.md).
 *
 * - script-src: nonce per request + 'strict-dynamic' (tanpa 'unsafe-inline').
 * - style-src: 'unsafe-inline' DISETUJUI user (plan 03 §7 #3) karena Motion/anime.js menulis
 *   atribut `style` inline. Sengaja TANPA nonce di style-src — menurut CSP3, kehadiran nonce
 *   membuat browser mengabaikan 'unsafe-inline'.
 * - HSTS di-set Traefik, bukan di sini.
 */
export function buildCsp(nonce: string, isDev = false): string {
  if (!/^[A-Za-z0-9+/=_-]{16,}$/.test(nonce)) {
    throw new Error("nonce tidak valid");
  }
  const directives = [
    "default-src 'self'",
    // 'unsafe-eval' hanya di `next dev` (React memakai eval untuk debugging; docs CSP Next).
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];
  return directives.join("; ");
}

/** 128-bit nonce acak (Web Crypto; jalan di runtime Node maupun edge). */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
