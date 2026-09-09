"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";
import { StatusPill } from "@/components/admin/status-pill";
import { ImageUploadField } from "@/components/admin/image-upload-field";

interface TeamMemberRow {
  id: string;
  name: string;
  designation: string;
  bio: string;
  photo: string;
  twitter: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  isActive: boolean;
  displayOrder: number;
}

export function TeamMembersTable({ members }: { members: TeamMemberRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMemberRow | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filtered = members.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.designation.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditing(null);
    setError("");
    setModalOpen(true);
  }

  function openEdit(member: TeamMemberRow) {
    setEditing(member);
    setError("");
    setModalOpen(true);
  }

  function optionalUrl(formData: FormData, key: string) {
    const v = String(formData.get(key) || "").trim();
    return v.length ? v : null;
  }

  async function handleSubmit(formData: FormData) {
    const name = String(formData.get("name") || "").trim();
    const designation = String(formData.get("designation") || "").trim();
    const bio = String(formData.get("bio") || "").trim();
    const photo = String(formData.get("photo") || "").trim();

    if (!name || !designation || bio.length < 10) {
      setError("Please fill in name, designation and a bio of at least 10 characters.");
      return;
    }
    if (!photo) {
      setError("Please upload a profile image.");
      return;
    }

    const payload = {
      name,
      designation,
      bio,
      photo,
      twitter: optionalUrl(formData, "twitter"),
      instagram: optionalUrl(formData, "instagram"),
      facebook: optionalUrl(formData, "facebook"),
      linkedin: optionalUrl(formData, "linkedin"),
      isActive: formData.get("isActive") === "on",
      displayOrder: Number(formData.get("displayOrder") || 0),
    };

    setError("");
    setSaving(true);
    try {
      const res = await fetch(editing ? `/api/team-members/${editing.id}` : "/api/team-members", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to save team member.");
        return;
      }
      setModalOpen(false);
      setEditing(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(member: TeamMemberRow) {
    await fetch(`/api/team-members/${member.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !member.isActive }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/team-members/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={openCreate} addLabel="New Team Member" />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">Member</th>
              <th className="px-4 py-2.5">Designation</th>
              <th className="px-4 py-2.5">Order</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((m) => (
              <tr key={m.id}>
                <td className="flex items-center gap-2.5 px-4 py-2.5 font-medium">
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                    <Image src={m.photo} alt={m.name} fill className="object-cover" sizes="32px" />
                  </div>
                  {m.name}
                </td>
                <td className="px-4 py-2.5 text-muted">{m.designation}</td>
                <td className="px-4 py-2.5 text-muted">{m.displayOrder}</td>
                <td className="px-4 py-2.5">
                  <button onClick={() => toggleActive(m)}>
                    <StatusPill status={m.isActive ? "active" : "paused"} />
                  </button>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(m)}
                      aria-label={`Edit ${m.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => remove(m.id)}
                      aria-label={`Delete ${m.name}`}
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
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No team members yet.
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
        title={editing ? "Edit Team Member" : "New Team Member"}
      >
        <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
          <ImageUploadField
            name="photo"
            label="Profile Image"
            folder="team"
            defaultValue={editing?.photo}
            required
            onUploadingChange={setUploading}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Full Name</label>
              <input name="name" required defaultValue={editing?.name} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Designation</label>
              <input name="designation" required placeholder="Founder / Editor" defaultValue={editing?.designation} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Short Bio</label>
            <textarea name="bio" required rows={3} defaultValue={editing?.bio} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Twitter / X URL</label>
              <input name="twitter" type="url" placeholder="https://x.com/..." defaultValue={editing?.twitter ?? ""} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Instagram URL</label>
              <input name="instagram" type="url" placeholder="https://instagram.com/..." defaultValue={editing?.instagram ?? ""} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Facebook URL</label>
              <input name="facebook" type="url" placeholder="https://facebook.com/..." defaultValue={editing?.facebook ?? ""} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">LinkedIn URL</label>
              <input name="linkedin" type="url" placeholder="https://linkedin.com/..." defaultValue={editing?.linkedin ?? ""} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
          </div>
          <div className="grid grid-cols-2 items-end gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Display Order</label>
              <input
                name="displayOrder"
                type="number"
                min={0}
                defaultValue={editing?.displayOrder ?? members.length}
                className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
              <p className="mt-1 text-xs text-muted">Lower numbers appear first on the About page.</p>
            </div>
            <label className="mb-2.5 flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="isActive" defaultChecked={editing?.isActive ?? true} className="h-4 w-4 accent-brand" />
              Active (visible on About page)
            </label>
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? "Saving..." : editing ? "Save Changes" : "Add Team Member"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
