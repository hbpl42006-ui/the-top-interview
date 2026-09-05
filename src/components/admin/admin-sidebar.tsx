"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  MapPinned,
  Mic,
  Podcast,
  Video,
  BookOpen,
  FolderTree,
  Map,
  UserSquare2,
  Users,
  MessageSquare,
  Inbox,
  Mail as MailIcon,
  Megaphone,
  Mail,
  ExternalLink,
} from "lucide-react";
import type { UserRole } from "@prisma/client";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "News", href: "/admin/news", icon: Newspaper },
  { label: "Ground Reports", href: "/admin/ground-reports", icon: MapPinned },
  { label: "Interviews", href: "/admin/interviews", icon: Mic },
  { label: "Podcasts", href: "/admin/podcasts", icon: Podcast },
  { label: "Videos", href: "/admin/videos", icon: Video },
  { label: "Special Reports", href: "/admin/special-reports", icon: BookOpen },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Locations", href: "/admin/locations", icon: Map },
  { label: "Reporters", href: "/admin/reporters", icon: UserSquare2 },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["SUPER_ADMIN"] as UserRole[] },
  { label: "Comments", href: "/admin/comments", icon: MessageSquare },
  { label: "Submissions", href: "/admin/submissions", icon: Inbox },
  { label: "Contact", href: "/admin/contact", icon: MailIcon },
  { label: "Advertisements", href: "/admin/advertisements", icon: Megaphone },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
];

export function AdminSidebar({
  className = "hidden w-64 shrink-0 border-r border-border bg-surface lg:block",
  role,
}: {
  className?: string;
  role?: UserRole;
}) {
  const pathname = usePathname();
  const items = NAV.filter((item) => !item.roles || (role && item.roles.includes(role)));

  return (
    <aside className={className}>
      <div className="border-b border-border px-5 py-4">
        <Logo />
      </div>
      <nav className="flex flex-col gap-0.5 p-3">
        {items.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition",
                active ? "bg-brand text-white" : "text-foreground/80 hover:bg-surface-muted"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-muted"
        >
          <ExternalLink size={16} /> View Site
        </Link>
      </div>
    </aside>
  );
}
