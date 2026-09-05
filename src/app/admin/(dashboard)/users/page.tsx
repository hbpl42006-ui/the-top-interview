import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { UsersTable } from "./users-table";

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user.role !== "SUPER_ADMIN") redirect("/admin");

  const rows = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  const users = rows.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }));

  return (
    <>
      <AdminTopbar title="Users" />
      <div className="flex-1 p-4 sm:p-6">
        <UsersTable users={users} currentUserId={session.user.id} />
      </div>
    </>
  );
}
