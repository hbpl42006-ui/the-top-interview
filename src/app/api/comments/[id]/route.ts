import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentModerationSchema } from "@/lib/validation";
import { requireRole, MODERATION_ROLES } from "@/lib/authz";
import { handleRoute, ok } from "@/lib/api-response";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(MODERATION_ROLES);
    const { id } = await params;
    const { status } = commentModerationSchema.parse(await request.json());
    const comment = await prisma.comment.update({ where: { id }, data: { status } });
    return ok(comment);
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(MODERATION_ROLES);
    const { id } = await params;
    await prisma.comment.delete({ where: { id } });
    return ok({ id });
  });
}
