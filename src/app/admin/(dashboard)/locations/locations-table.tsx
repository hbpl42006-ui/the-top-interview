"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";
import { slugify } from "@/lib/utils";
import type { StateInfo } from "@/lib/types";

export function LocationsTable({ states }: { states: StateInfo[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const filtered = states.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  async function handleCreate(formData: FormData) {
    const name = String(formData.get("name") || "").trim();
    const cities = String(formData.get("cities") || "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    if (!name) return;
    setError("");
    const res = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: slugify(name), cities }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error || "Failed to create state.");
      return;
    }
    setModalOpen(false);
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/locations/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={() => setModalOpen(true)} addLabel="New State" />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">State</th>
              <th className="px-4 py-2.5">Cities</th>
              <th className="px-4 py-2.5">Stories</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2.5 font-medium">{s.name}</td>
                <td className="max-w-xs truncate px-4 py-2.5 text-muted">{s.cities.join(", ")}</td>
                <td className="px-4 py-2.5 text-muted">{s.storyCount}</td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => remove(s.id)} className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New State">
        <form action={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">State Name</label>
            <input name="name" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Cities (comma-separated)</label>
            <input name="cities" placeholder="City A, City B, City C" className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            Save State
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
