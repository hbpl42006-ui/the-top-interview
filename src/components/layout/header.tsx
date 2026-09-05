"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { FaYoutube, FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";
import { MAIN_NAV } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Logo />
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
          <div className="hidden items-center gap-1 md:flex">
            <a href="https://youtube.com/@thetopinterview" target="_blank" rel="noreferrer" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-surface-muted hover:text-brand">
              <FaYoutube size={17} />
            </a>
            <a href="https://instagram.com/thetopinterview" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-surface-muted hover:text-brand">
              <FaInstagram size={17} />
            </a>
            <a href="https://facebook.com/thetopinterview" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-surface-muted hover:text-brand">
              <FaFacebook size={17} />
            </a>
            <a href="https://x.com/thetopinterview" target="_blank" rel="noreferrer" aria-label="X / Twitter" className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-surface-muted hover:text-brand">
              <FaXTwitter size={17} />
            </a>
          </div>
          <ThemeToggle />
          <Link
            href="/newsletter"
            className="ml-1 hidden rounded-sm bg-brand px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark sm:inline-block"
          >
            Subscribe
          </Link>
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
            <li>
              <Link
                href="/newsletter"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block rounded-sm bg-brand px-3 py-2.5 text-center text-sm font-bold uppercase text-white"
              >
                Subscribe
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
