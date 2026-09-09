import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAllTeamMembersForAdmin } from "@/lib/data/teamMembers";
import { TeamMembersTable } from "./team-members-table";

export default async function AdminTeamMembersPage() {
  const members = await getAllTeamMembersForAdmin();

  return (
    <>
      <AdminTopbar title="Team Members" />
      <div className="flex-1 p-4 sm:p-6">
        <TeamMembersTable
          members={members.map((m) => ({ ...m, createdAt: m.createdAt.toISOString(), updatedAt: m.updatedAt.toISOString() }))}
        />
      </div>
    </>
  );
}
