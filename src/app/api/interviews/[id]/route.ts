import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { interviewUpdateSchema } from "@/lib/validation";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { handleRoute, ok } from "@/lib/api-response";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(CONTENT_EDITOR_ROLES);
    const { id } = await params;
    const data = interviewUpdateSchema.parse(await request.json());
    const interview = await prisma.interview.update({ where: { id }, data });
    return ok(interview);
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(CONTENT_EDITOR_ROLES);
    const { id } = await params;
    await prisma.interview.delete({ where: { id } });
    return ok({ id });
  });
}
