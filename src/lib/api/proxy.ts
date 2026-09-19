import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function proxyToDjango(request: NextRequest, djangoEndpoint: string) {
  const session = await auth();
  const token = session?.accessToken;

  const headers = new Headers();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Preserve Content-Type if present
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers.set('content-type', contentType);
  }

  const method = request.method;
  let body: BodyInit | null = null;
  
  if (method !== 'GET' && method !== 'HEAD') {
    if (contentType?.includes('multipart/form-data')) {
      body = await request.formData();
      // Remove content-type so fetch auto-generates the correct boundary
      headers.delete('content-type');
    } else {
      body = await request.text();
    }
  }

  try {
    const endpointUrl = new URL(djangoEndpoint, API_URL);
    // Preserve caller query parameters unless the endpoint already supplied them.
    for (const [key, value] of request.nextUrl.searchParams) {
      if (!endpointUrl.searchParams.has(key)) endpointUrl.searchParams.append(key, value);
    }

    const response = await fetch(endpointUrl, {
      method,
      headers,
      body,
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Map DRF errors to Next.js dashboard format if needed
      let errorMessage = 'An error occurred';
      if (data) {
        if (data.detail) errorMessage = data.detail;
        else if (typeof data === 'object') {
          // Extract first error message from DRF field errors
          const firstKey = Object.keys(data)[0];
          if (Array.isArray(data[firstKey])) {
            errorMessage = data[firstKey][0];
          }
        }
      }

      return NextResponse.json(
        { success: false, error: errorMessage, details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data }, { status: response.status });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
