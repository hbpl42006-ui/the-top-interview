import { fetchApi } from "@/lib/api/client";

export interface SearchResult {
  title: string;
  href: string;
  type: string;
  meta?: string;
}

export async function searchSite(rawQuery: string): Promise<SearchResult[]> {
  const query = rawQuery.trim();
  if (!query) return [];
  return fetchApi<SearchResult[]>(`/api/search/?q=${encodeURIComponent(query)}`);
}
