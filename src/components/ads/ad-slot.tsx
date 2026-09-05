import { cn } from "@/lib/utils";

const SIZES = {
  leaderboard: "h-24 sm:h-28",
  banner: "h-32",
  square: "h-64",
};

export function AdSlot({
  label = "Advertisement",
  size = "banner",
  className,
}: {
  label?: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-surface-muted text-muted",
        SIZES[size],
        className
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      <span className="text-xs">Ad space — connect an ad network to fill this slot</span>
    </div>
  );
}
