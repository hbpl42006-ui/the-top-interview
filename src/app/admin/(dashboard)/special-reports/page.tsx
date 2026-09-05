import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAllSpecialReportsForAdmin } from "@/lib/data/specialReports";
import { SpecialReportsTable } from "./special-reports-table";

export default async function AdminSpecialReportsPage() {
  const rows = await getAllSpecialReportsForAdmin();
  const reports = rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));

  return (
    <>
      <AdminTopbar title="Special Reports" />
      <div className="flex-1 p-4 sm:p-6">
        <SpecialReportsTable reports={reports} />
      </div>
    </>
  );
}
