"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";
import { portrait } from "@/lib/images";
import { slugify } from "@/lib/utils";
import type { Reporter } from "@/lib/types";

export function ReportersTable({ reporters }: { reporters: Reporter[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Reporter | null>(null);
  const [error, setError] = useState("");
  const filtered = reporters.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  function openCreate() {
    setEditing(null);
    setError("");
    setModalOpen(true);
  }

  function openEdit(reporter: Reporter) {
    setEditing(reporter);
    setError("");
    setModalOpen(true);
  }

  function optionalField(formData: FormData, key: string) {
    const v = String(formData.get(key) || "").trim();
    return v.length ? v : null;
  }

  async function handleSubmit(formData: FormData) {
    const name = String(formData.get("name") || "").trim();
    const designation = String(formData.get("designation") || "").trim();
    const bio = String(formData.get("bio") || "").trim();
    if (!name || !designation || bio.length < 10) {
      setError("Please fill in name, designation and a bio of at least 10 characters.");
      return;
    }
    setError("");

    if (editing) {
      const photo = String(formData.get("photo") || "").trim() || editing.photo;
      const res = await fetch(`/api/reporters/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          designation,
          bio,
          photo,
          twitter: optionalField(formData, "twitter"),
          instagram: optionalField(formData, "instagram"),
          email: optionalField(formData, "email"),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to update reporter.");
        return;
      }
      setModalOpen(false);
      setEditing(null);
      router.refresh();
      return;
    }

    const slug = slugify(name);
    const res = await fetch("/api/reporters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, designation, bio, photo: portrait(slug) }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error || "Failed to create reporter.");
      return;
    }
    setModalOpen(false);
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/reporters/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={openCreate} addLabel="New Reporter" />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">Reporter</th>
              <th className="px-4 py-2.5">Designation</th>
              <th className="px-4 py-2.5">Location</th>
              <th className="px-4 py-2.5">Articles</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="flex items-center gap-2.5 px-4 py-2.5 font-medium">
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                    <Image src={r.photo} alt={r.name} fill className="object-cover" sizes="32px" />
                  </div>
                  {r.name}
                </td>
                <td className="px-4 py-2.5 text-muted">{r.designation}</td>
                <td className="px-4 py-2.5 text-muted">{r.location}</td>
                <td className="px-4 py-2.5 text-muted">{r.articleCount}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(r)}
                      aria-label={`Edit ${r.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                    >
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => remove(r.id)} aria-label={`Delete ${r.name}`} className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand">
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
        title={editing ? "Edit Reporter" : "New Reporter"}
      >
        <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Full Name</label>
            <input name="name" required defaultValue={editing?.name} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Designation</label>
            <input name="designation" required placeholder="Ground Reporter" defaultValue={editing?.designation} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Short Bio</label>
            <textarea name="bio" required rows={3} defaultValue={editing?.bio} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          {editing && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Photo URL</label>
                <input name="photo" type="url" defaultValue={editing.photo} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Twitter / X URL</label>
                  <input name="twitter" type="url" defaultValue={editing.twitter ?? ""} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Instagram URL</label>
                  <input name="instagram" type="url" defaultValue={editing.instagram ?? ""} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Email</label>
                <input name="email" type="email" defaultValue={editing.email ?? ""} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
              </div>
            </>
          )}
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            {editing ? "Save Changes" : "Save Reporter"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
