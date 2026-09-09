"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";
import { slugify } from "@/lib/utils";

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  storyCount: number;
}

export function CategoriesTable({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [error, setError] = useState("");
  const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  function openCreate() {
    setEditing(null);
    setError("");
    setModalOpen(true);
  }

  function openEdit(category: CategoryRow) {
    setEditing(category);
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    const name = String(formData.get("name") || "").trim();
    if (!name) return;
    setError("");
    const res = await fetch(editing ? `/api/categories/${editing.id}` : "/api/categories", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { name } : { name, slug: slugify(name) }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error || "Failed to save category.");
      return;
    }
    setModalOpen(false);
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={openCreate} addLabel="New Category" />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[500px] text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Slug</th>
              <th className="px-4 py-2.5">Stories</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2.5 font-medium">{c.name}</td>
                <td className="px-4 py-2.5 text-muted">/{c.slug}</td>
                <td className="px-4 py-2.5 text-muted">{c.storyCount}</td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      aria-label={`Edit ${c.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      aria-label={`Delete ${c.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No categories match your search.
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
        title={editing ? "Edit Category" : "New Category"}
      >
        <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Category Name</label>
            <input name="name" required defaultValue={editing?.name} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            {editing ? "Save Changes" : "Save Category"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
