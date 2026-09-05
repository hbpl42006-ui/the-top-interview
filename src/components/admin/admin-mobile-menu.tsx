"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { UserRole } from "@prisma/client";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminMobileMenu({ role }: { role?: UserRole }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-64 bg-surface">
            <div className="flex justify-end p-3">
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <AdminSidebar className="w-64 bg-surface" role={role} />
          </div>
          <div className="flex-1 bg-charcoal/50" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
