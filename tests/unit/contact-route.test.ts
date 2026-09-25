import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Space_Grotesk: () => ({ variable: "v1", className: "c1", style: {} }),
  DM_Sans: () => ({ variable: "v2", className: "c2", style: {} }),
}));
const sendContactMail = vi.fn(async () => {});
vi.mock("@/lib/mailer", () => ({ sendContactMail }));

const SITE = "https://www.contoh.id";
const valid = { name: "Budi", email: "budi@example.com", subject: "Halo tim", message: "Saya ingin konsultasi website." };

function req(body: string, headers: Record<string, string> = {}): Request {
  return new Request(`${SITE}/api/contact`, {
    method: "POST",
    body,
    headers: {
      origin: SITE,
      accept: "application/json",
      "content-type": "application/json",
      "content-length": String(Buffer.byteLength(body)),
      "x-forwarded-for": "198.51.100.7",
      ...headers,
    },
  });
}

async function load(env: Record<string, string>) {
  vi.resetModules();
  vi.unstubAllEnvs();
  for (const [k, v] of Object.entries({ SITE_URL: SITE, ...env })) vi.stubEnv(k, v);
  return import("@/app/api/contact/route");
}

const ENABLED = {
  CONTACT_ENABLED: "true",
  SMTP_HOST: "mail.example.com",
  SMTP_USER: "web@example.com",
  SMTP_FROM_ADDRESS: "web@example.com",
  SMTP_PASSWORD_FILE: "/run/secrets/smtp",
};

describe("POST /api/contact", () => {
  beforeEach(() => sendContactMail.mockClear());

  it("404 bila CONTACT_ENABLED tidak aktif (default)", async () => {
    const { POST } = await load({});
    const res = await POST(req(JSON.stringify(valid)));
    expect(res.status).toBe(404);
    expect(sendContactMail).not.toHaveBeenCalled();
  });

  it("valid → 200 sent, email dikirim ke kontak brand", async () => {
    const { POST } = await load(ENABLED);
    const res = await POST(req(JSON.stringify(valid)));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "sent" });
    expect(sendContactMail).toHaveBeenCalledTimes(1);
  });

  it("text/plain → 415 (tidak pernah diterima)", async () => {
    const { POST } = await load(ENABLED);
    const res = await POST(req(JSON.stringify(valid), { "content-type": "text/plain;charset=UTF-8" }));
    expect(res.status).toBe(415);
  });

  it("Origin lintas situs → 403", async () => {
    const { POST } = await load(ENABLED);
    const res = await POST(req(JSON.stringify(valid), { origin: "https://evil.example" }));
    expect(res.status).toBe(403);
  });

  it("body terlalu besar → 413; tanpa Content-Length → 411", async () => {
    const { POST } = await load(ENABLED);
    const big = JSON.stringify({ ...valid, message: "x".repeat(20_000) });
    expect((await POST(req(big))).status).toBe(413);
    const r = req(JSON.stringify(valid));
    const noLen = new Request(r.url, { method: "POST", body: JSON.stringify(valid), headers: { origin: SITE, accept: "application/json", "content-type": "application/json" } });
    expect((await POST(noLen)).status).toBe(411);
  });

  it("invalid → 422 dengan fieldErrors; JSON rusak → 422", async () => {
    const { POST } = await load(ENABLED);
    const res = await POST(req(JSON.stringify({ ...valid, email: "x" })));
    expect(res.status).toBe(422);
    expect((await res.json()).fieldErrors.email).toBeDefined();
    expect((await POST(req("{bukan json", { "x-forwarded-for": "198.51.100.8" }))).status).toBe(422);
  });

  it("honeypot → 200 'sent' palsu, email TIDAK dikirim", async () => {
    const { POST } = await load(ENABLED);
    const res = await POST(req(JSON.stringify({ ...valid, website: "spam" }), { "x-forwarded-for": "198.51.100.9" }));
    expect(res.status).toBe(200);
    expect(sendContactMail).not.toHaveBeenCalled();
  });

  it("rate limit per IP → 429 + Retry-After", async () => {
    const { POST } = await load(ENABLED);
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) statuses.push((await POST(req(JSON.stringify(valid), { "x-forwarded-for": "203.0.113.50" }))).status);
    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    const last = await POST(req(JSON.stringify(valid), { "x-forwarded-for": "203.0.113.50" }));
    expect(last.status).toBe(429);
    expect(Number(last.headers.get("retry-after"))).toBeGreaterThan(0);
  });

  it("fallback tanpa JS (multipart, tanpa Accept JSON) → 303 ke /contact?status=sent", async () => {
    const { POST } = await load(ENABLED);
    const fd = new FormData();
    for (const [k, v] of Object.entries(valid)) fd.set(k, v);
    const probe = new Request(`${SITE}/api/contact`, { method: "POST", body: fd });
    const buf = await probe.arrayBuffer();
    const res = await POST(
      new Request(`${SITE}/api/contact`, {
        method: "POST",
        body: buf,
        headers: {
          origin: SITE,
          "content-type": probe.headers.get("content-type")!,
          "content-length": String(buf.byteLength),
          "x-forwarded-for": "198.51.100.10",
        },
      }),
    );
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/contact?status=sent#form");
  });

  it("SMTP gagal → 502 error generik", async () => {
    const { POST } = await load(ENABLED);
    sendContactMail.mockRejectedValueOnce(new Error("ECONNREFUSED 10.0.0.1"));
    const res = await POST(req(JSON.stringify(valid), { "x-forwarded-for": "198.51.100.11" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ status: "error" });
  });
});
