"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Star, Radio, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";
import { StatusPill } from "@/components/admin/status-pill";
import { formatDate, slugify } from "@/lib/utils";

interface Row {
  id: string;
  slug: string;
  headline: string;
  excerpt: string;
  body: string;
  image: string;
  status: string;
  isBreaking: boolean;
  isFeatured: boolean;
  createdAt: string;
  categoryId: string;
  reporterId: string;
  category: { name: string };
  reporter: { name: string };
}

export function NewsTable({
  articles,
  categories,
  reporters,
}: {
  articles: Row[];
  categories: { id: string; name: string }[];
  reporters: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [error, setError] = useState("");
  const filtered = articles.filter((a) => a.headline.toLowerCase().includes(search.toLowerCase()));

  function openCreate() {
    setEditing(null);
    setError("");
    setModalOpen(true);
  }

  function openEdit(article: Row) {
    setEditing(article);
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    const headline = String(formData.get("headline") || "").trim();
    const categoryId = String(formData.get("categoryId") || "");
    const reporterId = String(formData.get("reporterId") || "");
    const excerpt = String(formData.get("excerpt") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const status = String(formData.get("status") || "DRAFT");
    if (!headline || !categoryId || !reporterId || excerpt.length < 10 || body.length < 20) {
      setError("Please fill in headline, category, reporter, excerpt (10+ chars) and body (20+ chars).");
      return;
    }
    setError("");

    if (editing) {
      const image = String(formData.get("image") || "").trim() || editing.image;
      const res = await fetch(`/api/news/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, excerpt, body, image, categoryId, reporterId, status }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to update article.");
        return;
      }
      setModalOpen(false);
      setEditing(null);
      router.refresh();
      return;
    }

    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: `${slugify(headline)}-${Date.now()}`,
        headline,
        excerpt,
        body,
        image: "https://picsum.photos/seed/new-story/900/600",
        categoryId,
        reporterId,
        status,
        tagNames: [],
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error || "Failed to create article.");
      return;
    }
    setModalOpen(false);
    router.refresh();
  }

  async function toggleFlag(id: string, key: "isBreaking" | "isFeatured", value: boolean) {
    await fetch(`/api/news/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: !value }),
    });
    router.refresh();
  }

  async function cycleStatus(id: string, current: string) {
    const order = ["DRAFT", "SCHEDULED", "PUBLISHED"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    await fetch(`/api/news/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={openCreate} addLabel="New Article" />

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-215 text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">Headline</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">Reporter</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Flags</th>
              <th className="px-4 py-2.5">Created</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="max-w-xs truncate px-4 py-2.5 font-medium">{r.headline}</td>
                <td className="px-4 py-2.5 text-muted">{r.category.name}</td>
                <td className="px-4 py-2.5 text-muted">{r.reporter.name}</td>
                <td className="px-4 py-2.5">
                  <button onClick={() => cycleStatus(r.id, r.status)}>
                    <StatusPill status={r.status.toLowerCase()} />
                  </button>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => toggleFlag(r.id, "isBreaking", r.isBreaking)}
                      title="Toggle breaking news"
                      className={`flex h-7 w-7 items-center justify-center rounded-full border ${r.isBreaking ? "border-brand bg-brand text-white" : "border-border text-muted"}`}
                    >
                      <Radio size={12} />
                    </button>
                    <button
                      onClick={() => toggleFlag(r.id, "isFeatured", r.isFeatured)}
                      title="Toggle featured"
                      className={`flex h-7 w-7 items-center justify-center rounded-full border ${r.isFeatured ? "border-brand bg-brand text-white" : "border-border text-muted"}`}
                    >
                      <Star size={12} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-muted">{formatDate(r.createdAt)}</td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-2">
                    <a
                      href={`/news/${r.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Preview on site"
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                    >
                      <Eye size={14} />
                    </a>
                    <button
                      onClick={() => openEdit(r)}
                      aria-label={`Edit ${r.headline}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                    >
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => remove(r.id)} aria-label={`Delete ${r.headline}`} className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  No articles match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Article" : "New Article"}
      >
        <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Headline</label>
            <input name="headline" required defaultValue={editing?.headline} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Category</label>
              <select name="categoryId" required defaultValue={editing?.categoryId ?? ""} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
                <option value="" disabled>
                  Select
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Reporter</label>
              <select name="reporterId" required defaultValue={editing?.reporterId ?? ""} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
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
            <textarea name="excerpt" required rows={2} defaultValue={editing?.excerpt} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Body</label>
            <textarea name="body" required rows={6} defaultValue={editing?.body} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          {editing && (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Image URL</label>
              <input name="image" type="url" defaultValue={editing.image} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Status</label>
            <select name="status" defaultValue={editing?.status ?? "DRAFT"} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PUBLISHED">Publish Now</option>
            </select>
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            {editing ? "Save Changes" : "Save Article"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
