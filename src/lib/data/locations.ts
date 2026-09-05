import { prisma } from "@/lib/prisma";
import { StateInfo } from "@/lib/types";

async function storyCountForCities(cityIds: string[]): Promise<number> {
  if (cityIds.length === 0) return 0;
  const [articles, groundReports] = await Promise.all([
    prisma.newsArticle.count({ where: { cityId: { in: cityIds }, status: "PUBLISHED" } }),
    prisma.groundReport.count({ where: { cityId: { in: cityIds }, status: "PUBLISHED" } }),
  ]);
  return articles + groundReports;
}

export async function getAllStates(): Promise<StateInfo[]> {
  const rows = await prisma.state.findMany({
    include: { cities: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  });

  return Promise.all(
    rows.map(async (s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      cities: s.cities.map((c) => c.name),
      storyCount: await storyCountForCities(s.cities.map((c) => c.id)),
    }))
  );
}

export async function getStateBySlug(slug: string): Promise<StateInfo | undefined> {
  const s = await prisma.state.findUnique({
    where: { slug },
    include: { cities: { select: { id: true, name: true } } },
  });
  if (!s) return undefined;
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    cities: s.cities.map((c) => c.name),
    storyCount: await storyCountForCities(s.cities.map((c) => c.id)),
  };
}
