import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { categorySlug } from "@/lib/utils";

const BASE_URL = "https://www.thetopinterview.com";

// Refresh published URLs without requiring another deployment.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/news",
    "/ground-reports",
    "/interviews",
    "/podcasts",
    "/videos",
    "/special-reports",
    "/category",
    "/location",
    "/trending",
    "/about",
    "/contact",
    "/public-voice",
    "/newsletter",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
    "/editorial-policy",
    "/corrections-policy",
    "/fact-check-policy",
  ].map((path) => ({ url: `${BASE_URL}${path}` }));

  // The public data layer allows PUBLISHED records with a null publishedAt.
  // Also exclude future dates, even if a record was marked PUBLISHED early.
  const publishedWhere = {
    status: "PUBLISHED" as const,
    OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
  };
  const updatedSelect = { slug: true, updatedAt: true } as const;
  const publishedSelect = { slug: true, publishedAt: true } as const;

  // Existing listing helpers load bodies and relations; sitemap queries only
  // select URL and timestamp fields through the shared Prisma singleton.
  // Let database errors propagate rather than caching an incomplete sitemap.
  const [news, groundReports, interviews, episodes, videos, specialReports, categories, states, reporters] =
    await Promise.all([
      prisma.newsArticle.findMany({ where: publishedWhere, select: updatedSelect }),
      prisma.groundReport.findMany({ where: publishedWhere, select: updatedSelect }),
      prisma.interview.findMany({ where: publishedWhere, select: updatedSelect }),
      prisma.podcastEpisode.findMany({ where: publishedWhere, select: publishedSelect }),
      prisma.video.findMany({ where: publishedWhere, select: publishedSelect }),
      prisma.specialReport.findMany({ where: publishedWhere, select: publishedSelect }),
      prisma.category.findMany({ select: { slug: true, name: true } }),
      prisma.state.findMany({ select: { slug: true } }),
      prisma.reporter.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

  function entries(
    path: string,
    rows: { slug: string; updatedAt?: Date; publishedAt?: Date | null }[],
  ): MetadataRoute.Sitemap {
    return rows.filter((row) => row.slug.trim().length > 0).map((row) => {
      const lastModified = row.updatedAt ?? row.publishedAt;
      return {
        url: `${BASE_URL}/${path}/${encodeURIComponent(row.slug)}`,
        ...(lastModified ? { lastModified } : {}),
      };
    });
  }

  // The category route resolves names from CATEGORIES, not arbitrary DB slugs.
  // Keep database slugs only when they resolve to the same category page.
  const routableCategories = categories.filter((category) =>
    CATEGORIES.some((name) => name === category.name && categorySlug(name) === category.slug),
  );

  return [
    ...staticRoutes,
    ...entries("news", news),
    ...entries("ground-report", groundReports),
    ...entries("interview", interviews),
    ...entries("podcast", episodes),
    ...entries("video", videos),
    ...entries("special-report", specialReports),
    ...entries("category", routableCategories),
    ...entries("location", states),
    ...entries("reporter", reporters),
  ];
}
