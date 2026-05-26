import { Building2, MessageSquare, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTimeValue, formatRating } from "@/lib/format";
import type {
  AdminFeedbackEntry,
  AdminFeedbackProfessionalSummary,
  AdminFeedbackSummary,
} from "@/types";

interface FeedbackDashboardProps {
  summary: AdminFeedbackSummary;
  feedbackEntries: AdminFeedbackEntry[];
  hasCustomFilters: boolean;
}

function FeedbackMetricCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-content-secondary">{label}</p>
          <p className="text-3xl font-semibold text-content-primary">{value}</p>
          <p className="text-sm text-content-muted">{helper}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-brand-soft text-content-brand">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function ProfessionalBreakdown({
  professionals,
}: {
  professionals: AdminFeedbackProfessionalSummary[];
}) {
  return (
    <Card className="p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-content-primary">
          Reputação por profissional
        </h2>
        <p className="text-sm text-content-secondary">
          Veja quem já recebeu avaliações e acompanhe a percepção do atendimento por especialidade.
        </p>
      </div>

      {professionals.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-stroke-strong bg-surface-muted px-6 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-card text-content-subtle">
            <Users className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-medium text-content-primary">
            Nenhum profissional avaliado até agora
          </p>
          <p className="mt-2 text-sm text-content-secondary">
            As médias individuais aparecerão aqui assim que as reservas concluídas começarem a
            receber feedback.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {professionals.map((professional) => (
            <li key={professional.professionalId}>
              <div className="rounded-2xl bg-surface-muted p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-content-primary">
                        {professional.name}
                      </p>
                      <Badge tone={professional.isRated ? "success" : "neutral"}>
                        {professional.isRated ? "Com avaliações" : "Ainda sem média"}
                      </Badge>
                    </div>
                    <p className="text-sm text-content-secondary">
                      {professional.specialty || "Especialidade não informada"}
                    </p>
                  </div>

                  <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:text-right">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                        Nota média
                      </p>
                      <p className="mt-1 text-sm font-semibold text-content-primary">
                        {professional.isRated && professional.averageRating !== null
                          ? formatRating(professional.averageRating)
                          : "Sem avaliações"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                        Volume
                      </p>
                      <p className="mt-1 text-sm font-semibold text-content-primary">
                        {professional.feedbackCount} avaliação
                        {professional.feedbackCount === 1 ? "" : "ões"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function FeedbackList({
  feedbackEntries,
  hasCustomFilters,
}: {
  feedbackEntries: AdminFeedbackEntry[];
  hasCustomFilters: boolean;
}) {
  if (feedbackEntries.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title={hasCustomFilters ? "Nenhum feedback encontrado" : "Ainda sem feedback registrado"}
        description={
          hasCustomFilters
            ? "Os filtros atuais não retornaram avaliações nesta empresa. Ajuste o período ou troque o profissional para continuar a análise."
            : "Quando as reservas concluídas começarem a receber avaliações, a lista operacional aparecerá aqui com notas, comentários e atalhos para a reserva."
        }
        action={
          hasCustomFilters ? (
            <Button href="/admin/feedback" variant="secondary">
              Limpar filtros
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {feedbackEntries.map((feedback) => {
        const trimmedComment = feedback.comment?.trim() ?? "";

        return (
          <Card key={feedback.bookingId} className="p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone="brand">Reserva {feedback.bookingId.slice(0, 8)}</Badge>
                    <span className="text-xs text-content-muted">
                      Recebido em {formatDateTimeValue(feedback.submittedAt)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-content-primary">
                      {feedback.professional.name}
                    </p>
                    <p className="text-sm text-content-secondary">
                      {feedback.professional.specialty || "Especialidade não informada"}
                    </p>
                  </div>
                </div>

                <Button href={`/admin/bookings/${feedback.bookingId}`} variant="secondary" size="sm">
                  Abrir reserva
                </Button>
              </div>

              <div className="grid gap-3 border-t border-stroke-soft pt-5 md:grid-cols-2">
                <div className="rounded-2xl bg-surface-muted p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                    Nota do petshop
                  </p>
                  <p className="mt-2 text-base font-semibold text-content-primary">
                    {formatRating(feedback.petshopRating)}
                  </p>
                </div>

                <div className="rounded-2xl bg-surface-muted p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
                    Nota do profissional
                  </p>
                  <p className="mt-2 text-base font-semibold text-content-primary">
                    {formatRating(feedback.professionalRating)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-surface-muted p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-content-primary">
                  <MessageSquare className="h-4 w-4 text-content-brand" />
                  Comentário do cliente
                </div>
                <p className="mt-2 text-sm text-content-secondary">
                  {trimmedComment || "Sem comentário adicional nesta avaliação."}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function FeedbackDashboard({
  summary,
  feedbackEntries,
  hasCustomFilters,
}: FeedbackDashboardProps) {
  const ratedProfessionalsCount = summary.professionals.filter(
    (professional) => professional.isRated,
  ).length;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <FeedbackMetricCard
          icon={Building2}
          label="Nota média do petshop"
          value={
            summary.petshop.isRated && summary.petshop.averageRating !== null
              ? formatRating(summary.petshop.averageRating)
              : "Sem avaliações"
          }
          helper={
            summary.petshop.isRated
              ? "Reputação atual da operação autenticada."
              : "A reputação aparecerá aqui após o primeiro feedback."
          }
        />
        <FeedbackMetricCard
          icon={MessageSquare}
          label="Avaliações recebidas"
          value={String(summary.petshop.feedbackCount)}
          helper="Total de feedbacks vinculados às reservas da empresa."
        />
        <FeedbackMetricCard
          icon={Star}
          label="Profissionais avaliados"
          value={String(ratedProfessionalsCount)}
          helper="Quantidade de profissionais com média calculada."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
        <ProfessionalBreakdown professionals={summary.professionals} />

        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-content-primary">Feedback por reserva</h2>
            <p className="text-sm text-content-secondary">
              Consulte comentários, compare notas e volte para a reserva quando precisar investigar
              o contexto operacional.
            </p>
          </div>

          <FeedbackList
            feedbackEntries={feedbackEntries}
            hasCustomFilters={hasCustomFilters}
          />
        </div>
      </div>
    </div>
  );
}
