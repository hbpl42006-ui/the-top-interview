"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";
import { StatusPill } from "@/components/admin/status-pill";
import { formatDate, slugify } from "@/lib/utils";

interface Row {
  id: string;
  slug: string;
  episodeNumber: number;
  title: string;
  guestName: string;
  category: string;
  status: string;
  createdAt: string;
}

export function PodcastsTable({ episodes, categories }: { episodes: Row[]; categories: string[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const filtered = episodes.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
  const nextEpisodeNumber = (episodes[0]?.episodeNumber ?? 0) + 1;

  async function handleCreate(formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    const guestName = String(formData.get("guestName") || "").trim();
    const category = String(formData.get("category") || "");
    const description = String(formData.get("description") || "").trim();
    const audioUrl = String(formData.get("audioUrl") || "").trim();
    const youtubeUrl = String(formData.get("youtubeUrl") || "").trim();
    if (!title || !guestName || description.length < 10 || !audioUrl) {
      setError("Please fill in title, guest, description (10+ chars) and an audio URL.");
      return;
    }
    setError("");
    const res = await fetch("/api/podcasts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: `${slugify(title)}-${Date.now()}`,
        episodeNumber: nextEpisodeNumber,
        title,
        guestName,
        description,
        cover: "https://picsum.photos/seed/new-podcast/800/800",
        audioUrl,
        duration: "0:00",
        category,
        youtubeUrl: youtubeUrl || undefined,
        status: "DRAFT",
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error || "Failed to create episode.");
      return;
    }
    setModalOpen(false);
    router.refresh();
  }

  async function cycleStatus(id: string, current: string) {
    const order = ["DRAFT", "SCHEDULED", "PUBLISHED"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    await fetch(`/api/podcasts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/podcasts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={() => setModalOpen(true)} addLabel="New Episode" />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-190 text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">Ep.</th>
              <th className="px-4 py-2.5">Title</th>
              <th className="px-4 py-2.5">Guest</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Created</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-2.5 font-medium">{r.episodeNumber}</td>
                <td className="max-w-xs truncate px-4 py-2.5">{r.title}</td>
                <td className="px-4 py-2.5 text-muted">{r.guestName}</td>
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

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New Episode">
        <form action={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Episode Title</label>
            <input name="title" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Guest</label>
            <input name="guestName" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Description</label>
            <textarea name="description" required rows={3} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
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
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Audio URL</label>
            <input name="audioUrl" required placeholder="https://..." className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">YouTube URL (optional)</label>
            <input name="youtubeUrl" placeholder="https://youtube.com/..." className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <p className="text-xs text-muted">
            Uploading an audio file directly requires Cloudinary — set <code className="font-mono">CLOUDINARY_*</code> env vars, then use the upload
            button (coming from the same media pipeline as images) instead of pasting a URL.
          </p>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            Save Episode
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
