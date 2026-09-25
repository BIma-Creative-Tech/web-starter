import { z } from "zod";

/**
 * Env runtime (KONTRAK container — template infra bergantung pada nama-nama ini):
 *   SITE_URL (wajib), CONTACT_ENABLED (default false),
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_FROM_ADDRESS, SMTP_PASSWORD_FILE.
 * Divalidasi saat boot (src/instrumentation.ts). Pesan error hanya menyebut NAMA variabel,
 * tidak pernah nilainya. Password SMTP TIDAK pernah lewat env — hanya path file (secret mount).
 */

const booleanString = z
  .enum(["true", "false", "1", "0", ""], { message: "harus true/false" })
  .optional()
  .transform((v) => v === "true" || v === "1");

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

export const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
    SITE_URL: z
      .url({ protocol: /^https?$/, message: "harus URL http(s), mis. https://www.contoh.co.id" })
      .transform((v) => v.replace(/\/+$/, "")),
    CONTACT_ENABLED: booleanString,
    SMTP_HOST: optionalString,
    SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
    SMTP_USER: optionalString,
    SMTP_FROM_ADDRESS: z.email({ message: "harus alamat email" }).optional(),
    SMTP_PASSWORD_FILE: optionalString,
  })
  .superRefine((env, ctx) => {
    if (!env.CONTACT_ENABLED) return;
    for (const key of ["SMTP_HOST", "SMTP_USER", "SMTP_FROM_ADDRESS", "SMTP_PASSWORD_FILE"] as const) {
      if (!env[key]) {
        ctx.addIssue({ code: "custom", path: [key], message: "wajib bila CONTACT_ENABLED=true" });
      }
    }
    if (env.SMTP_PASSWORD_FILE && !env.SMTP_PASSWORD_FILE.startsWith("/")) {
      ctx.addIssue({ code: "custom", path: ["SMTP_PASSWORD_FILE"], message: "harus path absolut" });
    }
  });

export type Env = z.infer<typeof envSchema>;

const SECRET_LIKE = /(SECRET|PASSWORD|PASSWD|TOKEN|PRIVATE|SMTP|_KEY$|^KEY)/i;

/** Tolak NEXT_PUBLIC_* yang terlihat seperti secret (nilai NEXT_PUBLIC_* di-inline ke bundle browser). */
export function assertNoPublicSecrets(source: Record<string, string | undefined>): void {
  const offenders = Object.keys(source).filter(
    (k) => k.startsWith("NEXT_PUBLIC_") && SECRET_LIKE.test(k.slice("NEXT_PUBLIC_".length)),
  );
  if (offenders.length > 0) {
    throw new Error(`Env tidak valid: variabel publik terlihat seperti secret: ${offenders.join(", ")}`);
  }
}

export function parseEnv(source: Record<string, string | undefined>): Env {
  assertNoPublicSecrets(source);
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const detail = result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ");
    throw new Error(`Env tidak valid: ${detail}`);
  }
  return result.data;
}

let cache: Env | undefined;

/** Env aplikasi (lazy + memo, sehingga `next build` tidak membutuhkan env runtime). */
export function getEnv(): Env {
  cache ??= parseEnv(process.env);
  return cache;
}
