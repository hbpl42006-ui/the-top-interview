import { AdminTopbar } from "@/components/admin/admin-topbar";
import { auth } from "@/auth";
import { apiResults, fetchApi } from "@/lib/api/client";
import { SubmissionsList } from "./submissions-list";

interface NewsSubmission { id: string; submittedAt: string; [key: string]: unknown }

export default async function AdminSubmissionsPage() {
  const session = await auth();
  const submissions = apiResults(await fetchApi<NewsSubmission[] | { results?: NewsSubmission[] }>("/api/submissions/news-tips/?ordering=-submittedAt", { token: session?.accessToken }));

  return (
    <>
      <AdminTopbar title="Citizen Submissions" />
      <div className="flex-1 p-4 sm:p-6">
        <SubmissionsList submissions={submissions} />
      </div>
    </>
  );
}
