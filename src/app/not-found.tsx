import Link from "next/link";
import { notFoundPage } from "@/config/content";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="bg-linear-to-br from-primary to-accent bg-clip-text font-heading text-8xl font-bold text-transparent" aria-hidden="true">
        404
      </p>
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{notFoundPage.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{notFoundPage.description}</p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">
          <Icon name="home-2" size={18} />
          {notFoundPage.cta}
        </Link>
      </Button>
    </div>
  );
}
