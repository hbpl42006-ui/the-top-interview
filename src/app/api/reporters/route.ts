import { NextRequest, NextResponse } from "next/server";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { getAllReporters } from "@/lib/data/reporters";
import { proxyToDjango } from "@/lib/api/proxy";

export async function GET() {
  try {
    const data = await getAllReporters();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(ADMIN_ROLES);
    const body = await request.json();
    
    // Map camelCase to snake_case for Django
    const djangoBody = {
      ...body,
      is_active: body.isActive,
    };
    
    const mappedRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(djangoBody)
    });

    return proxyToDjango(mappedRequest, '/api/news/reporters/');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
