import Link from "next/link";
import { Heart, PawPrint } from "lucide-react";

import Header from "@/components/Header/Header";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-page">
      {/* Header (server component) */}
      <Header />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-stroke-soft bg-surface-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-content-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>Entrada publica priorizando a vitrine de um petshop especifico antes do agendamento.</p>
          <div className="flex items-center gap-2 rounded-full bg-surface-muted px-4 py-2 text-content-muted">
            <Heart className="h-4 w-4" />
            <span>A confirmação acontece de forma assíncrona.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
