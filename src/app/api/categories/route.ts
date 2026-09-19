import { NextRequest } from "next/server";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  return proxyToDjango(request, "/api/core/categories/");
}

export async function POST(request: NextRequest) {
  await requireRole(ADMIN_ROLES);
  return proxyToDjango(request, "/api/core/categories/");
}
