import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Interview } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function InterviewCard({ interview }: { interview: Interview }) {
  return (
    <Link
      href={`/interview/${interview.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition hover:border-brand hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-charcoal">
        <Image
          src={interview.thumbnail}
          alt={interview.topic}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 384px"
        />
        <div className="absolute inset-0 bg-black/20" />
        <PlayCircle
          size={44}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/90 transition group-hover:scale-110"
        />
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">
          {interview.duration}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-brand">
            <Image src={interview.guestPhoto} alt={interview.guest} fill className="object-cover" sizes="44px" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{interview.guest}</p>
            <p className="truncate text-xs text-muted">{interview.guestDesignation}</p>
          </div>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground/90 transition group-hover:text-brand">
          {interview.topic}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <Badge variant="outline">{interview.category}</Badge>
          <span className="text-xs text-muted">{formatDate(interview.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
