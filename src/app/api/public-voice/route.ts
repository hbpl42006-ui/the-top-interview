import { NextRequest, NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/api/proxy";

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
