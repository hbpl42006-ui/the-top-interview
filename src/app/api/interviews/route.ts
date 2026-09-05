import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { interviewSchema, guestSchema } from "@/lib/validation";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { handleRoute, ok, created } from "@/lib/api-response";
import { getAllInterviews } from "@/lib/data/interviews";

export async function GET() {
  return handleRoute(async () => ok(await getAllInterviews()));
}

// Accepts either an existing guestId or an inline `guest` object to create-or-reuse.
const createSchema = interviewSchema
  .omit({ guestId: true })
  .extend({ guestId: z.string().optional(), guest: guestSchema.optional() })
  .refine((v) => v.guestId || v.guest, { message: "Provide guestId or guest details." });

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    await requireRole(CONTENT_EDITOR_ROLES);
    const body = createSchema.parse(await request.json());

    let guestId = body.guestId;
    if (!guestId && body.guest) {
      const guest = await prisma.guest.upsert({
        where: { slug: body.guest.slug },
        update: body.guest,
        create: body.guest,
      });
      guestId = guest.id;
    }

    const interview = await prisma.interview.create({
      data: {
        slug: body.slug,
        topic: body.topic,
        excerpt: body.excerpt,
        body: body.body,
        thumbnail: body.thumbnail,
        videoUrl: body.videoUrl,
        duration: body.duration,
        category: body.category,
        status: body.status,
        reporterId: body.reporterId,
        publishedAt: body.publishedAt,
        guestId: guestId!,
      },
    });
    return created(interview);
  });
}
