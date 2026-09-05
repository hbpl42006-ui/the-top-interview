import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { videoSchema } from "@/lib/validation";
import { requireRole, VIDEO_ROLES } from "@/lib/authz";
import { handleRoute, ok, created } from "@/lib/api-response";
import { getAllVideos } from "@/lib/data/videos";

export async function GET() {
  return handleRoute(async () => ok(await getAllVideos()));
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    await requireRole(VIDEO_ROLES);
    const data = videoSchema.parse(await request.json());
    const video = await prisma.video.create({ data });
    return created(video);
  });
}
