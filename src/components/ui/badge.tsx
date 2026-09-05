import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const variants = {
  brand: "bg-brand text-white",
  outline: "border border-border text-muted",
  charcoal: "bg-charcoal text-background",
  live: "bg-live text-white",
  soft: "bg-surface-muted text-foreground",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = "brand", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
