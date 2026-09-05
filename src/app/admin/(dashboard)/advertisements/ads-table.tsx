"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";
import { StatusPill } from "@/components/admin/status-pill";
import { formatViews } from "@/lib/utils";

const PLACEMENTS = ["HEADER", "IN_ARTICLE", "SIDEBAR", "HOMEPAGE", "VIDEO_PAGE", "PODCAST_PAGE", "FOOTER"];

interface AdRow {
  id: string;
  name: string;
  placement: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
}

export function AdsTable({ ads }: { ads: AdRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const filtered = ads.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

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

  async function handleCreate(formData: FormData) {
    const name = String(formData.get("name") || "").trim();
    const placement = String(formData.get("placement") || "HOMEPAGE");
    if (!name) return;
    setError("");
    const res = await fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, placement, isActive: false }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error || "Failed to create ad slot.");
      return;
    }
    setModalOpen(false);
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={() => setModalOpen(true)} addLabel="New Ad Slot" />
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
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => remove(a.id)} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New Ad Slot">
        <form action={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Slot Name</label>
            <input name="name" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Placement</label>
            <select name="placement" className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
              {PLACEMENTS.map((p) => (
                <option key={p} value={p}>
                  {p.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted">
            Connect an ad network (e.g. Google Ad Manager) and set its script/tag ID via environment variables to
            serve live creative in this slot.
          </p>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            Save Ad Slot
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
