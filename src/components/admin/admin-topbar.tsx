import { LogOut } from "lucide-react";
import { auth } from "@/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AdminMobileMenu } from "@/components/admin/admin-mobile-menu";
import { logout } from "@/app/admin/(dashboard)/logout-action";

export async function AdminTopbar({ title }: { title: string }) {
  const session = await auth();
  const name = session?.user?.name ?? "Admin";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <AdminMobileMenu role={session?.user?.role} />
        <h1 className="font-serif text-lg font-bold sm:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="hidden items-center gap-2 sm:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            {initials || "AD"}
          </span>
          <div className="text-sm">
            <p className="font-semibold leading-tight">{name}</p>
            <p className="text-[11px] leading-tight text-muted">{session?.user?.role.replace("_", " ")}</p>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            title="Sign out"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition hover:border-brand hover:text-brand"
          >
            <LogOut size={16} />
          </button>
        </form>
      </div>
    </header>
  );
}
