import { cn } from "@/lib/utils";

export function Logo({ className, mark = true }: { className?: string; mark?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      {mark && (
        <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden>
          <rect width="40" height="40" rx="6" fill="var(--brand)" />
          <rect x="17.5" y="8" width="5" height="15" rx="2.5" fill="white" />
          <path
            d="M12 18.5C12 23.5 15.5 27 20 27C24.5 27 28 23.5 28 18.5"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="18.5" y="27" width="3" height="5" fill="white" />
          <rect x="14.5" y="32" width="11" height="2.2" rx="1.1" fill="white" />
        </svg>
      )}
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.15rem] font-extrabold tracking-tight text-foreground sm:text-xl">
          THE TOP <span className="text-brand">INTERVIEW</span>
        </span>
        <span className="hidden text-[9px] font-bold uppercase tracking-[0.18em] text-muted sm:block">
          Ground Reports &middot; Real Voices
        </span>
      </span>
    </span>
  );
}
