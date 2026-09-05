"use client";

import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronUp, ChevronDown, X } from "lucide-react";
import { usePodcastPlayer } from "@/components/podcast/podcast-player-context";

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function StickyPlayer() {
  const { currentEpisode, isPlaying, progress, duration, volume, expanded, togglePlay, seek, setVolume, next, prev, close, setExpanded } =
    usePodcastPlayer();

  if (!currentEpisode) return null;

  return (
    <div className="fixed inset-x-0 bottom-14 z-50 border-t border-border bg-surface shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:bottom-0">
      {expanded && (
        <div className="border-b border-border px-4 py-4 sm:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
            <Image
              src={currentEpisode.cover}
              alt={currentEpisode.title}
              width={140}
              height={140}
              className="rounded-lg object-cover shadow-md"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand">
                Episode {currentEpisode.episodeNumber}
              </p>
              <h3 className="font-serif text-lg font-bold">{currentEpisode.title}</h3>
              <p className="text-sm text-muted">{currentEpisode.guest}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2.5 sm:px-6">
        <Image
          src={currentEpisode.cover}
          alt={currentEpisode.title}
          width={44}
          height={44}
          className="hidden shrink-0 rounded object-cover sm:block"
        />
        <div className="hidden min-w-0 shrink-0 sm:block sm:w-40 md:w-56">
          <p className="truncate text-sm font-semibold">{currentEpisode.title}</p>
          <p className="truncate text-xs text-muted">{currentEpisode.guest}</p>
        </div>

        <button onClick={prev} aria-label="Previous episode" className="hidden h-8 w-8 items-center justify-center rounded-full transition hover:bg-surface-muted sm:flex">
          <SkipBack size={16} />
        </button>
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand-dark"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
        <button onClick={next} aria-label="Next episode" className="hidden h-8 w-8 items-center justify-center rounded-full transition hover:bg-surface-muted sm:flex">
          <SkipForward size={16} />
        </button>

        <div className="flex flex-1 items-center gap-2">
          <span className="hidden w-9 shrink-0 text-right text-[11px] tabular-nums text-muted sm:block">
            {formatTime(progress)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-1 w-full flex-1 cursor-pointer accent-brand"
            aria-label="Seek"
          />
          <span className="hidden w-9 shrink-0 text-[11px] tabular-nums text-muted sm:block">
            {formatTime(duration)}
          </span>
        </div>

        <div className="hidden items-center gap-1.5 md:flex">
          <button onClick={() => setVolume(volume > 0 ? 0 : 0.85)} aria-label="Toggle mute">
            {volume > 0 ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 w-16 cursor-pointer accent-brand"
            aria-label="Volume"
          />
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse player" : "Expand player"}
          className="hidden h-8 w-8 items-center justify-center rounded-full transition hover:bg-surface-muted sm:flex"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
        <button onClick={close} aria-label="Close player" className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-surface-muted">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
