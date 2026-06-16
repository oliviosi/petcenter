import { LogOut, PawPrint } from "lucide-react";
import { logoutAdminAction } from "@/app/admin/login/actions";
import { AdminNavigation } from "@/components/layout/AdminNavigation";
import { Button } from "@/components/ui/Button";
import Header from "@/components/Header/Header";

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
      {/* Global Header for small screens */}
      <div className="lg:hidden">
        <Header />
      </div>

      <aside className="hidden w-80 flex-col border-r border-stroke-soft bg-surface-card lg:flex">
        <div className="flex items-center gap-3 border-b border-stroke-soft px-6 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-solid text-content-primary shadow-soft">
            <PawPrint className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="inline-flex w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-content-accent">
              Console do petshop
            </p>
            <p className="font-heading text-xl font-semibold text-content-primary">petcenter</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-6 p-6">
          <div className="space-y-6">
            <div className="rounded-2xl border border-stroke-soft bg-surface-muted p-5 shadow-soft">
              <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                Empresa autenticada
              </p>
              <p className="mt-3 font-heading text-lg font-semibold text-content-primary">
                {companyName}
              </p>
              <p className="mt-1 text-sm text-content-secondary">{userEmail}</p>
            </div>

            <AdminNavigation />
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-solid text-content-primary shadow-soft">
              <PawPrint className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold text-content-primary">{companyName}</p>
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

        <div className="border-b border-stroke-soft bg-surface-card px-4 py-3 lg:hidden">
          <AdminNavigation mobile />
        </div>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
