import { fetchApi } from "@/lib/api/client";

export async function getActiveAdsForPlacement(placement: string) {
  try {
    const data = await fetchApi<any>(`/api/marketing/ads/?placement=${placement}&isActive=true`);
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map((r: any) => ({
      ...r,
      startDate: r.startDate ? new Date(r.startDate) : null,
      endDate: r.endDate ? new Date(r.endDate) : null,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
    }));
  } catch (e) {
    return [];
  }
}

export async function getAllAds(token?: string) {
  try {
    const data = await fetchApi<any>('/api/marketing/ads/', { token });
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map((r: any) => ({
      ...r,
      startDate: r.startDate ? new Date(r.startDate) : null,
      endDate: r.endDate ? new Date(r.endDate) : null,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
    }));
  } catch (e) {
    return [];
  }
}
