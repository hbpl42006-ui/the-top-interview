"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminModal } from "@/components/admin/admin-modal";

const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "REPORTER", "VIDEO_EDITOR", "PODCAST_MANAGER", "MODERATOR", "USER"];

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export function UsersTable({ users, currentUserId }: { users: UserRow[]; currentUserId?: string }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [error, setError] = useState("");
  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  function openCreate() {
    setEditing(null);
    setError("");
    setModalOpen(true);
  }

  function openEdit(user: UserRow) {
    setEditing(user);
    setError("");
    setModalOpen(true);
  }

  async function updateRole(id: string, role: string) {
    await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleSubmit(formData: FormData) {
    setError("");

    if (editing) {
      const name = String(formData.get("name") || "").trim();
      const role = String(formData.get("role") || editing.role);
      const password = String(formData.get("password") || "").trim();
      if (!name) {
        setError("Name is required.");
        return;
      }
      const res = await fetch(`/api/users/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, ...(password ? { password } : {}) }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to update user.");
        return;
      }
      setModalOpen(false);
      setEditing(null);
      router.refresh();
      return;
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error || "Failed to create user.");
      return;
    }
    setModalOpen(false);
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader search={search} onSearchChange={setSearch} onAdd={openCreate} addLabel="New User" />
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-surface-muted text-left text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Email</th>
              <th className="px-4 py-2.5">Role</th>
              <th className="px-4 py-2.5">Joined</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2.5 font-medium">
                  {u.name} {u.id === currentUserId && <span className="text-xs text-muted">(you)</span>}
                </td>
                <td className="px-4 py-2.5 text-muted">{u.email}</td>
                <td className="px-4 py-2.5">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u.id, e.target.value)}
                    className="rounded-sm border border-border bg-background px-2 py-1 text-xs outline-none focus:border-brand"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2.5 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(u)}
                      aria-label={`Edit ${u.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => remove(u.id)}
                      disabled={u.id === currentUserId}
                      aria-label={`Delete ${u.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand disabled:opacity-30"
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
        title={editing ? "Edit User" : "New User"}
      >
        <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Name</label>
            <input name="name" required defaultValue={editing?.name} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          {editing ? (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Email</label>
              <input type="email" value={editing.email} disabled className="w-full rounded-sm border border-border bg-surface-muted px-3 py-2.5 text-sm text-muted outline-none" />
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Email</label>
              <input type="email" name="email" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
              {editing ? "New Password (optional)" : "Temporary Password"}
            </label>
            <input
              type="password"
              name="password"
              required={!editing}
              minLength={8}
              placeholder={editing ? "Leave blank to keep current password" : undefined}
              className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Role</label>
            <select name="role" defaultValue={editing?.role ?? ROLES[0]} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-brand py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark">
            {editing ? "Save Changes" : "Save User"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
