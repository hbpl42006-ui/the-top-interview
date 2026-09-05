import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config used by middleware. It must NOT import Prisma or
 * bcrypt (both require the Node runtime) — only the JWT session cookie is
 * read here. The Credentials provider (which does the real Prisma lookup)
 * is added on top of this config in src/auth.ts, which only runs in route
 * handlers and Server Components (Node runtime).
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
      if (isAdminRoute) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [],
};
