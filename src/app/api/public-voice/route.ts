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
    return proxyToDjango(proxyRequest, '/api/submissions/news-tips/?source=PUBLIC_VOICE&status=PUBLISHED&ordering=-submittedAt');
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

    const incoming = await request.formData();
    const djangoBody = new FormData();
    for (const key of ["name", "contact", "location", "category", "description", "consent"]) {
      const value = incoming.get(key);
      if (typeof value === "string") djangoBody.append(key, value);
    }
    djangoBody.append("source", "PUBLIC_VOICE");
    djangoBody.append("status", "PENDING");
    const media = incoming.get("media");
    if (media instanceof File) djangoBody.append("media", media, media.name);

    const mappedRequest = new NextRequest(request.url, {
      method: "POST",
      body: djangoBody,
    });

    return proxyToDjango(mappedRequest, "/api/submissions/news-tips/");
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
