import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge-safe: only reads the JWT session cookie (see auth.config.ts). The
// full Prisma-backed auth() lives in src/auth.ts and runs in route handlers
// and Server Components instead, since Prisma needs the Node runtime.
//
// Next.js 16 renamed the "middleware" file convention to "proxy" — same
// Edge-runtime request hook, new file/export name.
const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: ["/admin/:path*"],
};
