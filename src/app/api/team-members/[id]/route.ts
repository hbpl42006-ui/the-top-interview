import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamMemberUpdateSchema } from "@/lib/validation";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { handleRoute, ok } from "@/lib/api-response";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const { id } = await params;
    const member = await prisma.teamMember.findUniqueOrThrow({ where: { id } });
    return ok(member);
  });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const { id } = await params;
    const data = teamMemberUpdateSchema.parse(await request.json());
    const member = await prisma.teamMember.update({ where: { id }, data });
    return ok(member);
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const { id } = await params;
    await prisma.teamMember.delete({ where: { id } });
    return ok({ id });
  });
}
