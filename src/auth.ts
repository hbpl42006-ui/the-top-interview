import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { UserRole } from "@/types/domain";
import { authConfig } from "@/auth.config";
import { loginSchema } from "@/lib/validation";
import { fetchApi } from "@/lib/api/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        try {
          // Call Django login API
          const response = await fetchApi<{ access: string, refresh: string }>('/api/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ email, password })
          });

          // Fetch user details from Django with the access token
          const userResponse = await fetchApi<{ id: string, name: string, email: string, role: string, is_staff: boolean }>('/api/accounts/users/me/', {
            method: 'GET',
            token: response.access
          });

          return { 
            id: userResponse.id, 
            name: userResponse.name, 
            email: userResponse.email, 
            role: userResponse.role as UserRole,
            accessToken: response.access,
            refreshToken: response.refresh
          };
        } catch (error) {
          console.error("Django Auth Error:", error);
          return null;
        }
      },
    }),
  ],
});
