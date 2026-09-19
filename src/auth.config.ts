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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        // Optionally store the expiration time if you decode the JWT or know the lifetime
        // token.accessTokenExpires = Date.now() + 5 * 60 * 1000;
      }
      
      // If you want actual token expiration logic, you can decode the JWT
      // but a simple approach is to always try to use the token, and if 
      // the fetchApi fails with 401, we would ideally refresh there.
      // For NextAuth JWT callback refresh:
      if (token.refreshToken && token.accessToken) {
        // Here you would check if token is expired:
        // if (Date.now() > token.accessTokenExpires) { ... }
        // For now, since we don't parse the exp from JWT here, we'll assume it's handled 
        // by the API client throwing 401 and redirecting to login, OR you can parse it:
        try {
          const payloadBase64 = (token.accessToken as string).split('.')[1];
          const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
          const decoded = JSON.parse(decodedJson);
          if (Date.now() >= decoded.exp * 1000) {
            // Token expired, refresh it
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/refresh/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh: token.refreshToken })
            });
            if (res.ok) {
              const tokens = await res.json();
              token.accessToken = tokens.access;
              // SimpleJWT doesn't rotate refresh tokens by default, but if it does:
              if (tokens.refresh) token.refreshToken = tokens.refresh;
            } else {
              // Refresh failed, clear tokens
              token.accessToken = undefined;
              token.refreshToken = undefined;
            }
          }
        } catch (e) {
          // ignore parsing errors
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  providers: [],
};
