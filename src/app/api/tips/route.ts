import { NextRequest, NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/api/proxy";
import { limit, clientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { success } = limit(`tips:${clientIp(request)}`, { max: 5, windowMs: 60 * 60 * 1000 });
    if (!success) return NextResponse.json({ success: false, error: "Too many submissions from this connection. Please try again later." }, { status: 429 });

    const body = await request.json();
    
    // Map data for Django
    const djangoBody = {
      source: "NEWS_TIP",
      name: body.name,
      contact: body.contact,
      location: body.location,
      category: body.category,
      description: body.description,
      mediaUrl: body.mediaUrl,
      status: "PENDING",
    };

    const mappedRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(djangoBody)
    });

    return proxyToDjango(mappedRequest, '/api/news/submissions/');
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
