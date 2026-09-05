"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";
import { StatusPill } from "@/components/admin/status-pill";
import { formatDate, slugify } from "@/lib/utils";
import { portrait } from "@/lib/images";

interface Row {
  id: string;
  slug: string;
  topic: string;
  category: string;
  status: string;
  createdAt: string;
  guest: { name: string };
  reporter: { name: string };
}

export function InterviewsTable({
  interviews,
  reporters,
  categories,
}: {
  interviews: Row[];
  reporters: { id: string; name: string }[];
  categories: string[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const filtered = interviews.filter((r) => r.topic.toLowerCase().includes(search.toLowerCase()));

  async function handleCreate(formData: FormData) {
    const guestName = String(formData.get("guestName") || "").trim();
    const guestDesignation = String(formData.get("guestDesignation") || "").trim();
    const topic = String(formData.get("topic") || "").trim();
    const category = String(formData.get("category") || "");
    const reporterId = String(formData.get("reporterId") || "");
    const excerpt = String(formData.get("excerpt") || "").trim();
    const body = String(formData.get("body") || "").trim();
    if (!guestName || !guestDesignation || !topic || !reporterId || excerpt.length < 10 || body.length < 20) {
      setError("Please fill in every field. Excerpt needs 10+ characters, body needs 20+.");
      return;
    }
    setError("");
    const guestSlug = slugify(guestName);
    const res = await fetch("/api/interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: `${guestSlug}-${Date.now()}`,
        topic,
        excerpt,
        body,
        thumbnail: "https://picsum.photos/seed/new-interview/900/600",
        duration: "0:00",
        category,
        reporterId,
        status: "DRAFT",
        guest: { slug: guestSlug, name: guestName, designation: guestDesignation, category, photo: portrait(guestSlug), bio: excerpt },
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error || "Failed to create interview.");
      return;
    }
    setModalOpen(false);
    router.refresh();
  }

  async function cycleStatus(id: string, current: string) {
    const order = ["DRAFT", "SCHEDULED", "PUBLISHED"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    await fetch(`/api/interviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/interviews/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={() => setModalOpen(true)} addLabel="New Interview" />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-190 text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">Guest</th>
              <th className="px-4 py-2.5">Topic</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Created</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-2.5 font-medium">{r.guest.name}</td>
                <td className="max-w-xs truncate px-4 py-2.5 text-muted">{r.topic}</td>
                <td className="px-4 py-2.5 text-muted">{r.category}</td>
                <td className="px-4 py-2.5">
                  <button onClick={() => cycleStatus(r.id, r.status)}>
                    <StatusPill status={r.status.toLowerCase()} />
                  </button>
                </td>
                <td className="px-4 py-2.5 text-muted">{formatDate(r.createdAt)}</td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => remove(r.id)} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New Interview">
        <form action={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Guest Name</label>
              <input name="guestName" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Guest Designation</label>
              <input name="guestDesignation" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Topic</label>
            <input name="topic" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Category</label>
              <select name="category" defaultValue={categories[0]} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Reporter</label>
              <select name="reporterId" required defaultValue="" className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
                <option value="" disabled>
                  Select
                </option>
                {reporters.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Excerpt</label>
            <textarea name="excerpt" required rows={2} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Body</label>
            <textarea name="body" required rows={5} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            Save Interview
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
