"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { PodcastEpisode } from "@/lib/types";

interface PlayerState {
  currentEpisode: PodcastEpisode | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  expanded: boolean;
  play: (episode: PodcastEpisode) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  next: () => void;
  prev: () => void;
  close: () => void;
  setExpanded: (v: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PodcastPlayerContext = createContext<PlayerState | null>(null);

export function PodcastPlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Full catalogue, fetched lazily (once) the first time next/prev is used —
  // most sessions play one episode and never need it.
  const episodesRef = useRef<PodcastEpisode[] | null>(null);

  async function ensureEpisodes(): Promise<PodcastEpisode[]> {
    if (episodesRef.current) return episodesRef.current;
    try {
      const res = await fetch("/api/podcasts/episodes");
      const json = await res.json();
      episodesRef.current = json.success ? json.data : [];
    } catch {
      episodesRef.current = [];
    }
    return episodesRef.current ?? [];
  }

  function play(episode: PodcastEpisode) {
    if (currentEpisode?.slug === episode.slug) {
      togglePlay();
      return;
    }
    setCurrentEpisode(episode);
    setIsPlaying(true);
    setProgress(0);
    requestAnimationFrame(() => {
      if (audioRef.current) {
        audioRef.current.src = episode.audioUrl;
        audioRef.current.play().catch(() => {});
      }
    });
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  function seek(time: number) {
    if (audioRef.current) audioRef.current.currentTime = time;
    setProgress(time);
  }

  function setVolume(v: number) {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }

  async function shift(delta: number) {
    if (!currentEpisode) return;
    const episodes = await ensureEpisodes();
    if (episodes.length === 0) return;
    const idx = episodes.findIndex((e) => e.slug === currentEpisode.slug);
    const nextEpisode = episodes[(idx + delta + episodes.length) % episodes.length];
    play(nextEpisode);
  }

  function close() {
    audioRef.current?.pause();
    setCurrentEpisode(null);
    setIsPlaying(false);
  }

  const value = useMemo(
    () => ({
      currentEpisode,
      isPlaying,
      progress,
      duration,
      volume,
      expanded,
      play,
      togglePlay,
      seek,
      setVolume,
      next: () => void shift(1),
      prev: () => void shift(-1),
      close,
      setExpanded,
      audioRef,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentEpisode, isPlaying, progress, duration, volume, expanded]
  );

  return (
    <PodcastPlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => void shift(1)}
      />
    </PodcastPlayerContext.Provider>
  );
}

export function usePodcastPlayer() {
  const ctx = useContext(PodcastPlayerContext);
  if (!ctx) throw new Error("usePodcastPlayer must be used within PodcastPlayerProvider");
  return ctx;
}
