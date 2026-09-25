import { z } from "zod";

/** Validasi form kontak (server-side, CLAUDE.md §3.6). Pesan error berbahasa Indonesia. */

/** Nama field honeypot — harus kosong; diisi = bot. Nama dibuat tidak mencurigakan bagi bot. */
export const HONEYPOT_FIELD = "website";

// Tolak CR/LF di field satu baris (mencegah header injection bila dipakai di header email).
const singleLine = (max: number, label: string) =>
  z
    .string({ message: `${label} wajib diisi` })
    .trim()
    .min(1, `${label} wajib diisi`)
    .max(max, `${label} maksimal ${max} karakter`)
    .refine((v) => !/[\r\n]/.test(v), `${label} tidak boleh berisi baris baru`);

export const contactSchema = z.object({
  name: singleLine(100, "Nama").pipe(z.string().min(2, "Nama minimal 2 karakter")),
  email: z
    .string({ message: "Email wajib diisi" })
    .trim()
    .max(254, "Email terlalu panjang")
    .pipe(z.email({ message: "Format email tidak valid" })),
  phone: z
    .string()
    .trim()
    .max(20, "Nomor telepon terlalu panjang")
    .refine((v) => v === "" || /^\+?[0-9 ()-]{6,20}$/.test(v), "Nomor telepon tidak valid")
    .optional()
    .transform((v) => (v ? v : undefined)),
  subject: singleLine(150, "Subjek").pipe(z.string().min(3, "Subjek minimal 3 karakter")),
  message: z
    .string({ message: "Pesan wajib diisi" })
    .trim()
    .min(10, "Pesan minimal 10 karakter")
    .max(5000, "Pesan maksimal 5000 karakter"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export type ContactParseResult =
  | { ok: true; data: ContactInput }
  | { ok: false; spam: true }
  | { ok: false; spam: false; fieldErrors: Partial<Record<ContactField, string>> };

/** Nilai string dari body JSON (objek) atau FormData; tipe lain → undefined. */
function pick(source: FormData | Record<string, unknown>, key: string): string | undefined {
  const v = source instanceof FormData ? source.get(key) : source[key];
  return typeof v === "string" ? v : undefined;
}

/**
 * Parse body form kontak (JSON objek atau FormData): cek honeypot dulu, lalu Zod.
 * Hanya field yang dikenal yang dibaca; field lain diabaikan.
 */
export function parseContactInput(source: unknown): ContactParseResult {
  if (!(source instanceof FormData) && (typeof source !== "object" || source === null || Array.isArray(source))) {
    return { ok: false, spam: false, fieldErrors: {} };
  }
  const src = source as FormData | Record<string, unknown>;
  const honeypot = pick(src, HONEYPOT_FIELD);
  if (honeypot !== undefined && honeypot.trim() !== "") {
    return { ok: false, spam: true };
  }
  const result = contactSchema.safeParse({
    name: pick(src, "name"),
    email: pick(src, "email"),
    phone: pick(src, "phone"),
    subject: pick(src, "subject"),
    message: pick(src, "message"),
  });
  if (result.success) return { ok: true, data: result.data };
  const fieldErrors: Partial<Record<ContactField, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false, spam: false, fieldErrors };
}
