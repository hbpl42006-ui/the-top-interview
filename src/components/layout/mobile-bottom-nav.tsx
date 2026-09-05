"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, PlaySquare, Mic2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = { home: Home, newspaper: Newspaper, play: PlaySquare, mic: Mic2, search: Search };

const ITEMS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "News", href: "/news", icon: "newspaper" },
  { label: "Videos", href: "/videos", icon: "play" },
  { label: "Podcasts", href: "/podcasts", icon: "mic" },
  { label: "Search", href: "/search", icon: "search" },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm lg:hidden">
      <ul className="flex items-stretch justify-between">
        {ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition",
                  active ? "text-brand" : "text-muted"
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
