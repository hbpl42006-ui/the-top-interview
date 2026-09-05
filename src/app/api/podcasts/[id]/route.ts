import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { podcastEpisodeUpdateSchema } from "@/lib/validation";
import { requireRole, PODCAST_ROLES } from "@/lib/authz";
import { handleRoute, ok } from "@/lib/api-response";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(PODCAST_ROLES);
    const { id } = await params;
    const data = podcastEpisodeUpdateSchema.parse(await request.json());
    const episode = await prisma.podcastEpisode.update({ where: { id }, data });
    return ok(episode);
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole(PODCAST_ROLES);
    const { id } = await params;
    await prisma.podcastEpisode.delete({ where: { id } });
    return ok({ id });
  });
}
