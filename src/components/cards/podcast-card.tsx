"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { PodcastEpisode } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { usePodcastPlayer } from "@/components/podcast/podcast-player-context";

export function PodcastCard({ episode, large = false }: { episode: PodcastEpisode; large?: boolean }) {
  const { currentEpisode, isPlaying, play } = usePodcastPlayer();
  const isActive = currentEpisode?.slug === episode.slug;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition hover:border-brand hover:shadow-lg">
      <Link href={`/podcast/${episode.slug}`} className="relative block aspect-square w-full overflow-hidden bg-charcoal">
        <Image
          src={episode.cover}
          alt={episode.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes={large ? "(max-width: 768px) 100vw, 480px" : "(max-width: 768px) 50vw, 280px"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-sm bg-brand px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
          Ep. {episode.episodeNumber}
        </span>
        <span className="absolute bottom-3 right-3 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">
          {episode.duration}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[11px] font-bold uppercase tracking-wide text-brand">{episode.category}</span>
        <Link href={`/podcast/${episode.slug}`}>
          <h3 className="line-clamp-2 font-serif text-base font-bold leading-snug transition hover:text-brand">
            {episode.title}
          </h3>
        </Link>
        <p className="text-sm font-medium text-muted">{episode.guest}</p>
        {large && <p className="line-clamp-2 text-sm text-muted">{episode.description}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-muted">{formatDate(episode.publishedAt)}</span>
          <button
            onClick={() => play(episode)}
            className="flex items-center gap-1.5 rounded-full bg-charcoal px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-background transition hover:bg-brand"
          >
            {isActive && isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isActive && isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}
