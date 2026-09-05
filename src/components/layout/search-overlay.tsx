"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { POPULAR_SEARCHES } from "@/lib/constants";
import { useSearchResults } from "@/components/search/use-search-results";
import { cn } from "@/lib/utils";

const RECENT_KEY = "tti-recent-searches";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { results } = useSearchResults(query);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      try {
        const stored = localStorage.getItem(RECENT_KEY);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, an external system, when the dialog opens
        if (stored) setRecent(JSON.parse(stored));
      } catch {
        /* localStorage unavailable */
      }
    } else {
      setQuery("");
    }
  }, [open]);

  function commitSearch(term: string) {
    if (!term.trim()) return;
    try {
      const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
      setRecent(next);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* localStorage unavailable */
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-background/98 backdrop-blur-sm">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:py-6">
          <Search size={20} className="shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commitSearch(query)}
            placeholder="Search news, reporters, locations, interviews, podcasts..."
            className="w-full bg-transparent text-lg font-medium text-foreground outline-none placeholder:text-muted sm:text-xl"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-surface-muted"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-6">
        {query.trim() === "" ? (
          <div className="space-y-8">
            {recent.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                  <Clock size={14} /> Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQuery(r)}
                      className="rounded-full border border-border px-3 py-1.5 text-sm transition hover:border-brand hover:text-brand"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                <TrendingUp size={14} /> Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setQuery(r)}
                    className="rounded-full border border-border px-3 py-1.5 text-sm transition hover:border-brand hover:text-brand"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="py-12 text-center text-muted">No results for &ldquo;{query}&rdquo;. Try a different keyword.</p>
        ) : (
          <ul className="divide-y divide-border">
            {results.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  onClick={() => commitSearch(query)}
                  className="flex items-center justify-between gap-4 py-3.5 transition hover:text-brand"
                >
                  <span className="font-medium">{r.title}</span>
                  <span
                    className={cn(
                      "shrink-0 rounded-sm bg-surface-muted px-2 py-0.5 text-[11px] font-bold uppercase text-muted"
                    )}
                  >
                    {r.type}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
