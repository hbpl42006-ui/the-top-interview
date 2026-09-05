import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsArticleSchema } from "@/lib/validation";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { handleRoute, ok, created } from "@/lib/api-response";
import { getPaginatedNews } from "@/lib/data/news";

export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const { searchParams } = request.nextUrl;
    const result = await getPaginatedNews({
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 20,
      category: searchParams.get("category") ?? undefined,
      q: searchParams.get("q") ?? undefined,
    });
    return ok(result);
  });
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    await requireRole(CONTENT_EDITOR_ROLES);
    const { tagNames, ...data } = newsArticleSchema.parse(await request.json());
    const article = await prisma.newsArticle.create({
      data: {
        ...data,
        tags: { connectOrCreate: tagNames.map((name) => ({ where: { slug: name.toLowerCase().replace(/\s+/g, "-") }, create: { slug: name.toLowerCase().replace(/\s+/g, "-"), name } })) },
      },
    });
    return created(article);
  });
}
