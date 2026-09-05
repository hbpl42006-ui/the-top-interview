import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className={cn("rounded-lg border border-border p-5", accent ? "bg-brand text-white" : "bg-surface")}>
      <p className={cn("text-xs font-bold uppercase tracking-wide", accent ? "text-white/80" : "text-muted")}>
        {label}
      </p>
      <p className="mt-1.5 font-serif text-2xl font-extrabold sm:text-3xl">{value}</p>
      {hint && <p className={cn("mt-1 text-xs", accent ? "text-white/70" : "text-muted")}>{hint}</p>}
    </div>
  );
}
