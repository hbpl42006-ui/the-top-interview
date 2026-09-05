import { prisma } from "@/lib/prisma";

export async function getApprovedComments(articleSlug: string) {
  const article = await prisma.newsArticle.findUnique({ where: { slug: articleSlug }, select: { id: true } });
  if (!article) return [];
  return prisma.comment.findMany({
    where: { articleId: article.id, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });
}
