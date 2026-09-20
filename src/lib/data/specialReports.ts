import { fetchApi } from "@/lib/api/client";
import { SpecialReport } from "@/lib/types";
import { safeImageUrl } from "@/lib/media-url";

function mapSpecialReport(s: any): SpecialReport {
  return {
    slug: s.slug,
    title: s.title,
    dek: s.dek,
    image: safeImageUrl(s.image),
    location: s.location,
    publishedAt: s.publishedAt || s.createdAt,
    chapters: s.chapters || [],
    timeline: s.timeline || [],
    views: s.views,
  };
}

export async function getAllSpecialReports(): Promise<SpecialReport[]> {
  try {
    const data = await fetchApi<any>('/api/news/special-reports/');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapSpecialReport);
  } catch (e) {
    return [];
  }
}

export interface AdminSpecialReportRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  views: number;
  location: string;
  image: string;
  dek: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllSpecialReportsForAdmin(token?: string): Promise<AdminSpecialReportRow[]> {
  try {
    const data = await fetchApi<any>('/api/news/special-reports/', { token });
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
      location: r.location || "",
      image: r.image || "",
      dek: r.dek || "",
    }));
  } catch (e) {
    return [];
  }
}

export async function getSpecialReportBySlug(slug: string): Promise<SpecialReport | undefined> {
  try {
    const data = await fetchApi<any>(`/api/news/special-reports/?slug=${slug}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    if (!rows.length) return undefined;
    return mapSpecialReport(rows[0]);
  } catch (e) {
    return undefined;
  }
}
