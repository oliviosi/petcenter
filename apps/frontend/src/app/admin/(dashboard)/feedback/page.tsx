import { redirect } from "next/navigation";
import { DashboardErrorState } from "@/components/AdminBookings/DashboardErrorState";
import { FeedbackDashboard } from "@/components/AdminFeedback/FeedbackDashboard";
import { FeedbackFilters } from "@/components/AdminFeedback/FeedbackFilters";
import { Button } from "@/components/ui/Button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ApiRequestError, api } from "@/lib/api";
import { getAdminLoginPath, requireAdminSession } from "@/lib/adminSession";
import type { AdminFeedbackFilters } from "@/types";

interface AdminFeedbackPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function isGuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function buildFilters(searchParams: Record<string, string | string[] | undefined>) {
  const startDate = toSingleValue(searchParams.startDate);
  const endDate = toSingleValue(searchParams.endDate);
  const professionalId = toSingleValue(searchParams.professionalId);

  return {
    filters: {
      startDate: isIsoDate(startDate) ? startDate : "",
      endDate: isIsoDate(endDate) ? endDate : "",
      professionalId: isGuid(professionalId) ? professionalId : "",
    } satisfies AdminFeedbackFilters,
    hasCustomFilters: Boolean(startDate || endDate || professionalId),
  };
}

function buildFeedbackPath(filters: Partial<AdminFeedbackFilters>) {
  const params = new URLSearchParams();

  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  }

  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  }

  if (filters.professionalId) {
    params.set("professionalId", filters.professionalId);
  }

  return params.size > 0 ? `/admin/feedback?${params.toString()}` : "/admin/feedback";
}

export default async function AdminFeedbackPage({ searchParams }: AdminFeedbackPageProps) {
  const session = await requireAdminSession();
  const resolvedSearchParams = await searchParams;
  const { filters, hasCustomFilters } = buildFilters(resolvedSearchParams);

  try {
    const [summary, feedbackEntries] = await Promise.all([
      api.getAdminFeedbackSummary(session.token),
      api.listAdminFeedback(filters, session.token),
    ]);

    return (
      <PageWrapper
        title="Feedback dos clientes"
        description="Acompanhe a reputação do petshop, identifique padrões por profissional e volte para a reserva quando precisar de contexto operacional."
        actions={
          hasCustomFilters ? (
            <Button href="/admin/feedback" variant="secondary">
              Visão completa
            </Button>
          ) : undefined
        }
      >
        <FeedbackFilters filters={filters} professionals={summary.professionals} />
        <FeedbackDashboard
          summary={summary}
          feedbackEntries={feedbackEntries}
          hasCustomFilters={hasCustomFilters}
        />
      </PageWrapper>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      redirect(getAdminLoginPath("session"));
    }

    return (
      <PageWrapper
        title="Feedback dos clientes"
        description="Acompanhe a reputação do petshop, identifique padrões por profissional e volte para a reserva quando precisar de contexto operacional."
      >
        <DashboardErrorState
          title="Não foi possível carregar o painel de feedback"
          description={
            error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado ao consultar as avaliações da empresa."
          }
          actionHref={buildFeedbackPath(filters)}
          actionLabel="Tentar novamente"
        />
      </PageWrapper>
    );
  }
}
