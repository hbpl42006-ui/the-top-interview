import { PrismaClient } from "@prisma/client";

// Singleton pattern recommended by Prisma for Next.js dev hot-reloading —
// without this, every module reload in `next dev` opens a fresh connection
// pool against the database.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
