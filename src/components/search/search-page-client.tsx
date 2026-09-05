"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { POPULAR_SEARCHES } from "@/lib/constants";
import { useSearchResults } from "@/components/search/use-search-results";

export function SearchPageClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const { results } = useSearchResults(query);

  return (
    <div>
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news, reporters, locations, interviews..."
          className="w-full rounded-full border border-border bg-surface py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-brand"
        />
      </div>

      {query.trim() === "" ? (
        <div className="mt-8">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Popular Searches</h2>
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
      ) : results.length === 0 ? (
        <p className="mt-10 text-center text-muted">No results for &ldquo;{query}&rdquo;.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border">
          {results.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="flex items-center justify-between gap-4 py-4 transition hover:text-brand">
                <span className="font-medium">{r.title}</span>
                <span className="shrink-0 rounded-sm bg-surface-muted px-2 py-0.5 text-[11px] font-bold uppercase text-muted">
                  {r.type}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
