import { fetchApi } from "@/lib/api/client";
import { NewsArticle, Category, ContentType } from "@/lib/types";
import { safeImageUrl } from "@/lib/media-url";

function mapArticle(a: any): NewsArticle {
  const type: ContentType = a.category?.name === "Ground Reports" ? "ground-report" : "news";

  return {
    slug: a.slug,
    type,
    headline: a.headline,
    subheadline: a.subheadline ?? "",
    category: (a.category?.name || "") as Category,
    location: a.locationLabel || a.city?.name || undefined,
    state: a.city?.state?.name,
    image: safeImageUrl(a.image),
    videoUrl: a.videoUrl ?? undefined,
    excerpt: a.excerpt,
    body: (a.body || "").split(/\n{2,}/).filter(Boolean),
    quote: a.quoteText ? { text: a.quoteText, attribution: a.quoteAttribution ?? "" } : undefined,
    keyPoints: a.keyPoints ?? undefined,
    reporter: a.reporter?.slug,
    publishedAt: a.publishedAt || a.createdAt,
    updatedAt: a.updatedAt,
    tags: (a.tags || []).map((t: any) => t.name),
    isBreaking: a.isBreaking,
    isFeatured: a.isFeatured,
    factCheck: a.factCheck, // Django serializer should be made to return the display string or we can map it here. Let's assume Django returns display string or we handle it if needed. For now assume raw enum like "VERIFIED", wait, the previous mapped it.
    contentLabel: a.contentLabel,
    views: a.views,
    readMinutes: a.readMinutes,
  };
}

export async function getAllNews(): Promise<NewsArticle[]> {
  try {
    const data = await fetchApi<any>('/api/news/articles/');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapArticle);
  } catch (e) {
    return [];
  }
}

export interface AdminNewsRow {
  id: string;
  slug: string;
  headline: string;
  status: string;
  views: number;
  isBreaking: boolean;
  isFeatured: boolean;
  category: { name: string };
  reporter: { name: string };
  createdAt: Date;
  updatedAt: Date;
  excerpt: string;
  body: string;
  image: string;
  categoryId: string;
  reporterId: string;
}

export async function getAllNewsForAdmin(token?: string): Promise<AdminNewsRow[]> {
  try {
    const data = await fetchApi<any>('/api/news/articles/', { token });
    const rows = Array.isArray(data) ? data : data.results || [];
    // admin table expects raw data similar to Prisma + category.name and reporter.name
    return rows.map((r: any) => ({
      ...r,
      category: r.category || { name: "" },
      reporter: r.reporter || { name: "" },
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
      excerpt: r.excerpt || "",
      body: r.body || "",
      image: r.image || "",
      categoryId: r.category_id || "",
      reporterId: r.reporter_id || "",
    }));
  } catch (e) {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
  try {
    const data = await fetchApi<any>(`/api/news/articles/?slug=${slug}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    if (!rows.length) return undefined;
    return mapArticle(rows[0]);
  } catch (e) {
    return undefined;
  }
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  try {
    const data = await fetchApi<any>('/api/news/articles/?isBreaking=true');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.slice(0, 6).map(mapArticle);
  } catch (e) {
    return [];
  }
}

export async function getFeaturedNews(): Promise<NewsArticle[]> {
  try {
    const data = await fetchApi<any>('/api/news/articles/?isFeatured=true');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.slice(0, 4).map(mapArticle);
  } catch (e) {
    return [];
  }
}

export async function getLatestNews(limit = 8): Promise<NewsArticle[]> {
  try {
    const data = await fetchApi<any>('/api/news/articles/');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.slice(0, limit).map(mapArticle);
  } catch (e) {
    return [];
  }
}

export async function getTrendingNews(limit = 5): Promise<NewsArticle[]> {
  try {
    const data = await fetchApi<any>('/api/news/articles/?ordering=-views');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.slice(0, limit).map(mapArticle);
  } catch (e) {
    return [];
  }
}

export async function getRelatedArticles(article: NewsArticle, limit = 3): Promise<NewsArticle[]> {
  try {
    const data = await fetchApi<any>(`/api/news/articles/?category__name=${encodeURIComponent(article.category)}`);
    let rows = Array.isArray(data) ? data : data.results || [];
    rows = rows.filter((r: any) => r.slug !== article.slug);
    return rows.slice(0, limit).map(mapArticle);
  } catch (e) {
    return [];
  }
}

export async function getArticlesByCategory(category: string): Promise<NewsArticle[]> {
  try {
    const data = await fetchApi<any>(`/api/news/articles/?category__name=${encodeURIComponent(category)}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapArticle);
  } catch (e) {
    return [];
  }
}

export async function getArticlesByState(state: string): Promise<NewsArticle[]> {
  try {
    const data = await fetchApi<any>(`/api/news/articles/?city__state__name=${encodeURIComponent(state)}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapArticle);
  } catch (e) {
    return [];
  }
}

export async function getArticlesByReporter(reporterSlug: string): Promise<NewsArticle[]> {
  try {
    const data = await fetchApi<any>(`/api/news/articles/?reporter__slug=${encodeURIComponent(reporterSlug)}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapArticle);
  } catch (e) {
    return [];
  }
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
  try {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    // Django DRF doesn't use pageSize by default unless configured. Let's pass it anyway or assume 20.
    
    if (category) params.set('category__name', category);
    if (q) params.set('search', q);

    const data = await fetchApi<any>(`/api/news/articles/?${params.toString()}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    const total = data.count || rows.length;
    
    // We slice in memory if DRF returned full list, else we just use rows
    const items = rows.slice(0, pageSize).map(mapArticle);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  } catch (e) {
    return { items: [], total: 0, page, pageSize, totalPages: 1 };
  }
}
