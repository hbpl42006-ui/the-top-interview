import { fetchApi } from "@/lib/api/client";
import { Interview } from "@/lib/types";

function mapInterview(i: any): Interview {
  return {
    id: i.id,
    slug: i.slug,
    guest: i.guest?.name || "",
    guestDesignation: i.guest?.designation || "",
    guestPhoto: i.guest?.photo || "",
    category: i.category,
    topic: i.topic,
    thumbnail: i.thumbnail,
    videoUrl: i.videoUrl ?? undefined,
    duration: i.duration,
    excerpt: i.excerpt,
    body: (i.body || "").split(/\n{2,}/).filter(Boolean),
    publishedAt: i.publishedAt || i.createdAt,
    reporter: i.reporter?.slug || "",
    views: i.views,
    tags: (i.tags || []).map((t: any) => t.name),
  };
}

export async function getAllInterviews(): Promise<Interview[]> {
  try {
    const data = await fetchApi<any>('/api/media_content/interviews/');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapInterview);
  } catch (e) {
    return [];
  }
}

export interface AdminInterviewRow {
  id: string;
  slug: string;
  topic: string;
  status: string;
  views: number;
  category: string;
  guest: { name: string };
  reporter: { name: string };
  createdAt: Date;
  updatedAt: Date;
  excerpt: string;
  body: string;
  thumbnail: string;
  reporterId: string;
}

export async function getAllInterviewsForAdmin(token?: string): Promise<AdminInterviewRow[]> {
  try {
    const data = await fetchApi<any>('/api/media_content/interviews/', { token });
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map((r: any) => ({
      ...r,
      guest: r.guest || { name: "" },
      reporter: r.reporter || { name: "" },
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
      excerpt: r.excerpt || "",
      body: r.body || "",
      thumbnail: r.thumbnail || "",
      reporterId: r.reporter_id || "",
    }));
  } catch (e) {
    return [];
  }
}

export async function getInterviewBySlug(slug: string): Promise<Interview | undefined> {
  try {
    const data = await fetchApi<any>(`/api/media_content/interviews/?slug=${slug}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    if (!rows.length) return undefined;
    return mapInterview(rows[0]);
  } catch (e) {
    return undefined;
  }
}

export async function getInterviewsByReporter(reporterSlug: string): Promise<Interview[]> {
  try {
    const data = await fetchApi<any>(`/api/media_content/interviews/?reporter__slug=${encodeURIComponent(reporterSlug)}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapInterview);
  } catch (e) {
    return [];
  }
}

export async function getLatestInterviews(limit = 6): Promise<Interview[]> {
  try {
    const data = await fetchApi<any>('/api/media_content/interviews/');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.slice(0, limit).map(mapInterview);
  } catch (e) {
    return [];
  }
}

export async function getRelatedInterviews(current: Interview, limit = 3): Promise<Interview[]> {
  try {
    const data = await fetchApi<any>(`/api/media_content/interviews/?category=${encodeURIComponent(current.category)}`);
    let rows = Array.isArray(data) ? data : data.results || [];
    rows = rows.filter((r: any) => r.slug !== current.slug);
    
    if (rows.length > 0) return rows.slice(0, limit).map(mapInterview);

    const fallbackData = await fetchApi<any>('/api/media_content/interviews/');
    let fallbackRows = Array.isArray(fallbackData) ? fallbackData : fallbackData.results || [];
    fallbackRows = fallbackRows.filter((r: any) => r.slug !== current.slug);
    
    return fallbackRows.slice(0, limit).map(mapInterview);
  } catch (e) {
    return [];
  }
}

export const interviewCategories = [
  "Politicians",
  "Government Officials",
  "Entrepreneurs",
  "Teachers",
  "Doctors",
  "Students",
  "Social Workers",
  "Celebrities",
  "Experts",
  "Local Leaders",
  "Common People",
  "Industry Experts",
];
