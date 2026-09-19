import { NextRequest, NextResponse } from "next/server";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(CONTENT_EDITOR_ROLES);
    const { id } = await params;
    const body = await request.json();

    const djangoBody: any = { ...body };
    if (body.reporterId !== undefined) djangoBody.reporter_id = body.reporterId;
    if (body.guestId !== undefined) djangoBody.guest_id = body.guestId;

    const mappedRequest = new NextRequest(request.url, {
      method: 'PATCH', // DRF partial update
      headers: request.headers,
      body: JSON.stringify(djangoBody)
    });

    return proxyToDjango(mappedRequest, `/api/media_content/interviews/${id}/`);
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(CONTENT_EDITOR_ROLES);
    const { id } = await params;
    
    const deleteRequest = new NextRequest(request.url, {
      method: 'DELETE',
      headers: request.headers
    });
    
    return proxyToDjango(deleteRequest, `/api/media_content/interviews/${id}/`);
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
