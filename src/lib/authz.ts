import type { UserRole } from "@prisma/client";
import { auth } from "@/auth";
import { RouteError } from "@/lib/api-response";

/**
 * Server-side auth guard for API routes and Server Actions. Never rely on
 * the admin UI hiding a button — every mutating route calls this first.
 * Throws a RouteError that `handleRoute()` turns into a safe 401/403 JSON
 * response.
 */
export async function requireRole(roles: UserRole[]) {
  const session = await auth();
  if (!session?.user) {
    throw new RouteError("Sign in to continue.", 401);
  }
  if (!roles.includes(session.user.role)) {
    throw new RouteError("You do not have permission to do this.", 403);
  }
  return session.user;
}

export async function requireAnyAdmin() {
  return requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR", "REPORTER", "VIDEO_EDITOR", "PODCAST_MANAGER", "MODERATOR"]);
}

export const CONTENT_EDITOR_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "REPORTER"];
export const PODCAST_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "PODCAST_MANAGER"];
export const VIDEO_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "VIDEO_EDITOR"];
export const MODERATION_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "MODERATOR", "EDITOR"];
export const SUPER_ADMIN_ONLY: UserRole[] = ["SUPER_ADMIN"];
export const ADMIN_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN"];
