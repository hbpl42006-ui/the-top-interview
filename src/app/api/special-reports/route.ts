import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { specialReportSchema } from "@/lib/validation";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { handleRoute, ok, created } from "@/lib/api-response";
import { getAllSpecialReports } from "@/lib/data/specialReports";

export async function GET() {
  return handleRoute(async () => ok(await getAllSpecialReports()));
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    await requireRole(CONTENT_EDITOR_ROLES);
    const data = specialReportSchema.parse(await request.json());
    const report = await prisma.specialReport.create({ data });
    return created(report);
  });
}
