import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicVoiceSchema } from "@/lib/validation";
import { handleRoute, created, RouteError } from "@/lib/api-response";
import { limit, clientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const { success } = limit(`public-voice:${clientIp(request)}`, { max: 5, windowMs: 60 * 60 * 1000 });
    if (!success) throw new RouteError("Too many submissions from this connection. Please try again later.", 429);

    const data = publicVoiceSchema.parse(await request.json());
    const submission = await prisma.newsSubmission.create({
      data: {
        source: "PUBLIC_VOICE",
        name: data.name,
        contact: data.contact,
        location: data.location,
        category: data.category,
        description: data.description,
        mediaUrl: data.mediaUrl,
        status: "PENDING",
      },
    });
    return created({ id: submission.id });
  });
}
