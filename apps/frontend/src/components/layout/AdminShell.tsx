import Link from "next/link";
import { CalendarRange, LogOut, PawPrint } from "lucide-react";
import { logoutAdminAction } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/Button";

interface AdminShellProps {
  companyName: string;
  userEmail: string;
  children: React.ReactNode;
}

export function AdminShell({
  companyName,
  userEmail,
  children,
}: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-surface-page">
      <aside className="hidden w-72 flex-col border-r border-stroke-soft bg-surface-card lg:flex">
        <div className="flex items-center gap-3 border-b border-stroke-soft px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-brand-soft text-content-brand">
            <PawPrint className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-content-secondary">Área do petshop</p>
            <p className="text-lg font-semibold text-content-primary">petcenter</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-6 p-6">
          <div className="space-y-6">
            <div className="rounded-2xl bg-surface-muted p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                Empresa autenticada
              </p>
              <p className="mt-2 text-sm font-semibold text-content-primary">
                {companyName}
              </p>
              <p className="mt-1 text-sm text-content-secondary">{userEmail}</p>
            </div>

            <nav className="space-y-2">
              <Link
                href="/admin/bookings"
                className="flex items-center gap-3 rounded-2xl bg-surface-brand-soft px-4 py-3 text-sm font-medium text-content-brand transition hover:opacity-90"
              >
                <CalendarRange className="h-4 w-4" />
                Reservas
              </Link>
            </nav>
          </div>

          <form action={logoutAdminAction}>
            <Button type="submit" variant="secondary" className="w-full justify-center">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-stroke-soft bg-surface-card px-6 py-4 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-brand-soft text-content-brand">
              <PawPrint className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-content-primary">{companyName}</p>
              <p className="text-xs text-content-secondary">{userEmail}</p>
            </div>
          </div>

          <form action={logoutAdminAction}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </form>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
