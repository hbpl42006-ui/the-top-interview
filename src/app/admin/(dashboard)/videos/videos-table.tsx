"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";
import { StatusPill } from "@/components/admin/status-pill";
import { formatDate, slugify } from "@/lib/utils";

const CATEGORIES = ["news", "ground-report", "interview", "podcast", "special-report"];

interface Row {
  id: string;
  slug: string;
  title: string;
  youtubeId: string;
  category: string;
  duration: string;
  status: string;
  createdAt: string;
}

export function VideosTable({ videos }: { videos: Row[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [error, setError] = useState("");
  const filtered = videos.filter((v) => v.title.toLowerCase().includes(search.toLowerCase()));

  function openCreate() {
    setEditing(null);
    setError("");
    setModalOpen(true);
  }

  function openEdit(video: Row) {
    setEditing(video);
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    const youtubeId = String(formData.get("youtubeId") || "").trim();
    const category = String(formData.get("category") || "news");
    const duration = String(formData.get("duration") || "0:00").trim();
    if (!title || !youtubeId) {
      setError("Please provide a title and a YouTube video ID.");
      return;
    }
    setError("");

    if (editing) {
      const res = await fetch(`/api/videos/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
          youtubeId,
          duration,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to update video.");
        return;
      }
      setModalOpen(false);
      setEditing(null);
      router.refresh();
      return;
    }

    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: `${slugify(title)}-${Date.now()}`,
        title,
        category,
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        youtubeId,
        duration,
        status: "DRAFT",
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error || "Failed to create video.");
      return;
    }
    setModalOpen(false);
    router.refresh();
  }

  async function cycleStatus(id: string, current: string) {
    const order = ["DRAFT", "SCHEDULED", "PUBLISHED"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    await fetch(`/api/videos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={openCreate} addLabel="New Video" />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-180 text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">Title</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Created</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((v) => (
              <tr key={v.id}>
                <td className="max-w-xs truncate px-4 py-2.5 font-medium">{v.title}</td>
                <td className="px-4 py-2.5 text-muted">{v.category}</td>
                <td className="px-4 py-2.5">
                  <button onClick={() => cycleStatus(v.id, v.status)}>
                    <StatusPill status={v.status.toLowerCase()} />
                  </button>
                </td>
                <td className="px-4 py-2.5 text-muted">{formatDate(v.createdAt)}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(v)}
                      aria-label={`Edit ${v.title}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                    >
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => remove(v.id)} aria-label={`Delete ${v.title}`} className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Video" : "New Video"}
      >
        <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Title</label>
            <input name="title" required defaultValue={editing?.title} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">YouTube Video ID</label>
            <input name="youtubeId" required placeholder="e.g. dQw4w9WgXcQ" defaultValue={editing?.youtubeId} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Category</label>
              <select name="category" defaultValue={editing?.category ?? CATEGORIES[0]} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Duration</label>
              <input name="duration" placeholder="8:42" defaultValue={editing?.duration} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            {editing ? "Save Changes" : "Save Video"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
