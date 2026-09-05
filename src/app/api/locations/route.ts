import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stateSchema } from "@/lib/validation";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { handleRoute, ok, created } from "@/lib/api-response";
import { getAllStates } from "@/lib/data/locations";

export async function GET() {
  return handleRoute(async () => ok(await getAllStates()));
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const { cities, ...data } = stateSchema.parse(await request.json());
    const state = await prisma.state.create({
      data: {
        ...data,
        cities: { create: cities.map((name) => ({ name, slug: `${data.slug}-${name.toLowerCase().replace(/\s+/g, "-")}` })) },
      },
      include: { cities: true },
    });
    return created(state);
  });
}
