import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Video } from "@/lib/types";
import { formatViews, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const CATEGORY_LABEL: Record<string, string> = {
  "ground-report": "Ground Report",
  interview: "Interview",
  news: "News",
  podcast: "Podcast",
  "special-report": "Special Report",
};

export function VideoCard({ video }: { video: Video }) {
  return (
    <Link href={`/video/${video.slug}`} className="group flex flex-col">
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-charcoal">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 320px"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition group-hover:opacity-100">
          <Play size={40} className="fill-white text-white" />
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold text-white">
          {video.duration}
        </span>
      </div>
      <div className="mt-2.5">
        <Badge variant="outline" className="mb-1.5">
          {CATEGORY_LABEL[video.category]}
        </Badge>
        <h3 className="line-clamp-2 text-sm font-bold leading-snug transition group-hover:text-brand">
          {video.title}
        </h3>
        <p className="mt-1 text-xs text-muted">
          {formatViews(video.views)} views &middot; {timeAgo(video.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
