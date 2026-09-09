"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, MapPin, Pencil } from "lucide-react";
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
  mapQuery: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  reporterId: string;
  reporter: { name: string };
  city: { name: string } | null;
}

export function GroundReportsTable({
  reports,
  reporters,
}: {
  reports: Row[];
  reporters: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [error, setError] = useState("");
  const filtered = reports.filter((r) => r.headline.toLowerCase().includes(search.toLowerCase()));

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
    const headline = String(formData.get("headline") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const reporterId = String(formData.get("reporterId") || "");
    const excerpt = String(formData.get("excerpt") || "").trim();
    const body = String(formData.get("body") || "").trim();
    if (!headline || !reporterId || excerpt.length < 10 || body.length < 20) {
      setError("Please fill in headline, reporter, excerpt (10+ chars) and body (20+ chars).");
      return;
    }
    setError("");

    if (editing) {
      const image = String(formData.get("image") || "").trim() || editing.image;
      const res = await fetch(`/api/ground-reports/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, excerpt, body, image, mapQuery: location || headline, reporterId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to update ground report.");
        return;
      }
      setModalOpen(false);
      setEditing(null);
      router.refresh();
      return;
    }

    const res = await fetch("/api/ground-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: `${slugify(headline)}-${Date.now()}`,
        headline,
        excerpt,
        body,
        image: "https://picsum.photos/seed/new-ground-report/900/600",
        mapQuery: location || headline,
        reporterId,
        status: "DRAFT",
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error || "Failed to create ground report.");
      return;
    }
    setModalOpen(false);
    router.refresh();
  }

  async function cycleStatus(id: string, current: string) {
    const order = ["DRAFT", "SCHEDULED", "PUBLISHED"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    await fetch(`/api/ground-reports/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/ground-reports/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={openCreate} addLabel="New Ground Report" />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">Headline</th>
              <th className="px-4 py-2.5">Location</th>
              <th className="px-4 py-2.5">Reporter</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Created</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="max-w-xs truncate px-4 py-2.5 font-medium">{r.headline}</td>
                <td className="px-4 py-2.5 text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {r.city?.name ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-muted">{r.reporter.name}</td>
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
                      aria-label={`Edit ${r.headline}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => remove(r.id)}
                      aria-label={`Delete ${r.headline}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                    >
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
        title={editing ? "Edit Ground Report" : "New Ground Report"}
      >
        <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Headline</label>
            <input name="headline" required defaultValue={editing?.headline} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Location</label>
            <input name="location" placeholder="e.g. Indira Nagar, Lucknow" defaultValue={editing?.mapQuery} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Reporter</label>
            <select name="reporterId" required defaultValue={editing?.reporterId ?? ""} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
              <option value="" disabled>
                Select a reporter
              </option>
              {reporters.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Excerpt</label>
            <textarea name="excerpt" required rows={2} defaultValue={editing?.excerpt} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Body</label>
            <textarea name="body" required rows={5} defaultValue={editing?.body} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          {editing && (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Image URL</label>
              <input name="image" type="url" defaultValue={editing.image} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
          )}
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            {editing ? "Save Changes" : "Save Ground Report"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
