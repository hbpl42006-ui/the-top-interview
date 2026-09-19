import { fetchApi } from "@/lib/api/client";
import { Reporter } from "@/lib/types";

function mapReporter(r: any): Reporter {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    designation: r.designation,
    location: r.location ? `${r.location.name}, ${r.location.state?.name || ''}` : "",
    bio: r.bio,
    photo: r.photo,
    twitter: r.twitter ?? undefined,
    instagram: r.instagram ?? undefined,
    email: r.email ?? undefined,
    articleCount: r.articleCount || 0,
    groundReportCount: r.groundReportCount || 0,
    interviewCount: r.interviewCount || 0,
  };
}

export async function getAllReporters(): Promise<Reporter[]> {
  try {
    const data = await fetchApi<any>('/api/news/reporters/');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map(mapReporter);
  } catch (error) {
    console.error("Failed to fetch reporters:", error);
    return [];
  }
}

export async function getReporterBySlug(slug: string): Promise<Reporter | undefined> {
  try {
    const data = await fetchApi<any>(`/api/news/reporters/?slug=${slug}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    if (!rows.length) return undefined;
    return mapReporter(rows[0]);
  } catch (error) {
    console.error(`Failed to fetch reporter by slug ${slug}:`, error);
    return undefined;
  }
}
