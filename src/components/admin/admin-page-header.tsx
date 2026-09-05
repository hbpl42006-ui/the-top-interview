"use client";

import { Plus, Search } from "lucide-react";

export function AdminPageHeader({
  search,
  onSearchChange,
  onAdd,
  addLabel = "Add New",
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="relative w-full max-w-xs">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-sm border border-border bg-surface py-2 pl-8 pr-3 text-sm outline-none focus:border-brand"
        />
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-sm bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark"
        >
          <Plus size={14} /> {addLabel}
        </button>
      )}
    </div>
  );
}
