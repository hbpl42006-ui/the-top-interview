import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsArticleUpdateSchema } from "@/lib/validation";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { handleRoute, ok } from "@/lib/api-response";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(CONTENT_EDITOR_ROLES);
    const { id } = await params;
    const { tagNames, ...data } = newsArticleUpdateSchema.parse(await request.json());
    try {
      const article = await prisma.newsArticle.update({
        where: { id },
        data: {
          ...(data.slug !== undefined ? { slug: data.slug } : {}),
          ...(data.headline !== undefined ? { headline: data.headline } : {}),
          ...(data.subheadline !== undefined ? { subheadline: data.subheadline } : {}),
          ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),
          ...(data.body !== undefined ? { body: data.body } : {}),
          ...(data.image !== undefined ? { image: data.image } : {}),
          ...(data.videoUrl !== undefined ? { videoUrl: data.videoUrl } : {}),
          ...(data.status !== undefined ? { status: data.status } : {}),
          ...(data.contentLabel !== undefined ? { contentLabel: data.contentLabel } : {}),
          ...(data.factCheck !== undefined ? { factCheck: data.factCheck } : {}),
          ...(data.isBreaking !== undefined ? { isBreaking: data.isBreaking } : {}),
          ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
          ...(data.readMinutes !== undefined ? { readMinutes: data.readMinutes } : {}),
          ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
          ...(data.cityId !== undefined ? { cityId: data.cityId } : {}),
          ...(data.reporterId !== undefined ? { reporterId: data.reporterId } : {}),
          ...(data.publishedAt !== undefined ? { publishedAt: data.publishedAt } : {}),
          ...(tagNames
            ? {
                tags: {
                  set: [],
                  connectOrCreate: tagNames.map((name) => ({
                    where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
                    create: { slug: name.toLowerCase().replace(/\s+/g, "-") , name },
                  })),
                },
              }
            : {}),
        },
      });
      return ok(article);
    } catch (error) {
      console.error("[news:update] failed", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(CONTENT_EDITOR_ROLES);
    const { id } = await params;
    await prisma.newsArticle.delete({ where: { id } });
    return ok({ id });
  });
}
