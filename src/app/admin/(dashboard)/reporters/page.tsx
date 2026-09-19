import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAllReporters } from "@/lib/data/reporters";
import { ReportersTable } from "./reporters-table";

export const dynamic = "force-dynamic";

export default async function AdminReportersPage() {
  const reporters = await getAllReporters();

  return (
    <>
      <AdminTopbar title="Reporters" />
      <div className="flex-1 p-4 sm:p-6">
        <ReportersTable reporters={reporters} />
      </div>
    </>
  );
}
