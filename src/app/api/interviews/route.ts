import { NextRequest, NextResponse } from "next/server";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { getAllInterviews } from "@/lib/data/interviews";
import { proxyToDjango } from "@/lib/api/proxy";
import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const data = await getAllInterviews();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(CONTENT_EDITOR_ROLES);
    const body = await request.json();
    const session = await auth();
    const token = session?.accessToken;
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    let guest_id = body.guestId;

    if (!guest_id && body.guest) {
      // Create guest in Django
      const guestRes = await fetch(`${API_URL}/api/media_content/guests/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body.guest),
      });
      const guestData = await guestRes.json();
      if (!guestRes.ok) {
        // If guest already exists with this slug, we can try to fetch it
        if (guestRes.status === 400 && guestData.slug) {
          const findRes = await fetch(`${API_URL}/api/media_content/guests/?slug=${body.guest.slug}`, { headers });
          const findData = await findRes.json();
          if (findData.results && findData.results.length > 0) {
            guest_id = findData.results[0].id;
          } else {
            return NextResponse.json({ success: false, error: "Guest creation failed" }, { status: 400 });
          }
        } else {
          return NextResponse.json({ success: false, error: "Guest creation failed", details: guestData }, { status: 400 });
        }
      } else {
        guest_id = guestData.id;
      }
    }

    const djangoBody = {
      ...body,
      guest_id,
      reporter_id: body.reporterId,
    };

    const mappedRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(djangoBody)
    });

    return proxyToDjango(mappedRequest, '/api/media_content/interviews/');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
