import { AdminTopbar } from "@/components/admin/admin-topbar";
import { prisma } from "@/lib/prisma";
import { SubmissionsList } from "./submissions-list";

export default async function AdminSubmissionsPage() {
  const rows = await prisma.newsSubmission.findMany({ orderBy: { submittedAt: "desc" } });
  const submissions = rows.map((s) => ({ ...s, submittedAt: s.submittedAt.toISOString() }));

  return (
    <>
      <AdminTopbar title="Citizen Submissions" />
      <div className="flex-1 p-4 sm:p-6">
        <SubmissionsList submissions={submissions} />
      </div>
    </>
  );
}
