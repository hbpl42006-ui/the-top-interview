import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

const CONFIG = {
  Verified: { icon: ShieldCheck, className: "bg-green-600/10 text-green-700 dark:text-green-400 border-green-600/30" },
  "Under Review": { icon: ShieldQuestion, className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30" },
  Disputed: { icon: ShieldAlert, className: "bg-brand/10 text-brand border-brand/30" },
} as const;

export function FactCheckBadge({ status }: { status: keyof typeof CONFIG }) {
  const { icon: Icon, className } = CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-bold", className)}>
      <Icon size={14} /> Fact Check: {status}
    </span>
  );
}
