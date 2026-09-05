import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { podcastEpisodeSchema } from "@/lib/validation";
import { requireRole, PODCAST_ROLES } from "@/lib/authz";
import { handleRoute, ok, created } from "@/lib/api-response";
import { getAllEpisodes } from "@/lib/data/podcasts";

export async function GET() {
  return handleRoute(async () => ok(await getAllEpisodes()));
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    await requireRole(PODCAST_ROLES);
    const data = podcastEpisodeSchema.parse(await request.json());

    const podcast = await prisma.podcast.upsert({
      where: { slug: "the-top-interview-podcasts" },
      update: {},
      create: { slug: "the-top-interview-podcasts", name: "The Top Interview Podcasts" },
    });

    const episode = await prisma.podcastEpisode.create({ data: { ...data, podcastId: podcast.id } });
    return created(episode);
  });
}
