"use client";

import { useEffect, useState } from "react";
import type { SearchResult } from "@/lib/search";

const searchCache = new Map<string, SearchResult[]>();
const searchRequests = new Map<string, Promise<SearchResult[]>>();

async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  const cached = searchCache.get(query);
  if (cached) return cached;

  const existing = searchRequests.get(query);
  if (existing) return existing;

  const request = fetch(`/api/search?q=${encodeURIComponent(query)}`)
    .then(async (res) => {
      const json = await res.json();
      const results = json.success && Array.isArray(json.data) ? json.data : [];
      searchCache.set(query, results);
      return results;
    })
    .finally(() => searchRequests.delete(query));

  searchRequests.set(query, request);
  return request;
}

export function useSearchResults(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const trimmed = query.trim();

  useEffect(() => {
    if (!trimmed) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard debounced-fetch loading flag; the request is the external system being synced
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const nextResults = await fetchSearchResults(trimmed);
        if (!cancelled) setResults(nextResults);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed]);

  return { results: trimmed ? results : [], loading: trimmed ? loading : false };
}
