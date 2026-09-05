import { prisma } from "@/lib/prisma";
import { PodcastEpisode } from "@/lib/types";
import type { PodcastEpisode as PodcastEpisodeRow } from "@prisma/client";

function mapEpisode(e: PodcastEpisodeRow): PodcastEpisode {
  return {
    slug: e.slug,
    episodeNumber: e.episodeNumber,
    title: e.title,
    guest: e.guestName,
    cover: e.cover,
    description: e.description,
    duration: e.duration,
    publishedAt: (e.publishedAt ?? e.createdAt).toISOString(),
    audioUrl: e.audioUrl,
    youtubeUrl: e.youtubeUrl ?? undefined,
    spotifyUrl: e.spotifyUrl ?? undefined,
    applePodcastsUrl: e.applePodcastsUrl ?? undefined,
    category: e.category,
    plays: e.plays,
    featured: e.featured,
  };
}

const publishedWhere = { status: "PUBLISHED" as const };

export async function getAllEpisodes(): Promise<PodcastEpisode[]> {
  const rows = await prisma.podcastEpisode.findMany({ where: publishedWhere, orderBy: { episodeNumber: "desc" } });
  return rows.map(mapEpisode);
}

export async function getAllEpisodesForAdmin() {
  return prisma.podcastEpisode.findMany({ orderBy: { episodeNumber: "desc" } });
}

export async function getEpisodeBySlug(slug: string): Promise<PodcastEpisode | undefined> {
  const row = await prisma.podcastEpisode.findUnique({ where: { slug } });
  return row ? mapEpisode(row) : undefined;
}

export async function getLatestEpisodes(limit = 4): Promise<PodcastEpisode[]> {
  const rows = await prisma.podcastEpisode.findMany({
    where: publishedWhere,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return rows.map(mapEpisode);
}

export async function getPopularEpisodes(limit = 4): Promise<PodcastEpisode[]> {
  const rows = await prisma.podcastEpisode.findMany({
    where: publishedWhere,
    orderBy: { plays: "desc" },
    take: limit,
  });
  return rows.map(mapEpisode);
}

export async function getFeaturedEpisodes(): Promise<PodcastEpisode[]> {
  const rows = await prisma.podcastEpisode.findMany({
    where: { ...publishedWhere, featured: true },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapEpisode);
}

export async function getRelatedEpisodes(current: PodcastEpisode, limit = 3): Promise<PodcastEpisode[]> {
  const sameCategory = await prisma.podcastEpisode.findMany({
    where: { ...publishedWhere, slug: { not: current.slug }, category: current.category },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  if (sameCategory.length > 0) return sameCategory.map(mapEpisode);

  const fallback = await prisma.podcastEpisode.findMany({
    where: { ...publishedWhere, slug: { not: current.slug } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return fallback.map(mapEpisode);
}

export const podcastCategories = ["Education", "Ground Reports", "Business", "Social Issues", "Politics", "Environment"];
