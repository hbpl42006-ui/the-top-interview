import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { userCreateSchema } from "@/lib/validation";
import { requireRole, SUPER_ADMIN_ONLY } from "@/lib/authz";
import { handleRoute, ok, created, RouteError } from "@/lib/api-response";

const publicSelect = { id: true, name: true, email: true, role: true, createdAt: true } as const;

export async function GET() {
  return handleRoute(async () => {
    await requireRole(SUPER_ADMIN_ONLY);
    const users = await prisma.user.findMany({ select: publicSelect, orderBy: { createdAt: "asc" } });
    return ok(users);
  });
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    await requireRole(SUPER_ADMIN_ONLY);
    const { password, ...data } = userCreateSchema.parse(await request.json());

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new RouteError("A user with this email already exists.", 409);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { ...data, passwordHash }, select: publicSelect });
    return created(user);
  });
}
