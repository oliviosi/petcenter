import Link from "next/link";
import { Heart, PawPrint } from "lucide-react";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-page">
      <header className="border-b border-stroke-soft bg-surface-card">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-solid text-content-primary shadow-soft">
              <PawPrint className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="inline-flex w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-content-accent">
                Jornada pública
              </p>
              <p className="font-heading text-xl font-semibold text-content-primary">
                petcenter
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-4 text-sm text-content-secondary">
            <Link
              href="/petshops"
              className="rounded-full border border-stroke-soft bg-surface-muted px-4 py-2 font-medium transition hover:border-stroke-strong hover:text-content-primary"
            >
              Petshops
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-stroke-soft bg-surface-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-content-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>Descoberta pública com linguagem mais clara, elegante e orientada ao agendamento.</p>
          <div className="flex items-center gap-2 rounded-full bg-surface-muted px-4 py-2 text-content-muted">
            <Heart className="h-4 w-4" />
            <span>A confirmação acontece de forma assíncrona.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
