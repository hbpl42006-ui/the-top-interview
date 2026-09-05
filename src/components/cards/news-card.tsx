import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function NewsCard({
  article,
  variant = "default",
}: {
  article: NewsArticle;
  variant?: "default" | "horizontal" | "compact";
}) {
  const href = `/news/${article.slug}`;

  if (variant === "compact") {
    return (
      <Link href={href} className="group flex gap-3">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
          <Image src={article.image} alt={article.headline} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="96px" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wide text-brand">{article.category}</span>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition group-hover:text-brand">
            {article.headline}
          </h3>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={href} className="group flex flex-col gap-3 sm:flex-row">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-md bg-surface-muted sm:w-56">
          <Image src={article.image} alt={article.headline} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="224px" />
          {article.isBreaking && (
            <Badge variant="live" className="absolute left-2 top-2">
              Live
            </Badge>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="outline">{article.category}</Badge>
            {article.location && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <MapPin size={12} /> {article.location}
              </span>
            )}
          </div>
          <h3 className="line-clamp-2 font-serif text-lg font-bold leading-snug transition group-hover:text-brand">
            {article.headline}
          </h3>
          <p className="line-clamp-2 mt-1 text-sm text-muted">{article.excerpt}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <Clock size={12} /> {timeAgo(article.publishedAt)}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={cn("group flex flex-col")}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-surface-muted">
        <Image
          src={article.image}
          alt={article.headline}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {article.isBreaking && (
          <Badge variant="live" className="absolute left-2 top-2">
            Live
          </Badge>
        )}
        <Badge variant="brand" className="absolute bottom-2 left-2">
          {article.category}
        </Badge>
      </div>
      <div className="mt-3">
        {article.location && (
          <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-muted">
            <MapPin size={12} /> {article.location}
          </span>
        )}
        <h3 className="line-clamp-2 font-serif text-base font-bold leading-snug transition group-hover:text-brand sm:text-lg">
          {article.headline}
        </h3>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <Clock size={12} /> {timeAgo(article.publishedAt)}
        </div>
      </div>
    </Link>
  );
}
