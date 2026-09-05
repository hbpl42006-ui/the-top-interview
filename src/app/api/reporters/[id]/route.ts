import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reporterUpdateSchema } from "@/lib/validation";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { handleRoute, ok } from "@/lib/api-response";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const { id } = await params;
    const data = reporterUpdateSchema.parse(await request.json());
    const reporter = await prisma.reporter.update({ where: { id }, data });
    return ok(reporter);
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const { id } = await params;
    await prisma.reporter.delete({ where: { id } });
    return ok({ id });
  });
}
