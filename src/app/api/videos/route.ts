import { NextRequest, NextResponse } from "next/server";
import { requireRole, VIDEO_ROLES } from "@/lib/authz";
import { getAllVideos } from "@/lib/data/videos";
import { proxyToDjango } from "@/lib/api/proxy";

export async function GET() {
  try {
    const data = await getAllVideos();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(VIDEO_ROLES);
    return proxyToDjango(request, '/api/media_content/videos/');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
