import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { apiResults, fetchApi } from "@/lib/api/client";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { UsersTable } from "./users-table";

interface UserRow { id: string; name: string; email: string; role: string; createdAt: string }

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user.role !== "SUPER_ADMIN") redirect("/admin");

  const users = apiResults(await fetchApi<UserRow[] | { results?: UserRow[] }>("/api/accounts/users/?ordering=createdAt", { token: session?.accessToken }));

  return (
    <>
      <AdminTopbar title="Users" />
      <div className="flex-1 p-4 sm:p-6">
        <UsersTable users={users} currentUserId={session.user.id} />
      </div>
    </>
  );
}
