import { NextRequest, NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/api/proxy";
import { limit, clientIp } from "@/lib/rate-limit";

/**
 * Public endpoint used by the frontend to show
 * approved Public Voice submissions.
 *
 * IMPORTANT:
 * Never expose `contact` publicly.
 */
export async function GET(request: NextRequest) {
  try {
    const proxyRequest = new NextRequest(request.url, {
      method: 'GET',
      headers: request.headers
    });
    // Assuming backend endpoint filters if we pass query params, or we just pass them.
    // The previous Next.js code only fetched PUBLISHED and PUBLIC_VOICE.
    return proxyToDjango(proxyRequest, '/api/news/submissions/?source=PUBLIC_VOICE&status=PUBLISHED&ordering=-submittedAt');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/**
 * Citizen submission endpoint.
 * New submissions always start as PENDING
 * and must be approved by the editorial team.
 */
export async function POST(request: NextRequest) {
  try {
    const { success } = limit(
      `public-voice:${clientIp(request)}`,
      {
        max: 5,
        windowMs: 60 * 60 * 1000,
      }
    );

    if (!success) {
      return NextResponse.json({ success: false, error: "Too many submissions from this connection. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    
    // Map data for Django
    const djangoBody = {
      source: "PUBLIC_VOICE",
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