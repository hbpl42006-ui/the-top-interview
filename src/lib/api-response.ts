import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: number) {
  return NextResponse.json({ success: true, data }, { status: init ?? 200 });
}

export function created<T>(data: T) {
  return ok(data, 201);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function unauthorized(message = "Authentication required.") {
  return fail(message, 401);
}

export function forbidden(message = "You do not have permission to do this.") {
  return fail(message, 403);
}

export function notFound(message = "Not found.") {
  return fail(message, 404);
}

/**
 * Wraps a route handler body so unexpected errors never leak stack traces or
 * internal details to the client — they're logged server-side and returned
 * as a safe, generic message instead.
 */
export async function handleRoute(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.issues.map((i) => i.message).join(" ");
      return fail(message || "Invalid input.", 422);
    }
    if (err instanceof RouteError) {
      return fail(err.message, err.status);
    }
    console.error("[api] unhandled error:", err);
    return fail("Unable to process request.", 500);
  }
}

export class RouteError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
