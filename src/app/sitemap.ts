import type { MetadataRoute } from "next";
import { SITE, CATEGORIES } from "@/lib/constants";
import { getAllNews } from "@/lib/data/news";
import { getAllGroundReports } from "@/lib/data/groundReports";
import { getAllInterviews } from "@/lib/data/interviews";
import { getAllEpisodes } from "@/lib/data/podcasts";
import { getAllVideos } from "@/lib/data/videos";
import { getAllSpecialReports } from "@/lib/data/specialReports";
import { getAllStates } from "@/lib/data/locations";
import { getAllReporters } from "@/lib/data/reporters";
import { categorySlug } from "@/lib/utils";

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
    "/search",
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
  ].map((path) => ({ url: `${SITE.url}${path}`, lastModified: new Date() }));

  const [newsArticles, groundReportRows, interviewRows, episodeRows, videoRows, specialReportRows, states, reporters] =
    await Promise.all([
      getAllNews(),
      getAllGroundReports(),
      getAllInterviews(),
      getAllEpisodes(),
      getAllVideos(),
      getAllSpecialReports(),
      getAllStates(),
      getAllReporters(),
    ]);

  const news = newsArticles.map((a) => ({
    url: `${SITE.url}/news/${a.slug}`,
    lastModified: new Date(a.updatedAt ?? a.publishedAt),
  }));
  const groundReports = groundReportRows.map((r) => ({
    url: `${SITE.url}/ground-report/${r.slug}`,
    lastModified: new Date(r.publishedAt),
  }));
  const interviews = interviewRows.map((i) => ({
    url: `${SITE.url}/interview/${i.slug}`,
    lastModified: new Date(i.publishedAt),
  }));
  const episodes = episodeRows.map((e) => ({
    url: `${SITE.url}/podcast/${e.slug}`,
    lastModified: new Date(e.publishedAt),
  }));
  const videos = videoRows.map((v) => ({
    url: `${SITE.url}/video/${v.slug}`,
    lastModified: new Date(v.publishedAt),
  }));
  const specialReports = specialReportRows.map((s) => ({
    url: `${SITE.url}/special-report/${s.slug}`,
    lastModified: new Date(s.publishedAt),
  }));
  const categories = CATEGORIES.map((c) => ({
    url: `${SITE.url}/category/${categorySlug(c)}`,
    lastModified: new Date(),
  }));
  const locations = states.map((s) => ({ url: `${SITE.url}/location/${s.slug}`, lastModified: new Date() }));
  const reporterPages = reporters.map((r) => ({ url: `${SITE.url}/reporter/${r.slug}`, lastModified: new Date() }));

  return [
    ...staticRoutes,
    ...news,
    ...groundReports,
    ...interviews,
    ...episodes,
    ...videos,
    ...specialReports,
    ...categories,
    ...locations,
    ...reporterPages,
  ];
}
