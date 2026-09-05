"use client";

import { Play, Pause } from "lucide-react";
import { PodcastEpisode } from "@/lib/types";
import { usePodcastPlayer } from "@/components/podcast/podcast-player-context";

export function PodcastPlayButton({ episode }: { episode: PodcastEpisode }) {
  const { currentEpisode, isPlaying, play } = usePodcastPlayer();
  const isActive = currentEpisode?.slug === episode.slug;

  return (
    <button
      onClick={() => play(episode)}
      className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark"
    >
      {isActive && isPlaying ? <Pause size={16} /> : <Play size={16} />}
      {isActive && isPlaying ? "Pause Episode" : "Play Episode"}
    </button>
  );
}
