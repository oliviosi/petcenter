import { redirect } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ApiRequestError, api } from "@/lib/api";
import { getAdminLoginPath, requireAdminSession } from "@/lib/adminSession";
import { DashboardErrorState } from "@/components/AdminBookings/DashboardErrorState";
import { Button } from "@/components/ui/Button";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DomainHealthPage({ searchParams }: Props) {
  const session = await requireAdminSession();
  const params = await searchParams;
  const page = Number(Array.isArray(params.page) ? params.page[0] : params.page ?? 1);
  const pageSize = Number(Array.isArray(params.pageSize) ? params.pageSize[0] : params.pageSize ?? 20);
  const category = Array.isArray(params.category) ? params.category[0] : params.category ?? "";
  const outcome = Array.isArray(params.outcome) ? params.outcome[0] : params.outcome ?? "";

  try {
    const [dto, notificationsResp] = await Promise.all([
      api.getAdminTenantDomainHealth(session.empresaId, session.token),
      api.listAdminTenantDomainNotifications(session.empresaId, page, pageSize, session.token, category || undefined, outcome || undefined),
    ]);

    const notifications = notificationsResp.items;

    return (
      <PageWrapper
        title="Saúde do domínio"
        description="Visão geral das notificações de domínio, prontidão de certificado e verificações de DNS para este tenant."
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="card p-4">
            <h3 className="text-sm font-medium text-text-primary">Contadores</h3>
            <div className="mt-2 flex gap-4">
              <div>
                <div className="text-xs text-text-secondary">Total de notificações</div>
                <div className="text-2xl font-semibold">{dto.totalNotifications}</div>
              </div>
              <div>
                <div className="text-xs text-text-secondary">Notificações com falha</div>
                <div className="text-2xl font-semibold">{dto.failedNotifications}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-text-primary">Filtros</h3>
            <form method="get" className="mt-3 flex gap-3 items-end">
              <div>
                <label className="text-xs text-text-secondary">Categoria</label>
                <input name="category" defaultValue={category} className="block mt-1" />
              </div>
              <div>
                <label className="text-xs text-text-secondary">Resultado</label>
                <select name="outcome" defaultValue={outcome} className="block mt-1">
                  <option value="">Todos</option>
                  <option value="success">success</option>
                  <option value="failed">failed</option>
                  <option value="pending">pending</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-text-secondary">Página</label>
                <input name="page" defaultValue={String(page)} className="block mt-1 w-20" />
              </div>
              <div>
                <label className="text-xs text-text-secondary">Tamanho</label>
                <input name="pageSize" defaultValue={String(pageSize)} className="block mt-1 w-20" />
              </div>
              <div>
                <button className="btn btn-primary">Aplicar</button>
              </div>
            </form>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-text-primary">Notificações</h3>
            <div className="mt-3 divide-y divide-border-default">
              {notifications.length === 0 ? (
                <div className="p-4 text-sm text-text-secondary">Nenhuma notificação encontrada.</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-3">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium">{n.category}</div>
                      <div className="text-xs text-text-secondary">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-xs text-text-secondary mt-1">{n.reason ?? "-"}</div>
                    <div className="text-xs text-text-secondary mt-1">Resultado: {n.outcome ?? "-"} | Tentativas: {n.attempts}</div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4">
              <Button href="/admin" variant="secondary">Voltar</Button>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      redirect(getAdminLoginPath("session"));
    }

    return (
      <PageWrapper title="Saúde do domínio" description="Visão geral das notificações de domínio.">
        <DashboardErrorState
          title="Não foi possível carregar a saúde do domínio"
          description={error instanceof Error ? error.message : "Erro ao consultar o painel de saúde do domínio."}
          actionHref="/admin"
          actionLabel="Voltar"
        />
      </PageWrapper>
    );
  }
}
