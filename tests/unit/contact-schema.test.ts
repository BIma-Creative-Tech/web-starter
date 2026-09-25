import { describe, expect, it } from "vitest";
import { HONEYPOT_FIELD, parseContactInput } from "@/lib/contact-schema";

const valid = {
  name: "Budi Santoso",
  email: "budi@example.com",
  phone: "+62 812-3456-7890",
  subject: "Tanya paket website",
  message: "Halo, saya ingin tahu estimasi biaya website company profile.",
};

describe("parseContactInput", () => {
  it("menerima input valid (JSON objek) dan men-trim", () => {
    const r = parseContactInput({ ...valid, name: "  Budi Santoso  " });
    expect(r).toEqual({ ok: true, data: { ...valid, name: "Budi Santoso" } });
  });

  it("menerima FormData (fallback multipart tanpa JS)", () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(valid)) fd.set(k, v);
    fd.set(HONEYPOT_FIELD, "");
    expect(parseContactInput(fd).ok).toBe(true);
  });

  it("telepon opsional", () => {
    const r = parseContactInput({ ...valid, phone: "" });
    expect(r.ok && r.data.phone).toBe(undefined);
  });

  it("honeypot terisi → spam", () => {
    expect(parseContactInput({ ...valid, [HONEYPOT_FIELD]: "http://spam" })).toEqual({ ok: false, spam: true });
  });

  it("error per field dalam bahasa Indonesia", () => {
    const r = parseContactInput({ name: "A", email: "bukan-email", subject: "", message: "pendek" });
    expect(r.ok).toBe(false);
    if (r.ok || r.spam) throw new Error("unexpected");
    expect(r.fieldErrors.name).toMatch(/minimal 2/);
    expect(r.fieldErrors.email).toMatch(/email/i);
    expect(r.fieldErrors.subject).toMatch(/wajib/);
    expect(r.fieldErrors.message).toMatch(/minimal 10/);
  });

  it("menolak CR/LF di subjek & nama (header injection)", () => {
    const r = parseContactInput({ ...valid, subject: "Halo\r\nBcc: korban@example.com" });
    expect(r.ok).toBe(false);
    if (r.ok || r.spam) throw new Error("unexpected");
    expect(r.fieldErrors.subject).toMatch(/baris baru/);
  });

  it("menolak input terlalu panjang & tipe bukan string", () => {
    const r = parseContactInput({ ...valid, message: "x".repeat(5001), name: 123 });
    expect(r.ok).toBe(false);
    if (r.ok || r.spam) throw new Error("unexpected");
    expect(r.fieldErrors.message).toMatch(/maksimal 5000/);
    expect(r.fieldErrors.name).toBeDefined();
  });

  it("body bukan objek → invalid", () => {
    for (const bad of [null, "teks", 42, ["a"]]) {
      const r = parseContactInput(bad);
      expect(r.ok).toBe(false);
    }
  });
});
