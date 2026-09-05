import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NewsArticle, Category, ContentType } from "@/lib/types";

const articleInclude = {
  category: { select: { name: true } },
  city: { select: { name: true, state: { select: { name: true } } } },
  reporter: { select: { slug: true } },
  tags: { select: { name: true } },
} satisfies Prisma.NewsArticleInclude;

type ArticleRow = Prisma.NewsArticleGetPayload<{ include: typeof articleInclude }>;

const FACT_CHECK_DISPLAY: Record<string, NewsArticle["factCheck"]> = {
  VERIFIED: "Verified",
  UNDER_REVIEW: "Under Review",
  DISPUTED: "Disputed",
};

const CONTENT_LABEL_DISPLAY: Record<string, NewsArticle["contentLabel"]> = {
  NEWS: "News",
  OPINION: "Opinion",
  SPONSORED: "Sponsored",
};

function mapArticle(a: ArticleRow): NewsArticle {
  // "Ground Report"-flavoured news pieces still live in the NewsArticle
  // table (they're written stories, not the video-first GroundReport
  // model) — we surface that with a badge, but always link to /news/[slug]
  // since that's the only place this exact content lives.
  const type: ContentType = a.category.name === "Ground Reports" ? "ground-report" : "news";

  return {
    slug: a.slug,
    type,
    headline: a.headline,
    subheadline: a.subheadline ?? "",
    category: a.category.name as Category,
    location: a.locationLabel ?? a.city?.name ?? undefined,
    state: a.city?.state.name,
    image: a.image,
    videoUrl: a.videoUrl ?? undefined,
    excerpt: a.excerpt,
    body: a.body.split(/\n{2,}/).filter(Boolean),
    quote: a.quoteText ? { text: a.quoteText, attribution: a.quoteAttribution ?? "" } : undefined,
    keyPoints: (a.keyPoints as string[] | null) ?? undefined,
    reporter: a.reporter.slug,
    publishedAt: (a.publishedAt ?? a.createdAt).toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    tags: a.tags.map((t) => t.name),
    isBreaking: a.isBreaking,
    isFeatured: a.isFeatured,
    factCheck: a.factCheck ? FACT_CHECK_DISPLAY[a.factCheck] : undefined,
    contentLabel: CONTENT_LABEL_DISPLAY[a.contentLabel],
    views: a.views,
    readMinutes: a.readMinutes,
  };
}

const publishedWhere = { status: "PUBLISHED" as const };

export async function getAllNews(): Promise<NewsArticle[]> {
  const rows = await prisma.newsArticle.findMany({
    where: publishedWhere,
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapArticle);
}

export async function getAllNewsForAdmin() {
  return prisma.newsArticle.findMany({
    include: { category: { select: { name: true } }, reporter: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
  const row = await prisma.newsArticle.findUnique({ where: { slug }, include: articleInclude });
  return row ? mapArticle(row) : undefined;
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  const rows = await prisma.newsArticle.findMany({
    where: { ...publishedWhere, isBreaking: true },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: 6,
  });
  return rows.map(mapArticle);
}

export async function getFeaturedNews(): Promise<NewsArticle[]> {
  const rows = await prisma.newsArticle.findMany({
    where: { ...publishedWhere, isFeatured: true },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: 4,
  });
  return rows.map(mapArticle);
}

export async function getLatestNews(limit = 8): Promise<NewsArticle[]> {
  const rows = await prisma.newsArticle.findMany({
    where: publishedWhere,
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return rows.map(mapArticle);
}

export async function getTrendingNews(limit = 5): Promise<NewsArticle[]> {
  const rows = await prisma.newsArticle.findMany({
    where: publishedWhere,
    include: articleInclude,
    orderBy: { views: "desc" },
    take: limit,
  });
  return rows.map(mapArticle);
}

export async function getRelatedArticles(article: NewsArticle, limit = 3): Promise<NewsArticle[]> {
  const rows = await prisma.newsArticle.findMany({
    where: { ...publishedWhere, slug: { not: article.slug }, category: { name: article.category } },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return rows.map(mapArticle);
}

export async function getArticlesByCategory(category: string): Promise<NewsArticle[]> {
  const rows = await prisma.newsArticle.findMany({
    where: { ...publishedWhere, category: { name: category } },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapArticle);
}

export async function getArticlesByState(state: string): Promise<NewsArticle[]> {
  const rows = await prisma.newsArticle.findMany({
    where: { ...publishedWhere, city: { state: { name: state } } },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapArticle);
}

export async function getArticlesByReporter(reporterSlug: string): Promise<NewsArticle[]> {
  const rows = await prisma.newsArticle.findMany({
    where: { ...publishedWhere, reporter: { slug: reporterSlug } },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapArticle);
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getPaginatedNews({
  page = 1,
  pageSize = 12,
  category,
  q,
}: {
  page?: number;
  pageSize?: number;
  category?: string;
  q?: string;
}): Promise<PaginatedResult<NewsArticle>> {
  const where: Prisma.NewsArticleWhereInput = {
    ...publishedWhere,
    ...(category ? { category: { name: category } } : {}),
    ...(q ? { headline: { contains: q, mode: "insensitive" } } : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.newsArticle.findMany({
      where,
      include: articleInclude,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.newsArticle.count({ where }),
  ]);

  return { items: rows.map(mapArticle), total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}
