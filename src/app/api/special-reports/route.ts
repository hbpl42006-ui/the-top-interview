import { NextRequest, NextResponse } from "next/server";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { getAllSpecialReports } from "@/lib/data/specialReports";
import { proxyToDjango } from "@/lib/api/proxy";

export async function GET() {
  try {
    const data = await getAllSpecialReports();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(CONTENT_EDITOR_ROLES);
    return proxyToDjango(request, '/api/news/special-reports/');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
