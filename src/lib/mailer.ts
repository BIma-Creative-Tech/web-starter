import "server-only";
import { readFile } from "node:fs/promises";
import nodemailer from "nodemailer";
import type { ContactInput } from "@/lib/contact-schema";
import type { Env } from "@/lib/env";

/**
 * Kirim pesan form kontak via SMTP (hanya bila CONTACT_ENABLED=true; env sudah divalidasi).
 * Password dibaca dari SMTP_PASSWORD_FILE saat kirim (secret mount), tidak pernah dari env.
 * TLS wajib: port 465 → TLS implisit; port lain → STARTTLS wajib (requireTLS).
 */
export async function sendContactMail(env: Env, to: string, input: ContactInput): Promise<void> {
  if (!env.CONTACT_ENABLED || !env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_FROM_ADDRESS || !env.SMTP_PASSWORD_FILE) {
    throw new Error("SMTP tidak dikonfigurasi");
  }
  const pass = (await readFile(env.SMTP_PASSWORD_FILE, "utf8")).trim();
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    requireTLS: env.SMTP_PORT !== 465,
    auth: { user: env.SMTP_USER, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  const lines = [
    `Nama   : ${input.name}`,
    `Email  : ${input.email}`,
    `Telepon: ${input.phone ?? "-"}`,
    "",
    input.message,
  ];
  // Teks polos saja (tanpa HTML) → tidak ada risiko HTML injection di klien email penerima.
  await transport.sendMail({
    from: env.SMTP_FROM_ADDRESS,
    to,
    replyTo: input.email,
    subject: `[Form Kontak] ${input.subject}`,
    text: lines.join("\n"),
  });
}
