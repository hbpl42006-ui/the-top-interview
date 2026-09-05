import { MessageCircle } from "lucide-react";
import { getApprovedComments } from "@/lib/data/comments";
import { timeAgo } from "@/lib/utils";
import { CommentForm } from "@/components/article/comment-form";

export async function CommentsSection({ articleSlug }: { articleSlug: string }) {
  const comments = await getApprovedComments(articleSlug);

  return (
    <div className="border-t border-border pt-8">
      <h2 className="mb-5 flex items-center gap-2 font-serif text-xl font-bold">
        <MessageCircle size={20} /> Comments ({comments.length})
      </h2>

      <CommentForm articleSlug={articleSlug} />

      {comments.length === 0 ? (
        <p className="text-sm text-muted">No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <ul className="space-y-5">
          {comments.map((c) => (
            <li key={c.id} className="border-b border-border pb-5 last:border-none">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-bold">{c.name}</span>
                <span className="text-xs text-muted">{timeAgo(c.createdAt.toISOString())}</span>
              </div>
              <p className="text-sm text-foreground/90">{c.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
