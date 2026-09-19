import { fetchApi } from "@/lib/api/client";

export interface CommentRow {
  id: string;
  name: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getApprovedComments(articleSlug: string): Promise<CommentRow[]> {
  try {
    const data = await fetchApi<any>(`/api/news/comments/?article__slug=${articleSlug}&status=APPROVED`);
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map((r: any) => ({
      ...r,
      name: r.authorName || r.name || "",
      message: r.body || r.message || "",
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
    }));
  } catch (e) {
    return [];
  }
}
