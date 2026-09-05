import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: { default: "Admin Dashboard", template: "%s | Admin — The Top Interview" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: middleware (src/middleware.ts) already blocks
  // unauthenticated requests to /admin/*, but every server render checks
  // again here rather than trusting the edge check alone.
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar role={session.user.role} />
      <div className="flex min-h-screen flex-1 flex-col">{children}</div>
    </div>
  );
}
