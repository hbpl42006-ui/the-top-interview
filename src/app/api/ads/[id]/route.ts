import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { advertisementUpdateSchema } from "@/lib/validation";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { handleRoute, ok } from "@/lib/api-response";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const { id } = await params;
    const data = advertisementUpdateSchema.parse(await request.json());
    const ad = await prisma.advertisement.update({ where: { id }, data });
    return ok(ad);
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const { id } = await params;
    await prisma.advertisement.delete({ where: { id } });
    return ok({ id });
  });
}
