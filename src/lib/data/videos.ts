import { prisma } from "@/lib/prisma";
import { Video, ContentType } from "@/lib/types";
import type { Video as VideoRow } from "@prisma/client";

function mapVideo(v: VideoRow): Video {
  return {
    slug: v.slug,
    title: v.title,
    category: v.category as ContentType,
    thumbnail: v.thumbnail,
    youtubeId: v.youtubeId,
    duration: v.duration,
    views: v.views,
    publishedAt: (v.publishedAt ?? v.createdAt).toISOString(),
  };
}

const publishedWhere = { status: "PUBLISHED" as const };

export async function getAllVideos(limit?: number): Promise<Video[]> {
  const rows = await prisma.video.findMany({
    where: publishedWhere,
    orderBy: { publishedAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
  return rows.map(mapVideo);
}

export async function getAllVideosForAdmin() {
  return prisma.video.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getVideoBySlug(slug: string): Promise<Video | undefined> {
  const row = await prisma.video.findUnique({ where: { slug } });
  return row ? mapVideo(row) : undefined;
}

export async function getVideosByCategory(category: string): Promise<Video[]> {
  const rows = await prisma.video.findMany({
    where: category === "All" ? publishedWhere : { ...publishedWhere, category },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapVideo);
}

export async function getRelatedVideos(current: Video, limit = 4): Promise<Video[]> {
  const sameCategory = await prisma.video.findMany({
    where: { ...publishedWhere, slug: { not: current.slug }, category: current.category },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  if (sameCategory.length > 0) return sameCategory.map(mapVideo);

  const fallback = await prisma.video.findMany({
    where: { ...publishedWhere, slug: { not: current.slug } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return fallback.map(mapVideo);
}
