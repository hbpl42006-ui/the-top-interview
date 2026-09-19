import { fetchApi } from "@/lib/api/client";
export interface CategoryInfo {
  id: string;
  slug: string;
  name: string;
  storyCount: number;
}

export async function getAllCategories(): Promise<CategoryInfo[]> {
  try {
    const data = await fetchApi<any>('/api/core/categories/');
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows.map((c: any) => ({ id: c.id, slug: c.slug, name: c.name, storyCount: c.articles?.length || 0 }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getCategoryByName(name: string): Promise<CategoryInfo | null> {
  try {
    const data = await fetchApi<any>(`/api/core/categories/?name=${name}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows[0] || null;
  } catch (error) {
    return null;
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryInfo | null> {
  try {
    const data = await fetchApi<any>(`/api/core/categories/?slug=${slug}`);
    const rows = Array.isArray(data) ? data : data.results || [];
    return rows[0] || null;
  } catch (error) {
    return null;
  }
}
