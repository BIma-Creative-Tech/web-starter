import { brand } from "@/config/brand";

/** Logo sederhana dari inisial brand (ganti dengan SVG logo client bila ada). */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span
        aria-hidden="true"
        className="inline-flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-accent font-heading text-lg font-bold text-primary-foreground shadow-sm"
      >
        {brand.shortName.charAt(0)}
      </span>
    </span>
  );
}
