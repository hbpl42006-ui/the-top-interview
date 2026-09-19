import { fetchApi } from "@/lib/api/client";
import { GroundReport } from "@/lib/types";

function mapGroundReport(g: any): GroundReport {
  return {
    id: g.id,
    slug: g.slug,
    headline: g.headline,
    location: g.locationLabel || g.city?.name || "",
    state: g.city?.state?.name || "",
    reporter: g.reporter?.slug || "",
    reporterName: g.reporter?.name || "",
    category: "Ground Reports",
    image: g.image,
    videoUrl: g.videoUrl ?? undefined,
    excerpt: g.excerpt,
    body: (g.body || "").split(/\n{2,}/).filter(Boolean),
    publishedAt: g.publishedAt || g.createdAt,
    duration: g.duration ?? undefined,
    views: g.views,
    tags: (g.tags || []).map((t: any) => t.name),
    mapQuery: g.mapQuery || "",
  };
}

export async function getAllGroundReports(): Promise<GroundReport[]> {
  try {
    const data = await fetchApi<any>('/api/news/ground-reports/');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapGroundReport);
  } catch (e) {
    return [];
  }
}

export interface AdminGroundReportRow {
  id: string;
  slug: string;
  headline: string;
  status: string;
  views: number;
  city: { name: string };
  reporter: { name: string };
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  excerpt: string;
  body: string;
  image: string;
  cityId: string;
  reporterId: string;
  mapQuery: string;
}

export async function getAllGroundReportsForAdmin(token?: string): Promise<AdminGroundReportRow[]> {
  try {
    const data = await fetchApi<any>('/api/news/ground-reports/', { token });
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map((r: any) => ({
      ...r,
      city: r.city || { name: "" },
      reporter: r.reporter || { name: "" },
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
      publishedAt: new Date(r.publishedAt || r.createdAt),
      excerpt: r.excerpt || "",
      body: r.body || "",
      image: r.image || "",
      cityId: r.city_id || "",
      reporterId: r.reporter_id || "",
      mapQuery: r.mapQuery || "",
    }));
  } catch (e) {
    return [];
  }
}

export async function getGroundReportBySlug(slug: string): Promise<GroundReport | undefined> {
  try {
    const data = await fetchApi<any>(`/api/news/ground-reports/?slug=${slug}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    if (!rows.length) return undefined;
    return mapGroundReport(rows[0]);
  } catch (e) {
    return undefined;
  }
}

export async function getLatestGroundReports(limit = 6): Promise<GroundReport[]> {
  try {
    const data = await fetchApi<any>('/api/news/ground-reports/');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.slice(0, limit).map(mapGroundReport);
  } catch (e) {
    return [];
  }
}

export async function getGroundReportsByReporter(reporterSlug: string): Promise<GroundReport[]> {
  try {
    const data = await fetchApi<any>(`/api/news/ground-reports/?reporter__slug=${encodeURIComponent(reporterSlug)}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapGroundReport);
  } catch (e) {
    return [];
  }
}

export async function getGroundReportsByState(state: string): Promise<GroundReport[]> {
  try {
    const data = await fetchApi<any>(`/api/news/ground-reports/?city__state__name=${encodeURIComponent(state)}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapGroundReport);
  } catch (e) {
    return [];
  }
}

export async function getRelatedGroundReports(current: GroundReport, limit = 3): Promise<GroundReport[]> {
  try {
    const data = await fetchApi<any>(`/api/news/ground-reports/?city__state__name=${encodeURIComponent(current.state)}`);
    let rows = Array.isArray(data) ? data : data.results || [];
    rows = rows.filter((r: any) => r.slug !== current.slug);
    
    if (rows.length > 0) return rows.slice(0, limit).map(mapGroundReport);

    const fallbackData = await fetchApi<any>('/api/news/ground-reports/');
    let fallbackRows = Array.isArray(fallbackData) ? fallbackData : fallbackData.results || [];
    fallbackRows = fallbackRows.filter((r: any) => r.slug !== current.slug);
    
    return fallbackRows.slice(0, limit).map(mapGroundReport);
  } catch (e) {
    return [];
  }
}
