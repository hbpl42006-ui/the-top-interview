import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
  hrefLabel = "View All",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-3 border-b-2 border-charcoal pb-3", className)}>
      <div>
        {eyebrow && (
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand">{eyebrow}</span>
        )}
        <h2 className="font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-muted">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand transition hover:gap-2"
        >
          {hrefLabel}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
