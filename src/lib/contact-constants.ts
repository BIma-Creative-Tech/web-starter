/**
 * Konstanta form kontak yang dipakai client DAN server. Sengaja terpisah dari contact-schema.ts
 * agar form (client component) tidak menarik zod ke bundle browser (terukur ±90 KB gzip).
 */
export const HONEYPOT_FIELD = "website";
