"use client";

import { useState } from "react";
import { Video } from "@/lib/types";
import { VideoCard } from "@/components/cards/video-card";
import { cn } from "@/lib/utils";

const FILTERS = [
  { label: "All", value: "All" },
  { label: "Ground Report", value: "ground-report" },
  { label: "Interview", value: "interview" },
  { label: "News", value: "news" },
  { label: "Podcast", value: "podcast" },
  { label: "Special Report", value: "special-report" },
];

export function VideoFilterGrid({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? videos : videos.filter((v) => v.category === active);

  return (
    <div>
      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition",
              active === f.value ? "border-brand bg-brand text-white" : "border-border text-muted hover:border-brand hover:text-brand"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">No videos in this category yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((v) => (
            <VideoCard key={v.slug} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}
