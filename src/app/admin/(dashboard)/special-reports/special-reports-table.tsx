"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";
import { StatusPill } from "@/components/admin/status-pill";
import { formatDate, slugify } from "@/lib/utils";

interface Row {
  id: string;
  slug: string;
  title: string;
  dek: string;
  image: string;
  location: string;
  status: string;
  createdAt: string;
}

export function SpecialReportsTable({ reports }: { reports: Row[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [error, setError] = useState("");
  const filtered = reports.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));

  function openCreate() {
    setEditing(null);
    setError("");
    setModalOpen(true);
  }

  function openEdit(report: Row) {
    setEditing(report);
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    const dek = String(formData.get("dek") || "").trim();
    const location = String(formData.get("location") || "").trim();

    if (editing) {
      if (!title || dek.length < 10 || !location) {
        setError("Please fill in title, location and a dek of at least 10 characters.");
        return;
      }
      setError("");
      const image = String(formData.get("image") || "").trim() || editing.image;
      const res = await fetch(`/api/special-reports/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, dek, location, image }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to update special report.");
        return;
      }
      setModalOpen(false);
      setEditing(null);
      router.refresh();
      return;
    }

    const chapterTitle = String(formData.get("chapterTitle") || "").trim();
    const chapterBody = String(formData.get("chapterBody") || "").trim();
    if (!title || dek.length < 10 || !location || !chapterTitle || chapterBody.length < 10) {
      setError("Please fill in every field (dek and chapter body need 10+ characters).");
      return;
    }
    setError("");
    const res = await fetch("/api/special-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: `${slugify(title)}-${Date.now()}`,
        title,
        dek,
        image: "https://picsum.photos/seed/new-special-report/1600/900",
        location,
        chapters: [{ title: chapterTitle, body: chapterBody }],
        timeline: [],
        status: "DRAFT",
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error || "Failed to create special report.");
      return;
    }
    setModalOpen(false);
    router.refresh();
  }

  async function cycleStatus(id: string, current: string) {
    const order = ["DRAFT", "SCHEDULED", "PUBLISHED"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    await fetch(`/api/special-reports/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/special-reports/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={openCreate} addLabel="New Special Report" />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-180 text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">Title</th>
              <th className="px-4 py-2.5">Location</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Created</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="max-w-xs truncate px-4 py-2.5 font-medium">{r.title}</td>
                <td className="px-4 py-2.5 text-muted">{r.location}</td>
                <td className="px-4 py-2.5">
                  <button onClick={() => cycleStatus(r.id, r.status)}>
                    <StatusPill status={r.status.toLowerCase()} />
                  </button>
                </td>
                <td className="px-4 py-2.5 text-muted">{formatDate(r.createdAt)}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(r)}
                      aria-label={`Edit ${r.title}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                    >
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => remove(r.id)} aria-label={`Delete ${r.title}`} className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand">
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
        title={editing ? "Edit Special Report" : "New Special Report"}
      >
        <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Title</label>
            <input name="title" required defaultValue={editing?.title} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Dek (summary)</label>
            <textarea name="dek" required rows={2} defaultValue={editing?.dek} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Location</label>
            <input name="location" required defaultValue={editing?.location} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          {editing ? (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Cover Image URL</label>
                <input name="image" type="url" defaultValue={editing.image} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
              </div>
              <p className="text-xs text-muted">Chapters and timeline entries aren&apos;t editable here yet — only the title, dek, location and cover image.</p>
            </>
          ) : (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">First Chapter Title</label>
                <input name="chapterTitle" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">First Chapter Body</label>
                <textarea name="chapterBody" required rows={4} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
              </div>
              <p className="text-xs text-muted">Additional chapters and a timeline can be added later via the database or a future editing form.</p>
            </>
          )}
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            {editing ? "Save Changes" : "Save Special Report"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
