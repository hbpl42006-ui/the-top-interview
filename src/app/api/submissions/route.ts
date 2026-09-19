import { NextRequest, NextResponse } from "next/server";
import { requireRole, MODERATION_ROLES } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  try {
    await requireRole(MODERATION_ROLES);
    const proxyRequest = new NextRequest(request.url, {
      method: 'GET',
      headers: request.headers
    });
    return proxyToDjango(proxyRequest, '/api/news/submissions/?ordering=-submittedAt');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
