"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";
import { StatusPill } from "@/components/admin/status-pill";
import { formatViews } from "@/lib/utils";

const PLACEMENTS = ["HEADER", "IN_ARTICLE", "SIDEBAR", "HOMEPAGE", "VIDEO_PAGE", "PODCAST_PAGE", "FOOTER"];

interface AdRow {
  id: string;
  name: string;
  placement: string;
  creativeUrl?: string | null;
  targetUrl?: string | null;
  isActive: boolean;
  impressions: number;
  clicks: number;
}

export function AdsTable({ ads }: { ads: AdRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdRow | null>(null);
  const [error, setError] = useState("");
  const filtered = ads.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  function openCreate() {
    setEditing(null);
    setError("");
    setModalOpen(true);
  }

  function openEdit(ad: AdRow) {
    setEditing(ad);
    setError("");
    setModalOpen(true);
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/ads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/ads/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function optionalUrl(formData: FormData, key: string) {
    const v = String(formData.get(key) || "").trim();
    return v.length ? v : null;
  }

  async function handleSubmit(formData: FormData) {
    const name = String(formData.get("name") || "").trim();
    const placement = String(formData.get("placement") || "HOMEPAGE");
    if (!name) return;
    setError("");

    const payload = editing
      ? {
          name,
          placement,
          creativeUrl: optionalUrl(formData, "creativeUrl"),
          targetUrl: optionalUrl(formData, "targetUrl"),
        }
      : { name, placement, isActive: false };

    const res = await fetch(editing ? `/api/ads/${editing.id}` : "/api/ads", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error || "Failed to save ad slot.");
      return;
    }
    setModalOpen(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={openCreate} addLabel="New Ad Slot" />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-180 text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Placement</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Impressions</th>
              <th className="px-4 py-2.5">Clicks</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-2.5 font-medium">{a.name}</td>
                <td className="px-4 py-2.5 text-muted capitalize">{a.placement.replace(/_/g, " ").toLowerCase()}</td>
                <td className="px-4 py-2.5">
                  <button onClick={() => toggleActive(a.id, a.isActive)}>
                    <StatusPill status={a.isActive ? "active" : "paused"} />
                  </button>
                </td>
                <td className="px-4 py-2.5 text-muted">{formatViews(a.impressions)}</td>
                <td className="px-4 py-2.5 text-muted">{formatViews(a.clicks)}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(a)}
                      aria-label={`Edit ${a.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                    >
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => remove(a.id)} aria-label={`Delete ${a.name}`} className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand">
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
        title={editing ? "Edit Ad Slot" : "New Ad Slot"}
      >
        <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Slot Name</label>
            <input name="name" required defaultValue={editing?.name} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Placement</label>
            <select name="placement" defaultValue={editing?.placement ?? "HOMEPAGE"} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
              {PLACEMENTS.map((p) => (
                <option key={p} value={p}>
                  {p.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          {editing && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Creative Image URL</label>
                <input name="creativeUrl" type="url" defaultValue={editing.creativeUrl ?? ""} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Click-through (Target) URL</label>
                <input name="targetUrl" type="url" defaultValue={editing.targetUrl ?? ""} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
              </div>
            </>
          )}
          <p className="text-xs text-muted">
            Connect an ad network (e.g. Google Ad Manager) and set its script/tag ID via environment variables to
            serve live creative in this slot.
          </p>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            {editing ? "Save Changes" : "Save Ad Slot"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
