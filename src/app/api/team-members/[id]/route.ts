import { NextRequest, NextResponse } from "next/server";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(ADMIN_ROLES);
    const { id } = await params;
    return proxyToDjango(request, `/api/news/team/${id}/`);
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(ADMIN_ROLES);
    const { id } = await params;
    const body = await request.json();

    const djangoBody: any = { ...body };
    if (body.isActive !== undefined) djangoBody.is_active = body.isActive;

    const mappedRequest = new NextRequest(request.url, {
      method: 'PATCH', // DRF partial update
      headers: request.headers,
      body: JSON.stringify(djangoBody)
    });

    return proxyToDjango(mappedRequest, `/api/news/team/${id}/`);
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(ADMIN_ROLES);
    const { id } = await params;
    
    const deleteRequest = new NextRequest(request.url, {
      method: 'DELETE',
      headers: request.headers
    });
    
    return proxyToDjango(deleteRequest, `/api/news/team/${id}/`);
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
