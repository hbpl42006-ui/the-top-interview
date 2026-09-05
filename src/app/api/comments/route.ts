import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentCreateSchema } from "@/lib/validation";
import { requireRole, MODERATION_ROLES } from "@/lib/authz";
import { handleRoute, ok, created, RouteError } from "@/lib/api-response";
import { limit, clientIp } from "@/lib/rate-limit";

export async function GET() {
  return handleRoute(async () => {
    await requireRole(MODERATION_ROLES);
    const comments = await prisma.comment.findMany({
      include: { article: { select: { slug: true, headline: true } } },
      orderBy: { createdAt: "desc" },
    });
    return ok(comments);
  });
}

// Public: visitors post comments here; they start PENDING until moderated.
export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const { success } = limit(`comment:${clientIp(request)}`, { max: 5, windowMs: 10 * 60 * 1000 });
    if (!success) throw new RouteError("Too many comments submitted. Please try again later.", 429);

    const { articleSlug, name, message } = commentCreateSchema.parse(await request.json());
    const article = await prisma.newsArticle.findUnique({ where: { slug: articleSlug } });
    if (!article) throw new RouteError("Article not found.", 404);

    const comment = await prisma.comment.create({
      data: { articleId: article.id, name, message, status: "PENDING" },
    });
    return created(comment);
  });
}
