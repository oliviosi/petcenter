import Link from "next/link";
import { Heart, PawPrint } from "lucide-react";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-page">
      <header className="border-b border-stroke-soft bg-surface-card">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-brand-soft text-content-brand">
              <PawPrint className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-content-secondary">
                Reserva pública
              </p>
              <p className="text-lg font-semibold text-content-primary">
                petcenter
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-4 text-sm text-content-secondary">
            <Link href="/petshops" className="font-medium hover:text-content-primary">
              Petshops
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-stroke-soft bg-surface-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-content-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>Fluxo público para descoberta e solicitação de reservas.</p>
          <div className="flex items-center gap-2 text-content-muted">
            <Heart className="h-4 w-4" />
            <span>A confirmação acontece de forma assíncrona.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
