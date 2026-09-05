import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  published: "bg-green-600/10 text-green-700 dark:text-green-400",
  draft: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  scheduled: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  unpublished: "bg-surface-muted text-muted",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  approved: "bg-green-600/10 text-green-700 dark:text-green-400",
  rejected: "bg-brand/10 text-brand",
  reviewed: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  active: "bg-green-600/10 text-green-700 dark:text-green-400",
  paused: "bg-surface-muted text-muted",
  resolved: "bg-green-600/10 text-green-700 dark:text-green-400",
  spam: "bg-brand/10 text-brand",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold capitalize", STYLES[status] ?? "bg-surface-muted text-muted")}>
      {status}
    </span>
  );
}
