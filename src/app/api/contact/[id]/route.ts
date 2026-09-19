import { NextRequest } from "next/server";
import { requireRole, MODERATION_ROLES } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(MODERATION_ROLES);
  const { id } = await params;
  return proxyToDjango(request, `/api/submissions/contact/${id}/`);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(MODERATION_ROLES);
  const { id } = await params;
  return proxyToDjango(_request, `/api/submissions/contact/${id}/`);
}
