import { NextRequest, NextResponse } from "next/server";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(CONTENT_EDITOR_ROLES);
    const { id } = await params;
    
    const mappedRequest = new NextRequest(request.url, {
      method: 'PATCH', // DRF partial update
      headers: request.headers,
      body: await request.text()
    });

    return proxyToDjango(mappedRequest, `/api/news/special-reports/${id}/`);
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
    
    return proxyToDjango(deleteRequest, `/api/news/special-reports/${id}/`);
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
