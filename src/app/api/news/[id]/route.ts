import { NextRequest, NextResponse } from "next/server";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";
import { auth } from "@/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(CONTENT_EDITOR_ROLES);
    const { id } = await params;
    const body = await request.json();
    
    // Map camelCase to snake_case for Django
    const djangoBody: any = { ...body };
    if (body.categoryId !== undefined) djangoBody.category_id = body.categoryId;
    if (body.reporterId !== undefined) djangoBody.reporter_id = body.reporterId;
    if (body.cityId !== undefined) djangoBody.city_id = body.cityId;
    if (body.readMinutes !== undefined) djangoBody.readMinutes = body.readMinutes;

    const mappedRequest = new NextRequest(request.url, {
      method: 'PATCH', // DRF partial update is PATCH, Next.js UI sends PUT
      headers: request.headers,
      body: JSON.stringify(djangoBody)
    });

    return proxyToDjango(mappedRequest, `/api/news/articles/${id}/`);
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
    
    return proxyToDjango(deleteRequest, `/api/news/articles/${id}/`);
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
