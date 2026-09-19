import { NextRequest, NextResponse } from "next/server";
import { requireRole, PODCAST_ROLES } from "@/lib/authz";
import { getAllEpisodes } from "@/lib/data/podcasts";
import { proxyToDjango } from "@/lib/api/proxy";
import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const data = await getAllEpisodes();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(PODCAST_ROLES);
    const body = await request.json();
    const session = await auth();
    const token = session?.accessToken;
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    // Get or create the default podcast
    let podcast_id = null;
    const podRes = await fetch(`${API_URL}/api/media_content/podcasts/?slug=the-top-interview-podcasts`, { headers });
    const podData = await podRes.json();
    
    if (podData.results && podData.results.length > 0) {
      podcast_id = podData.results[0].id;
    } else {
      const createPodRes = await fetch(`${API_URL}/api/media_content/podcasts/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ slug: "the-top-interview-podcasts", name: "The Top Interview Podcasts" }),
      });
      const createPodData = await createPodRes.json();
      podcast_id = createPodData.id;
    }

    const djangoBody = {
      ...body,
      podcast: podcast_id,
    };

    const mappedRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(djangoBody)
    });

    return proxyToDjango(mappedRequest, '/api/media_content/episodes/');
  } catch (error: any) {
    if (error.message === 'Forbidden') return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
