"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, MapPin } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";
import { StatusPill } from "@/components/admin/status-pill";
import { formatDate, slugify } from "@/lib/utils";

interface Row {
  id: string;
  slug: string;
  headline: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
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
  const [error, setError] = useState("");
  const filtered = reports.filter((r) => r.headline.toLowerCase().includes(search.toLowerCase()));

  async function handleCreate(formData: FormData) {
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
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={() => setModalOpen(true)} addLabel="New Ground Report" />
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
                <td className="px-4 py-2.5 text-right">
                  <button
                    onClick={() => remove(r.id)}
                    className="ml-auto flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New Ground Report">
        <form action={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Headline</label>
            <input name="headline" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Location</label>
            <input name="location" placeholder="e.g. Indira Nagar, Lucknow" className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Reporter</label>
            <select name="reporterId" required defaultValue="" className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
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
            <textarea name="excerpt" required rows={2} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Body</label>
            <textarea name="body" required rows={5} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            Save Ground Report
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
