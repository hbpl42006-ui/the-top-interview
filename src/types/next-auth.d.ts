import type { UserRole } from "@/types/domain";
import type { DefaultSession } from "next-auth";

// Augmenting the modules where these interfaces are actually declared
// (@auth/core/*) rather than next-auth's re-exporting entry points, since
// TypeScript only merges declarations at their original module.
declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string;
    role: UserRole;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    accessToken?: string;
    refreshToken?: string;
  }
}
