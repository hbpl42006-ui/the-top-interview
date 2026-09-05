import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactStatusSchema } from "@/lib/validation";
import { requireRole, MODERATION_ROLES } from "@/lib/authz";
import { handleRoute, ok } from "@/lib/api-response";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(MODERATION_ROLES);
    const { id } = await params;
    const { status } = contactStatusSchema.parse(await request.json());
    const submission = await prisma.contactSubmission.update({ where: { id }, data: { status } });
    return ok(submission);
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(MODERATION_ROLES);
    const { id } = await params;
    await prisma.contactSubmission.delete({ where: { id } });
    return ok({ id });
  });
}
