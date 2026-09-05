import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  basePath,
  query = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v) params.set(k, v);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-sm border border-border transition",
          page <= 1 ? "pointer-events-none opacity-40" : "hover:border-brand hover:text-brand"
        )}
      >
        <ChevronLeft size={16} />
      </Link>
      <span className="px-3 text-sm text-muted">
        Page <span className="font-bold text-foreground">{page}</span> of {totalPages}
      </span>
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-sm border border-border transition",
          page >= totalPages ? "pointer-events-none opacity-40" : "hover:border-brand hover:text-brand"
        )}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
