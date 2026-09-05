import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { userUpdateSchema } from "@/lib/validation";
import { requireRole, SUPER_ADMIN_ONLY } from "@/lib/authz";
import { handleRoute, ok, RouteError } from "@/lib/api-response";

const publicSelect = { id: true, name: true, email: true, role: true, createdAt: true } as const;

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(SUPER_ADMIN_ONLY);
    const { id } = await params;
    const { password, ...data } = userUpdateSchema.parse(await request.json());
    const user = await prisma.user.update({
      where: { id },
      data: { ...data, ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}) },
      select: publicSelect,
    });
    return ok(user);
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const actingUser = await requireRole(SUPER_ADMIN_ONLY);
    const { id } = await params;
    if (id === actingUser.id) {
      throw new RouteError("You cannot delete your own account while signed in.", 400);
    }
    await prisma.user.delete({ where: { id } });
    return ok({ id });
  });
}
