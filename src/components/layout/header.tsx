"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { MAIN_NAV } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { cn } from "@/lib/utils";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="relative h-10 w-10 shrink-0 sm:h-11 sm:w-11">
          <Image src="/logo.png" alt="The Top Interview" fill priority className="object-contain" sizes="44px" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {MAIN_NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-semibold tracking-wide transition hover:text-brand",
                  active ? "text-brand" : "text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-surface-muted"
          >
            <Search size={18} />
          </button>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-surface-muted lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-background px-4 py-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-sm px-2 py-2.5 text-sm font-semibold transition hover:bg-surface-muted hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
