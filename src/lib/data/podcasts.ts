import { fetchApi } from "@/lib/api/client";
import { PodcastEpisode } from "@/lib/types";

function mapEpisode(e: any): PodcastEpisode {
  return {
    slug: e.slug,
    episodeNumber: e.episodeNumber,
    title: e.title,
    guest: e.guestName || "",
    cover: e.cover,
    description: e.description,
    duration: e.duration,
    publishedAt: e.publishedAt || e.createdAt,
    audioUrl: e.audioUrl,
    youtubeUrl: e.youtubeUrl ?? undefined,
    spotifyUrl: e.spotifyUrl ?? undefined,
    applePodcastsUrl: e.applePodcastsUrl ?? undefined,
    category: e.category,
    plays: e.plays,
    featured: e.featured,
  };
}

export async function getAllEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const data = await fetchApi<any>('/api/media_content/podcasts/');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapEpisode);
  } catch (e) {
    return [];
  }
}

export interface AdminPodcastRow {
  id: string;
  slug: string;
  episodeNumber: number;
  title: string;
  category: string;
  status: string;
  plays: number;
  guestName: string;
  duration: string;
  audioUrl: string;
  cover: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  youtubeUrl: string;
  spotifyUrl: string;
  applePodcastsUrl: string;
  featured: boolean;
}

export async function getAllEpisodesForAdmin(token?: string): Promise<AdminPodcastRow[]> {
  try {
    const data = await fetchApi<any>('/api/media_content/podcasts/', { token });
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map((r: any) => ({
      ...r,
      guestName: r.guestName || "",
      duration: r.duration || "",
      audioUrl: r.audioUrl || "",
      cover: r.cover || "",
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
      description: r.description || "",
      youtubeUrl: r.youtubeUrl || "",
      spotifyUrl: r.spotifyUrl || "",
      applePodcastsUrl: r.applePodcastsUrl || "",
      featured: r.featured || false,
    }));
  } catch (e) {
    return [];
  }
}

export async function getEpisodeBySlug(slug: string): Promise<PodcastEpisode | undefined> {
  try {
    const data = await fetchApi<any>(`/api/media_content/podcasts/?slug=${slug}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    if (!rows.length) return undefined;
    return mapEpisode(rows[0]);
  } catch (e) {
    return undefined;
  }
}

export async function getLatestEpisodes(limit = 4): Promise<PodcastEpisode[]> {
  try {
    const data = await fetchApi<any>('/api/media_content/podcasts/');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.slice(0, limit).map(mapEpisode);
  } catch (e) {
    return [];
  }
}

export async function getPopularEpisodes(limit = 4): Promise<PodcastEpisode[]> {
  try {
    const data = await fetchApi<any>('/api/media_content/podcasts/?ordering=-plays');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.slice(0, limit).map(mapEpisode);
  } catch (e) {
    return [];
  }
}

export async function getFeaturedEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const data = await fetchApi<any>('/api/media_content/podcasts/?featured=true');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapEpisode);
  } catch (e) {
    return [];
  }
}

export async function getRelatedEpisodes(current: PodcastEpisode, limit = 3): Promise<PodcastEpisode[]> {
  try {
    const data = await fetchApi<any>(`/api/media_content/podcasts/?category=${encodeURIComponent(current.category)}`);
    let rows = Array.isArray(data) ? data : data.results || [];
    rows = rows.filter((r: any) => r.slug !== current.slug);
    
    if (rows.length > 0) return rows.slice(0, limit).map(mapEpisode);

    const fallbackData = await fetchApi<any>('/api/media_content/podcasts/');
    let fallbackRows = Array.isArray(fallbackData) ? fallbackData : fallbackData.results || [];
    fallbackRows = fallbackRows.filter((r: any) => r.slug !== current.slug);
    
    return fallbackRows.slice(0, limit).map(mapEpisode);
  } catch (e) {
    return [];
  }
}

export const podcastCategories = ["Education", "Ground Reports", "Business", "Social Issues", "Politics", "Environment"];
