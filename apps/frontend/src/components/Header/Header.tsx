import { getAdminSession, setAdminSession } from "@/lib/adminSession";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function Header() {
  const session = await getAdminSession();

  return (
    <header className="w-full border-b border-border-default bg-surface-primary">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-semibold text-content-primary">petcenter</Link>
        </div>

        <nav className="flex items-center gap-3">
          <Link href="/petshops" className="text-sm text-content-secondary">Petshops</Link>
          {!session ? (
            <Link href="/admin/login" className="ml-4 text-sm text-content-primary">Entrar</Link>
          ) : (
            <>
              <Link href="/admin/bookings" className="text-sm text-content-primary">Dashboard</Link>
              <form action="/admin/signout" method="post">
                <Button type="submit" variant="ghost" className="ml-4">Sair</Button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
