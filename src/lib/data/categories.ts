import { prisma } from "@/lib/prisma";

export async function getAllCategories() {
  const rows = await prisma.category.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: "asc" },
  });
  return rows.map((c) => ({ id: c.id, slug: c.slug, name: c.name, storyCount: c._count.articles }));
}

export async function getCategoryByName(name: string) {
  return prisma.category.findUnique({ where: { name } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}
