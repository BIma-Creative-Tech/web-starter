"use client";

/**
 * Form kontak → Route Handler POST /api/contact (BUKAN Server Action — lihat komentar route).
 * - Dengan JS: fetch JSON (`Content-Type: application/json`, non-simple request → CORS preflight
 *   untuk lintas origin; server juga cek Origin).
 * - Tanpa JS: form HTML biasa `multipart/form-data` → server membalas redirect 303 ke
 *   /contact?status=… (PRG). Tidak pernah text/plain.
 * Error per field ditampilkan dekat field (aria-describedby) + ringkasan yang difokuskan.
 */
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactPage } from "@/config/content";
import { HONEYPOT_FIELD } from "@/lib/contact-constants";

type Field = "name" | "email" | "phone" | "subject" | "message";
type FieldErrors = Partial<Record<Field, string>>;
type Status = "idle" | "submitting" | "sent" | "invalid" | "limited" | "error";

const MESSAGES: Record<Exclude<Status, "idle" | "submitting" | "sent">, string> = {
  invalid: "Mohon periksa kembali isian yang ditandai.",
  limited: "Terlalu banyak percobaan. Silakan coba lagi beberapa menit lagi.",
  error: "Maaf, pesan belum terkirim karena gangguan teknis. Silakan coba lagi atau kirim email.",
};

const FIELDS: { name: Field; label: string; type?: string; autoComplete?: string; required?: boolean; min?: number; max: number; hint?: string }[] = [
  { name: "name", label: "Nama lengkap", autoComplete: "name", required: true, min: 2, max: 100 },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true, max: 254 },
  { name: "phone", label: "Nomor telepon (opsional)", type: "tel", autoComplete: "tel", max: 20, hint: "Contoh: +62 812 3456 7890" },
  { name: "subject", label: "Subjek", required: true, min: 3, max: 150 },
];

function initialFromQuery(q?: string): Status {
  return q === "sent" || q === "invalid" || q === "limited" || q === "error" ? q : "idle";
}

export function ContactForm({ queryStatus, fallbackEmail }: { queryStatus?: string; fallbackEmail: string }) {
  const [status, setStatus] = useState<Status>(initialFromQuery(queryStatus));
  const [errors, setErrors] = useState<FieldErrors>({});
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "invalid" || status === "limited" || status === "error") summaryRef.current?.focus();
  }, [status, errors]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const body: Record<string, string> = {};
    for (const key of ["name", "email", "phone", "subject", "message", HONEYPOT_FIELD]) {
      const v = data.get(key);
      if (typeof v === "string") body[key] = v;
    }
    setStatus("submitting");
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as { status?: string; fieldErrors?: FieldErrors };
      if (res.ok && json.status === "sent") {
        form.reset();
        setStatus("sent");
        return;
      }
      if (res.status === 422) {
        setErrors(json.fieldErrors ?? {});
        setStatus("invalid");
        return;
      }
      setStatus(res.status === 429 ? "limited" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="surface flex flex-col items-center gap-4 rounded-2xl p-8 text-center">
        <Icon name="tick-circle" size={48} type="bulk" className="text-primary" />
        <p className="text-lg font-medium">{contactPage.success}</p>
        <Button type="button" variant="outline" onClick={() => setStatus("idle")}>
          Kirim pesan lain
        </Button>
      </div>
    );
  }

  const errorEntries = Object.entries(errors) as [Field, string][];

  return (
    <form
      action="/api/contact"
      method="post"
      encType="multipart/form-data"
      onSubmit={onSubmit}
      className="space-y-5"
      aria-describedby="form-hint"
    >
      <p id="form-hint" className="text-sm text-muted-foreground">
        Field bertanda * wajib diisi.
      </p>

      {status === "invalid" || status === "limited" || status === "error" ? (
        <div
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
          className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm focus:outline-none"
        >
          <p className="flex items-center gap-2 font-semibold text-destructive">
            <Icon name="warning-2" size={18} />
            {MESSAGES[status]}
          </p>
          {errorEntries.length > 0 ? (
            <ul className="mt-2 list-disc pl-6">
              {errorEntries.map(([field, message]) => (
                <li key={field}>
                  <a href={`#${field}`} className="underline underline-offset-2">
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          ) : status === "error" ? (
            <p className="mt-2">
              Email: <a className="underline" href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.name} className="space-y-2">
            <Label htmlFor={f.name}>
              {f.label}
              {f.required ? <span aria-hidden="true">*</span> : null}
            </Label>
            <Input
              id={f.name}
              name={f.name}
              type={f.type ?? "text"}
              autoComplete={f.autoComplete}
              required={f.required}
              minLength={f.min}
              maxLength={f.max}
              aria-invalid={errors[f.name] ? true : undefined}
              aria-describedby={[f.hint ? `${f.name}-hint` : "", errors[f.name] ? `${f.name}-error` : ""].filter(Boolean).join(" ") || undefined}
            />
            {f.hint ? (
              <p id={`${f.name}-hint`} className="text-sm text-muted-foreground">
                {f.hint}
              </p>
            ) : null}
            {errors[f.name] ? (
              <p id={`${f.name}-error`} className="text-sm font-medium text-destructive">
                {errors[f.name]}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Pesan<span aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message ? (
          <p id="message-error" className="text-sm font-medium text-destructive">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: disembunyikan dari pengguna & pembaca layar; bot yang mengisinya diabaikan. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Jangan isi field ini</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Button type="submit" size="lg" disabled={status === "submitting"} aria-busy={status === "submitting"}>
        {status === "submitting" ? "Mengirim…" : "Kirim pesan"}
        <Icon name="send-2" size={18} />
      </Button>
    </form>
  );
}
