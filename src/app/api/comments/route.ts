import { NextRequest, NextResponse } from "next/server";
import { requireRole, MODERATION_ROLES } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";
import { limit, clientIp } from "@/lib/rate-limit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    await requireRole(MODERATION_ROLES);
    // Add ordering to the request url? Let proxy handle it
    const proxyRequest = new NextRequest(request.url, {
      method: 'GET',
      headers: request.headers
    });
    return proxyToDjango(proxyRequest, '/api/news/comments/?ordering=-createdAt');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { success } = limit(`comment:${clientIp(request)}`, { max: 5, windowMs: 10 * 60 * 1000 });
    if (!success) return NextResponse.json({ success: false, error: "Too many comments submitted. Please try again later." }, { status: 429 });

    const body = await request.json();
    
    // Find article ID by slug in backend?
    // Django view can handle nested or we do it here. 
    // Wait, comment in Django has `article` (ForeignKey) which expects ID.
    const articleRes = await fetch(`${API_URL}/api/news/articles/?slug=${body.articleSlug}`);
    const articleData = await articleRes.json();
    
    if (!articleData.results || articleData.results.length === 0) {
      return NextResponse.json({ success: false, error: "Article not found." }, { status: 404 });
    }
    
    const djangoBody = {
      name: body.name,
      message: body.message,
      status: "PENDING",
      article_id: articleData.results[0].id
    };

    const mappedRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(djangoBody)
    });

    return proxyToDjango(mappedRequest, '/api/news/comments/');
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
