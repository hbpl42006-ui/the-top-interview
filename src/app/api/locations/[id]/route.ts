import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { handleRoute, ok } from "@/lib/api-response";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const { id } = await params;
    await prisma.state.delete({ where: { id } });
    return ok({ id });
  });
}
