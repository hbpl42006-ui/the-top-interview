import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { videoUpdateSchema } from "@/lib/validation";
import { requireRole, VIDEO_ROLES } from "@/lib/authz";
import { handleRoute, ok } from "@/lib/api-response";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(VIDEO_ROLES);
    const { id } = await params;
    const data = videoUpdateSchema.parse(await request.json());
    const video = await prisma.video.update({ where: { id }, data });
    return ok(video);
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(VIDEO_ROLES);
    const { id } = await params;
    await prisma.video.delete({ where: { id } });
    return ok({ id });
  });
}
