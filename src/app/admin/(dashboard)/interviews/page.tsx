import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAllInterviewsForAdmin, interviewCategories } from "@/lib/data/interviews";
import { getAllReporters } from "@/lib/data/reporters";
import { InterviewsTable } from "./interviews-table";

export default async function AdminInterviewsPage() {
  const [rows, reporters] = await Promise.all([getAllInterviewsForAdmin(), getAllReporters()]);
  const interviews = rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));

  return (
    <>
      <AdminTopbar title="Interviews" />
      <div className="flex-1 p-4 sm:p-6">
        <InterviewsTable
          interviews={interviews}
          reporters={reporters.map((r) => ({ id: r.id, name: r.name }))}
          categories={interviewCategories}
        />
      </div>
    </>
  );
}
