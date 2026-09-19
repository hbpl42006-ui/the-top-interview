import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/constants";
import { apiResults, fetchApi } from "@/lib/api/client";
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
  const [newsData, groundReportsData, interviewsData, episodesData, videosData, specialReportsData, categoriesData, statesData, reportersData] = await Promise.all([
    fetchApi<SitemapRow[]>("/api/news/articles/?status=PUBLISHED"),
    fetchApi<SitemapRow[]>("/api/news/ground-reports/?status=PUBLISHED"),
    fetchApi<SitemapRow[]>("/api/media_content/interviews/?status=PUBLISHED"),
    fetchApi<SitemapRow[]>("/api/media_content/episodes/?status=PUBLISHED"),
    fetchApi<SitemapRow[]>("/api/media_content/videos/?status=PUBLISHED"),
    fetchApi<SitemapRow[]>("/api/news/special-reports/?status=PUBLISHED"),
    fetchApi<CategoryRow[]>("/api/core/categories/"),
    fetchApi<SitemapRow[]>("/api/core/states/"),
    fetchApi<SitemapRow[]>("/api/news/reporters/"),
  ]);
  const news = apiResults(newsData), groundReports = apiResults(groundReportsData), interviews = apiResults(interviewsData);
  const episodes = apiResults(episodesData), videos = apiResults(videosData), specialReports = apiResults(specialReportsData);
  const categories = apiResults(categoriesData), states = apiResults(statesData), reporters = apiResults(reportersData);

  function entries(
    path: string,
    rows: SitemapRow[],
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

interface SitemapRow { slug: string; updatedAt?: string; publishedAt?: string | null }
interface CategoryRow { slug: string; name: string }
