import Image from "next/image";
import Link from "next/link";
import { MapPin, User, PlayCircle } from "lucide-react";
import { GroundReport } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function GroundReportCard({ report }: { report: GroundReport }) {
  return (
    <Link
      href={`/ground-report/${report.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition hover:border-brand hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-charcoal">
        <Image
          src={report.image}
          alt={report.headline}
          fill
          className="object-cover opacity-90 transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 384px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-sm bg-brand px-2 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
          🔴 Ground Report
        </span>
        {report.duration && (
          <span className="absolute bottom-3 right-3 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            {report.duration}
          </span>
        )}
        <PlayCircle
          size={48}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/90 opacity-0 transition group-hover:opacity-100"
        />
        <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-semibold text-white">
          <MapPin size={13} /> {report.location}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-serif text-lg font-bold leading-snug transition group-hover:text-brand">
          {report.headline}
        </h3>
        <p className="line-clamp-2 mt-2 flex-1 text-sm text-muted">{report.excerpt}</p>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <User size={13} /> {report.reporterName}
          </span>
          <span className="text-xs text-muted">{formatDate(report.publishedAt)}</span>
        </div>
        <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-sm bg-charcoal px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-background transition group-hover:bg-brand">
          Watch Report
        </span>
      </div>
    </Link>
  );
}
