import type { UserRole } from "@prisma/client";
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
  }

  interface User {
    id: string;
    role: UserRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
