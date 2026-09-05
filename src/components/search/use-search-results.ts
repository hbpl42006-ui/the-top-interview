"use client";

import { useEffect, useState } from "react";
import type { SearchResult } from "@/lib/search";

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
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const json = await res.json();
        if (!cancelled && json.success) setResults(json.data);
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
