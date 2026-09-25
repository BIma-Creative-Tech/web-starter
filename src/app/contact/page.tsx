import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { contactPage } from "@/config/content";
import { ContactForm } from "@/components/contact/contact-form";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { getEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Kontak",
  description: contactPage.description,
  alternates: { canonical: "/contact" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ContactPage({ searchParams }: Props) {
  const { CONTACT_ENABLED } = getEnv();
  const status = (await searchParams).status;
  const info = [
    { icon: "sms" as const, label: "Email", value: brand.contact.email, href: `mailto:${brand.contact.email}` },
    { icon: "call" as const, label: "Telepon", value: brand.contact.phone, href: `tel:${brand.contact.phone.replace(/[^+0-9]/g, "")}` },
    { icon: "location" as const, label: "Alamat", value: brand.contact.address },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold sm:text-5xl">{contactPage.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{contactPage.description}</p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <aside aria-label="Informasi kontak" className="space-y-4">
          {info.map((item) => (
            <div key={item.label} className="surface flex items-start gap-4 rounded-2xl p-5">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name={item.icon} size={22} type="bulk" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="inline-flex min-h-11 items-center font-medium hover:text-primary">
                    {item.value}
                  </a>
                ) : (
                  <p className="font-medium">{item.value}</p>
                )}
              </div>
            </div>
          ))}
          <p className="text-sm text-muted-foreground">{brand.contact.hours}</p>
        </aside>

        <section id="form" aria-labelledby="form-title" className="surface relative rounded-3xl p-6 sm:p-8">
          {CONTACT_ENABLED ? (
            <>
              <h2 id="form-title" className="mb-6 text-2xl font-bold">
                {contactPage.formTitle}
              </h2>
              <ContactForm queryStatus={typeof status === "string" ? status : undefined} fallbackEmail={brand.contact.email} />
            </>
          ) : (
            <div className="flex flex-col items-start gap-4">
              <h2 id="form-title" className="text-2xl font-bold">
                {contactPage.disabledTitle}
              </h2>
              <p className="text-muted-foreground">{contactPage.disabledText}</p>
              <Button asChild size="lg">
                <a href={`mailto:${brand.contact.email}`}>
                  <Icon name="sms" size={18} />
                  {brand.contact.email}
                </a>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
