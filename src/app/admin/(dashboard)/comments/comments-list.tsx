"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusPill } from "@/components/admin/status-pill";
import { timeAgo } from "@/lib/utils";

interface CommentRow {
  id: string;
  name: string;
  message: string;
  status: string;
  createdAt: string;
  article: { slug: string; headline: string };
}

export function CommentsList({ comments }: { comments: CommentRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const filtered = comments.filter(
    (c) => c.message.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase())
  );

  async function setStatus(id: string, status: "APPROVED" | "REJECTED") {
    await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} />
      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-bold">{c.name}</span>
                <span className="ml-2 text-xs text-muted">on {c.article.headline}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={c.status.toLowerCase()} />
                <span className="text-xs text-muted">{timeAgo(c.createdAt)}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-foreground/90">{c.message}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setStatus(c.id, "APPROVED")}
                className="flex items-center gap-1 rounded-sm border border-border px-3 py-1.5 text-xs font-bold uppercase transition hover:border-green-600 hover:text-green-600"
              >
                <Check size={13} /> Approve
              </button>
              <button
                onClick={() => setStatus(c.id, "REJECTED")}
                className="flex items-center gap-1 rounded-sm border border-border px-3 py-1.5 text-xs font-bold uppercase transition hover:border-brand hover:text-brand"
              >
                <X size={13} /> Reject
              </button>
              <button
                onClick={() => remove(c.id)}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-8 text-center text-muted">No comments found.</p>}
      </div>
    </div>
  );
}
