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
    const article = await prisma.newsArticle.update({
      where: { id },
      data: {
        ...data,
        ...(tagNames
          ? {
              tags: {
                set: [],
                connectOrCreate: tagNames.map((name) => ({
                  where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
                  create: { slug: name.toLowerCase().replace(/\s+/g, "-"), name },
                })),
              },
            }
          : {}),
      },
    });
    return ok(article);
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
