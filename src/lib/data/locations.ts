import { fetchApi } from "@/lib/api/client";
import { StateInfo } from "@/lib/types";

export async function getAllStates(options: { optional?: boolean; timeoutMs?: number | null } = {}): Promise<StateInfo[]> {
  try {
    const data = await fetchApi<any>('/api/core/states/', { timeoutMs: options.timeoutMs ?? 15000 });
    const rows = Array.isArray(data) ? data : data.results || [];
    
    return rows.map((s: any) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      cities: (s.cities || []).map((c: any) => c.name),
      storyCount: s.storyCount || 0,
    }));
  } catch (error) {
    if (options.optional) return [];
    throw error;
  }
}

export async function getStateBySlug(slug: string): Promise<StateInfo | undefined> {
  try {
    const data = await fetchApi<any>(`/api/core/states/?slug=${slug}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    if (!rows.length) return undefined;
    
    const s = rows[0];
    return {
      id: s.id,
      slug: s.slug,
      name: s.name,
      cities: (s.cities || []).map((c: any) => c.name),
      storyCount: s.storyCount || 0,
    };
  } catch (error) {
    console.error(`Failed to fetch state by slug ${slug}:`, error);
    return undefined;
  }
}
