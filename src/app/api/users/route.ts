import { NextRequest, NextResponse } from "next/server";
import { requireRole, SUPER_ADMIN_ONLY } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  try {
    await requireRole(SUPER_ADMIN_ONLY);
    const proxyRequest = new NextRequest(request.url, {
      method: 'GET',
      headers: request.headers
    });
    return proxyToDjango(proxyRequest, '/api/auth/users/?ordering=createdAt');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(SUPER_ADMIN_ONLY);
    
    // Just forward the POST request, Django auth takes care of password hashing
    return proxyToDjango(request, '/api/auth/users/');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
