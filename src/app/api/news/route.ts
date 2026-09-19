import { NextRequest, NextResponse } from "next/server";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { getPaginatedNews } from "@/lib/data/news";
import { proxyToDjango } from "@/lib/api/proxy";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const result = await getPaginatedNews({
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 20,
      category: searchParams.get("category") ?? undefined,
      q: searchParams.get("q") ?? undefined,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(CONTENT_EDITOR_ROLES);
    const body = await request.json();
    
    // Map camelCase to snake_case for Django
    const djangoBody = {
      ...body,
      category_id: body.categoryId,
      reporter_id: body.reporterId,
    };
    
    // We override request.json() by cloning and changing the body? No, just create a new request.
    const mappedRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(djangoBody)
    });
    
    return proxyToDjango(mappedRequest, '/api/news/articles/');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
