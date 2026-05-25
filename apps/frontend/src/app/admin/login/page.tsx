import { CalendarClock, PawPrint, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminAuth/AdminLoginForm";
import { Card } from "@/components/ui/Card";
import { api, ApiRequestError } from "@/lib/api";
import { getAdminSession } from "@/lib/adminSession";
import { submitAdminLoginAction } from "./actions";

interface AdminLoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const highlights = [
  {
    icon: ShieldCheck,
    title: "Sessão segura",
    description:
      "O token JWT fica protegido em cookie de sessão no servidor e é propagado apenas para chamadas autenticadas do dashboard.",
  },
  {
    icon: CalendarClock,
    title: "Fila operacional",
    description:
      "A visão inicial prioriza reservas de hoje em diante, com filtros para ampliar histórico, rejeições e ajustes.",
  },
];

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const session = await getAdminSession();

  if (session) {
    try {
      await api.getAdminMe(session.token);
      redirect("/admin/bookings");
    } catch (error) {
      if (!(error instanceof ApiRequestError && error.status === 401)) {
        throw error;
      }
    }
  }

  const resolvedSearchParams = await searchParams;
  const reason = toSingleValue(resolvedSearchParams.reason);

  return (
    <main className="min-h-screen bg-surface-page">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-brand-soft text-content-brand">
              <PawPrint className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-content-secondary">Admin do petshop</p>
              <h1 className="text-3xl font-semibold text-content-primary">petcenter dashboard</h1>
            </div>
          </div>

          <div className="space-y-3">
            <p className="inline-flex w-fit rounded-full bg-surface-brand-soft px-3 py-1 text-sm font-medium text-content-brand">
              Operação autenticada por empresa
            </p>
            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-content-primary">
              Entre para acompanhar reservas, revisar detalhes e concluir a rotina da loja.
            </h2>
            <p className="max-w-2xl text-base text-content-secondary">
              Esta é a primeira superfície autenticada da aplicação. O frontend envia apenas o bearer token da sessão atual e deixa o escopo da empresa sob responsabilidade do backend.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {highlights.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="p-6">
                <div className="space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-content-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-content-primary">{title}</h3>
                    <p className="text-sm text-content-secondary">{description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-content-primary">
                Acessar dashboard
              </h2>
              <p className="text-sm text-content-secondary">
                Use as credenciais operacionais da empresa para abrir a fila de reservas.
              </p>
            </div>

            {reason === "session" ? (
              <div className="rounded-2xl border border-stroke-brand bg-surface-brand-soft px-4 py-3 text-sm text-content-brand">
                Sua sessão expirou ou ficou inválida. Entre novamente para continuar.
              </div>
            ) : null}

            <AdminLoginForm submitAction={submitAdminLoginAction} />
          </div>
        </Card>
      </div>
    </main>
  );
}
