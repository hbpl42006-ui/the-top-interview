import { fetchApi } from "@/lib/api/client";
import { Video, ContentType } from "@/lib/types";
import { safeImageUrl } from "@/lib/media-url";

function mapVideo(v: any): Video {
  return {
    slug: v.slug,
    title: v.title,
    category: v.category as ContentType,
    thumbnail: safeImageUrl(v.thumbnail),
    youtubeId: v.youtubeId,
    duration: v.duration,
    views: v.views,
    publishedAt: v.publishedAt || v.createdAt,
  };
}

export async function getAllVideos(limit?: number): Promise<Video[]> {
  try {
    const data = await fetchApi<any>('/api/media_content/videos/');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.slice(0, limit || undefined).map(mapVideo);
  } catch (e) {
    return [];
  }
}

export interface AdminVideoRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  views: number;
  youtubeId: string;
  duration: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllVideosForAdmin(token?: string): Promise<AdminVideoRow[]> {
  try {
    const data = await fetchApi<any>('/api/media_content/videos/', { token });
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map((r: any) => ({
      ...r,
      youtubeId: r.youtubeId || "",
      duration: r.duration || "",
      thumbnail: r.thumbnail || "",
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
    }));
  } catch (e) {
    return [];
  }
}

export async function getVideoBySlug(slug: string): Promise<Video | undefined> {
  try {
    const data = await fetchApi<any>(`/api/media_content/videos/?slug=${slug}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    if (!rows.length) return undefined;
    return mapVideo(rows[0]);
  } catch (e) {
    return undefined;
  }
}

export async function getVideosByCategory(category: string): Promise<Video[]> {
  try {
    const endpoint = category === "All" ? '/api/media_content/videos/' : `/api/media_content/videos/?category=${encodeURIComponent(category)}`;
    const data = await fetchApi<any>(endpoint);
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapVideo);
  } catch (e) {
    return [];
  }
}

export async function getRelatedVideos(current: Video, limit = 4): Promise<Video[]> {
  try {
    const data = await fetchApi<any>(`/api/media_content/videos/?category=${encodeURIComponent(current.category)}`);
    let rows = Array.isArray(data) ? data : data.results || [];
    rows = rows.filter((r: any) => r.slug !== current.slug);
    
    if (rows.length > 0) return rows.slice(0, limit).map(mapVideo);

    const fallbackData = await fetchApi<any>('/api/media_content/videos/');
    let fallbackRows = Array.isArray(fallbackData) ? fallbackData : fallbackData.results || [];
    fallbackRows = fallbackRows.filter((r: any) => r.slug !== current.slug);
    
    return fallbackRows.slice(0, limit).map(mapVideo);
  } catch (e) {
    return [];
  }
}
