import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { groundReportUpdateSchema } from "@/lib/validation";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { handleRoute, ok } from "@/lib/api-response";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(CONTENT_EDITOR_ROLES);
    const { id } = await params;
    const data = groundReportUpdateSchema.parse(await request.json());
    const report = await prisma.groundReport.update({ where: { id }, data });
    return ok(report);
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(CONTENT_EDITOR_ROLES);
    const { id } = await params;
    await prisma.groundReport.delete({ where: { id } });
    return ok({ id });
  });
}
