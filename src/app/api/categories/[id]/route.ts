import { NextRequest } from "next/server";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(ADMIN_ROLES);
  const { id } = await params;
  return proxyToDjango(request, `/api/core/categories/${id}/`);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(ADMIN_ROLES);
  const { id } = await params;
  return proxyToDjango(_request, `/api/core/categories/${id}/`);
}
