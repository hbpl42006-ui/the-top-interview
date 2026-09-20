const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : undefined);

export interface RequestOptions extends RequestInit {
  token?: string;
  /** Milliseconds before the request is aborted. Set null to disable. */
  timeoutMs?: number | null;
  /** Server-side public GET revalidation interval in seconds. */
  revalidateSeconds?: number | null;
}

export async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, timeoutMs = 8000, revalidateSeconds = 60, ...rest } = options;
  if (!NEXT_PUBLIC_API_URL) throw new Error('NEXT_PUBLIC_API_URL is required outside development.');

  const isFormData = typeof FormData !== 'undefined' && rest.body instanceof FormData;
  const authHeaders: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' };

  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const timeout = timeoutMs == null ? undefined : AbortSignal.timeout(timeoutMs);
  const signal = timeout && rest.signal ? AbortSignal.any([rest.signal, timeout]) : (rest.signal ?? timeout);
  const isGet = !rest.method || rest.method.toUpperCase() === "GET";
  const shouldRevalidate = isGet && !token && !rest.cache && typeof window === "undefined" && revalidateSeconds != null;
  const response = await fetch(`${NEXT_PUBLIC_API_URL}${endpoint}`, {
    headers: {
      ...authHeaders,
      ...headers,
    },
    ...rest,
    ...(shouldRevalidate ? { next: { revalidate: revalidateSeconds } } : {}),
    signal,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText };
    }
    const error = new Error(errorData.detail || 'API request failed');
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as unknown as T;
  }

  return response.json();
}

export function apiResults<T>(data: T[] | { results?: T[] }): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}
