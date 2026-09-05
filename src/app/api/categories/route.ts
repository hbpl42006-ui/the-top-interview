import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { handleRoute, ok, created } from "@/lib/api-response";
import { getAllCategories } from "@/lib/data/categories";

export async function GET() {
  return handleRoute(async () => ok(await getAllCategories()));
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const data = categorySchema.parse(await request.json());
    const category = await prisma.category.create({ data });
    return created(category);
  });
}
