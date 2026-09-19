import { NextRequest, NextResponse } from "next/server";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { getAllStates } from "@/lib/data/locations";
import { proxyToDjango } from "@/lib/api/proxy";

export async function GET() {
  try {
    const data = await getAllStates();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(ADMIN_ROLES);
    // In Django, creating a state with cities is supported via DRF writable nested serializers, or we handle it in DRF.
    // We just forward the JSON.
    return proxyToDjango(request, '/api/core/states/');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
