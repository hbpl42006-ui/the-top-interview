import { AdminTopbar } from "@/components/admin/admin-topbar";
import { auth } from "@/auth";
import { apiResults, fetchApi } from "@/lib/api/client";
import { CommentsList } from "./comments-list";

interface CommentRow { id: string; name: string; message: string; status: string; createdAt: string; article: { slug: string; headline: string } }

export default async function AdminCommentsPage() {
  const session = await auth();
  const comments = apiResults(await fetchApi<CommentRow[] | { results?: CommentRow[] }>("/api/news/comments/?ordering=-createdAt", { token: session?.accessToken }));

  return (
    <>
      <AdminTopbar title="Comments" />
      <div className="flex-1 p-4 sm:p-6">
        <CommentsList comments={comments} />
      </div>
    </>
  );
}
