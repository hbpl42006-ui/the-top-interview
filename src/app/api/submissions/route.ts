import { requireRole, MODERATION_ROLES } from "@/lib/authz";
import { handleRoute, ok } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return handleRoute(async () => {
    await requireRole(MODERATION_ROLES);
    const submissions = await prisma.newsSubmission.findMany({ orderBy: { submittedAt: "desc" } });
    return ok(submissions);
  });
}
