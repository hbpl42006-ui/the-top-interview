import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamMemberSchema } from "@/lib/validation";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { handleRoute, ok, created } from "@/lib/api-response";
import { getActiveTeamMembers, getAllTeamMembersForAdmin } from "@/lib/data/teamMembers";

export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const isAdmin = request.nextUrl.searchParams.get("all") === "1";
    if (isAdmin) {
      await requireRole(ADMIN_ROLES);
      return ok(await getAllTeamMembersForAdmin());
    }
    return ok(await getActiveTeamMembers());
  });
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const data = teamMemberSchema.parse(await request.json());
    const member = await prisma.teamMember.create({ data });
    return created(member);
  });
}
