"use client";

import { useEffect, useState } from "react";
import { MapPin, UserRound } from "lucide-react";

type PublicVoiceSubmission = {
  id: string;
  name: string;
  location: string;
  category: string;
  description: string;
  mediaUrl: string | null;
  submittedAt: string;
};

function isVideoUrl(url: string) {
  return (
    url.includes("/video/upload/") ||
    /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url)
  );
}

export function PublishedPublicVoice() {
  const [items, setItems] = useState<PublicVoiceSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/public-voice", {
          method: "GET",
          cache: "no-store",
        });

        const contentType =
          response.headers.get("content-type") ?? "";

        if (!contentType.includes("application/json")) {
          throw new Error("Invalid server response.");
        }

        const result = await response.json();

        if (!response.ok || result?.success === false) {
          throw new Error(
            result?.error?.message ||
              result?.error ||
              "Failed to load community stories."
          );
        }

        if (!cancelled) {
          setItems(
            Array.isArray(result?.data) ? result.data : []
          );
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load community stories."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-muted">
        Loading community stories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border p-5 text-center text-sm text-muted">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border p-8 text-center">
        <p className="font-semibold">
          No published stories yet.
        </p>

        <p className="mt-1 text-sm text-muted">
          Approved community submissions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-xl border border-border bg-surface"
        >
          {item.mediaUrl &&
            (isVideoUrl(item.mediaUrl) ? (
              <video
                src={item.mediaUrl}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full bg-black object-contain"
              />
            ) : (
              <img
                src={item.mediaUrl}
                alt={`Public Voice submission by ${item.name}`}
                className="max-h-[520px] w-full object-cover"
              />
            ))}

          <div className="p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
                {item.category}
              </span>

              <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">
                Public Voice
              </span>
            </div>

            <p className="whitespace-pre-line text-sm leading-6 sm:text-base">
              {item.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <UserRound size={14} />
                {item.name}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {item.location}
              </span>

              <span>
                {new Date(item.submittedAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}