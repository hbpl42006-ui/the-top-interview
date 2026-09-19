import { NextRequest, NextResponse } from "next/server";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { getAllGroundReports } from "@/lib/data/groundReports";
import { proxyToDjango } from "@/lib/api/proxy";

export async function GET() {
  try {
    const data = await getAllGroundReports();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(CONTENT_EDITOR_ROLES);
    const body = await request.json();
    
    // Map camelCase to snake_case
    const djangoBody = {
      ...body,
      city_id: body.cityId,
      reporter_id: body.reporterId,
    };
    
    const mappedRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(djangoBody)
    });

    return proxyToDjango(mappedRequest, '/api/news/ground-reports/');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
