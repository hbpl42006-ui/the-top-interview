import { AdminTopbar } from "@/components/admin/admin-topbar";
import { prisma } from "@/lib/prisma";
import { CommentsList } from "./comments-list";

export default async function AdminCommentsPage() {
  const rows = await prisma.comment.findMany({
    include: { article: { select: { slug: true, headline: true } } },
    orderBy: { createdAt: "desc" },
  });
  const comments = rows.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }));

  return (
    <>
      <AdminTopbar title="Comments" />
      <div className="flex-1 p-4 sm:p-6">
        <CommentsList comments={comments} />
      </div>
    </>
  );
}
