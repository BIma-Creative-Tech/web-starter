/**
 * Bento Grid — 21st.dev: https://21st.dev/@dillionverma/components/bento-grid (license: MIT)
 * Author: Dillion Verma / Magic UI. Upstream source: magicuidesign/magicui
 * @ d7207e5692d14c00dceafa8488d6d01f197fa0e4 apps/www/registry/magicui/bento-grid.tsx (MIT).
 * Detail provenance & perubahan: COMPONENTS.md.
 *
 * Adaptasi: warna neutral-* → token brand (kontras ≥ 4.5:1); `@radix-ui/react-icons` diganti
 * <Icon> Iconsax; `Icon` prop → `icon` (nama ikon); `href/cta` opsional; CTA juga muncul saat
 * fokus keyboard (group-focus-within), bukan hanya hover; grid responsif 1 → 3 kolom;
 * permukaan kartu memakai utilitas `surface` (preset glass/solid dari brand).
 */
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className?: string;
  background?: ReactNode;
  icon: IconName;
  description: string;
  href?: string;
  cta?: string;
}

export const BentoGrid = ({ children, className, ...props }: BentoGridProps) => (
  <div className={cn("grid w-full auto-rows-[18rem] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", className)} {...props}>
    {children}
  </div>
);

export const BentoCard = ({ name, className, background, icon, description, href, cta, ...props }: BentoCardProps) => (
  <div
    className={cn(
      "group surface relative flex flex-col justify-between overflow-hidden rounded-2xl",
      "shadow-[0_1px_2px_rgba(15,23,42,.04),0_12px_32px_-12px_rgba(15,23,42,.12)]",
      "dark:shadow-[inset_0_-20px_80px_-20px_rgba(255,255,255,.06)]",
      className,
    )}
    {...props}
  >
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {background}
    </div>
    <div className="relative z-10 mt-auto p-6">
      <div className="flex transform-gpu flex-col gap-2 transition-transform duration-300 motion-safe:lg:group-hover:-translate-y-8 motion-safe:lg:group-focus-within:-translate-y-8">
        <span className="inline-flex size-12 origin-left items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 motion-safe:group-hover:scale-90">
          <Icon name={icon} size={26} type="bulk" />
        </span>
        <h3 className="text-xl font-semibold text-card-foreground">{name}</h3>
        <p className="max-w-lg text-muted-foreground">{description}</p>
      </div>
      {href && cta ? (
        <div className="pointer-events-none mt-3 flex w-full transform-gpu items-center transition-all duration-300 lg:absolute lg:bottom-4 lg:mt-0 lg:translate-y-6 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100">
          <Link href={href} className="pointer-events-auto inline-flex min-h-11 items-center gap-2 font-medium text-primary underline-offset-4 hover:underline">
            {cta}
            <Icon name="arrow-right-02" size={16} />
          </Link>
        </div>
      ) : null}
    </div>
  </div>
);
