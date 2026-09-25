import { describe, expect, it } from "vitest";
import { parseEnv } from "@/lib/env";

describe("parseEnv (kontrak env container)", () => {
  it("SITE_URL wajib", () => {
    expect(() => parseEnv({})).toThrow(/SITE_URL/);
  });

  it("default: CONTACT_ENABLED=false, SMTP_PORT=587; trailing slash dibuang", () => {
    const env = parseEnv({ SITE_URL: "https://www.contoh.id/" });
    expect(env.SITE_URL).toBe("https://www.contoh.id");
    expect(env.CONTACT_ENABLED).toBe(false);
    expect(env.SMTP_PORT).toBe(587);
  });

  it("CONTACT_ENABLED=true mewajibkan SMTP_* (tanpa mencetak nilai)", () => {
    expect(() => parseEnv({ SITE_URL: "http://localhost", CONTACT_ENABLED: "true" })).toThrow(
      /SMTP_HOST.*SMTP_USER.*SMTP_FROM_ADDRESS.*SMTP_PASSWORD_FILE/,
    );
    const env = parseEnv({
      SITE_URL: "http://localhost",
      CONTACT_ENABLED: "true",
      SMTP_HOST: "mail.example.com",
      SMTP_PORT: "465",
      SMTP_USER: "web@example.com",
      SMTP_FROM_ADDRESS: "web@example.com",
      SMTP_PASSWORD_FILE: "/run/secrets/smtp_password",
    });
    expect(env.CONTACT_ENABLED).toBe(true);
    expect(env.SMTP_PORT).toBe(465);
  });

  it("SMTP_PASSWORD_FILE harus path absolut", () => {
    expect(() =>
      parseEnv({
        SITE_URL: "http://localhost",
        CONTACT_ENABLED: "true",
        SMTP_HOST: "h",
        SMTP_USER: "u",
        SMTP_FROM_ADDRESS: "a@example.com",
        SMTP_PASSWORD_FILE: "relatif.txt",
      }),
    ).toThrow(/absolut/);
  });

  it("menolak NEXT_PUBLIC_* yang terlihat seperti secret", () => {
    expect(() => parseEnv({ SITE_URL: "http://localhost", NEXT_PUBLIC_SMTP_PASSWORD: "x" })).toThrow(/NEXT_PUBLIC_SMTP_PASSWORD/);
  });

  it("CONTACT_ENABLED nilai aneh ditolak", () => {
    expect(() => parseEnv({ SITE_URL: "http://localhost", CONTACT_ENABLED: "yes" })).toThrow(/CONTACT_ENABLED/);
  });
});
