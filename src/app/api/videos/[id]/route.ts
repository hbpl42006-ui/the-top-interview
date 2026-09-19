import { NextRequest, NextResponse } from "next/server";
import { requireRole, VIDEO_ROLES } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(VIDEO_ROLES);
    const { id } = await params;
    
    const mappedRequest = new NextRequest(request.url, {
      method: 'PATCH', // DRF partial update
      headers: request.headers,
      body: await request.text()
    });

    return proxyToDjango(mappedRequest, `/api/media_content/videos/${id}/`);
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(VIDEO_ROLES);
    const { id } = await params;
    
    const deleteRequest = new NextRequest(request.url, {
      method: 'DELETE',
      headers: request.headers
    });
    
    return proxyToDjango(deleteRequest, `/api/media_content/videos/${id}/`);
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
