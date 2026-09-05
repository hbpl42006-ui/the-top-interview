import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAllGroundReportsForAdmin } from "@/lib/data/groundReports";
import { getAllReporters } from "@/lib/data/reporters";
import { GroundReportsTable } from "./ground-reports-table";

export default async function AdminGroundReportsPage() {
  const [rows, reporters] = await Promise.all([getAllGroundReportsForAdmin(), getAllReporters()]);
  const reports = rows.map((r) => ({
    ...r,
    publishedAt: r.publishedAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <>
      <AdminTopbar title="Ground Reports" />
      <div className="flex-1 p-4 sm:p-6">
        <GroundReportsTable reports={reports} reporters={reporters.map((r) => ({ id: r.id, name: r.name }))} />
      </div>
    </>
  );
}
