import { NextRequest, NextResponse } from "next/server";
import { requireRole, SUPER_ADMIN_ONLY } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(SUPER_ADMIN_ONLY);
    const { id } = await params;
    
    // Pass password securely, Django auth handles updating user correctly
    const mappedRequest = new NextRequest(request.url, {
      method: 'PATCH', // DRF partial update
      headers: request.headers,
      body: await request.text()
    });

    return proxyToDjango(mappedRequest, `/api/auth/users/${id}/`);
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actingUser = await requireRole(SUPER_ADMIN_ONLY);
    const { id } = await params;
    if (id === actingUser.id) {
      return NextResponse.json({ success: false, error: "You cannot delete your own account while signed in." }, { status: 400 });
    }
    
    const deleteRequest = new NextRequest(request.url, {
      method: 'DELETE',
      headers: request.headers
    });
    
    return proxyToDjango(deleteRequest, `/api/auth/users/${id}/`);
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
