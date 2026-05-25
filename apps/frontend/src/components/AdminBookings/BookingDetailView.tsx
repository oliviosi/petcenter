import {
  CalendarClock,
  CircleDollarSign,
  Clock3,
  Dog,
  Phone,
  Scissors,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { BookingStateBadge } from "@/components/AdminBookings/BookingStateBadge";
import { formatCurrency, formatDateTimeRange, formatDateTimeValue } from "@/lib/format";
import type { AdminBookingDetail } from "@/types";

interface BookingDetailViewProps {
  booking: AdminBookingDetail;
  successMessage?: string | null;
  actions?: React.ReactNode;
}

export function BookingDetailView({
  booking,
  successMessage,
  actions,
}: BookingDetailViewProps) {
  const timelineItems = [
    {
      label: "Solicitação recebida",
      value: formatDateTimeValue(booking.requestedAt),
    },
    booking.confirmedAt
      ? {
          label: "Confirmação operacional",
          value: formatDateTimeValue(booking.confirmedAt),
        }
      : null,
    booking.rejection
      ? {
          label: "Rejeição",
          value: `${formatDateTimeValue(booking.rejection.rejectedAt)} • ${booking.rejection.reason}`,
        }
      : null,
    booking.completion
      ? {
          label: "Conclusão",
          value: `${formatDateTimeValue(booking.completion.completedAt)} • ${formatCurrency(booking.completion.finalChargedPrice)}`,
        }
      : null,
    booking.cancellation
      ? {
          label: "Cancelamento",
          value: `${formatDateTimeValue(booking.cancellation.cancelledAt)} • ${booking.cancellation.reason}`,
        }
      : null,
    booking.noShow
      ? {
          label: "Não comparecimento",
          value: `${formatDateTimeValue(booking.noShow.noShowAt)} • ${booking.noShow.reason}`,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
  }>;

  const terminalEntries = [
    booking.rejection
      ? {
          label: "Motivo da rejeição",
          value: booking.rejection.reason,
        }
      : null,
    booking.completion
      ? {
          label: "Preço final cobrado",
          value: formatCurrency(booking.completion.finalChargedPrice),
        }
      : null,
    booking.cancellation
      ? {
          label: "Motivo do cancelamento",
          value: booking.cancellation.reason,
        }
      : null,
    booking.noShow
      ? {
          label: "Motivo do não comparecimento",
          value: booking.noShow.reason,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
  }>;

  return (
    <div className="grid gap-6">
      {successMessage ? (
        <Card className="border border-stroke-brand bg-surface-brand-soft p-4">
          <p className="text-sm font-medium text-content-brand">{successMessage}</p>
        </Card>
      ) : null}

      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <BookingStateBadge state={booking.state} />
              <span className="text-xs text-content-muted">
                Empresa {booking.empresaId.slice(0, 8)}
              </span>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-content-primary">
                {booking.pet.name} • {booking.service.name}
              </h2>
              <p className="text-sm text-content-secondary">
                {formatDateTimeRange(booking.slotStart, booking.slotEnd)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-muted px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
              Código operacional
            </p>
            <p className="mt-2 text-sm font-semibold text-content-primary">
              {booking.id}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-content-primary">
              <Phone className="h-4 w-4 text-content-brand" />
              Tutor e pet
            </div>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-content-muted">
                  Contato do responsável
                </dt>
                <dd className="mt-1 text-sm text-content-primary">{booking.ownerContact}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-content-muted">
                  Nome do pet
                </dt>
                <dd className="mt-1 text-sm text-content-primary">{booking.pet.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-content-muted">
                  Espécie
                </dt>
                <dd className="mt-1 text-sm text-content-primary">{booking.pet.species}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-content-muted">
                  Cliente vinculado
                </dt>
                <dd className="mt-1 text-sm text-content-primary">{booking.pet.clientId}</dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-content-primary">
              <Scissors className="h-4 w-4 text-content-brand" />
              Contexto do atendimento
            </div>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-content-muted">
                  Profissional
                </dt>
                <dd className="mt-1 text-sm text-content-primary">
                  {booking.professional.name}
                </dd>
                <dd className="mt-1 text-sm text-content-secondary">
                  {booking.professional.specialty || "Especialidade não informada"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-content-muted">
                  Serviço
                </dt>
                <dd className="mt-1 text-sm text-content-primary">{booking.service.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-content-muted">
                  Valor base
                </dt>
                <dd className="mt-1 text-sm text-content-primary">
                  {formatCurrency(booking.service.basePrice)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-content-muted">
                  Janela agendada
                </dt>
                <dd className="mt-1 text-sm text-content-primary">
                  {formatDateTimeRange(booking.slotStart, booking.slotEnd)}
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-content-primary">
              <Clock3 className="h-4 w-4 text-content-brand" />
              Linha do tempo
            </div>
            <ol className="space-y-4">
              {timelineItems.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-solid" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-content-primary">{item.label}</p>
                    <p className="text-sm text-content-secondary">{item.value}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-content-primary">
              <ShieldCheck className="h-4 w-4 text-content-brand" />
              Metadados finais
            </div>

            {terminalEntries.length > 0 ? (
              <dl className="space-y-4">
                {terminalEntries.map((entry) => (
                  <div key={entry.label}>
                    <dt className="text-xs font-medium uppercase tracking-wide text-content-muted">
                      {entry.label}
                    </dt>
                    <dd className="mt-1 text-sm text-content-primary">{entry.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="rounded-2xl bg-surface-muted px-4 py-4">
                <p className="text-sm font-medium text-content-primary">
                  Sem encerramento registrado
                </p>
                <p className="mt-1 text-sm text-content-secondary">
                  A reserva ainda não possui motivo terminal ou preço final associado.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {actions}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-content-primary">
            <CalendarClock className="h-4 w-4 text-content-brand" />
            Reserva
          </div>
          <p className="mt-3 text-sm text-content-secondary">
            Solicitação criada em {formatDateTimeValue(booking.requestedAt)}.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-content-primary">
            <Dog className="h-4 w-4 text-content-brand" />
            Pet
          </div>
          <p className="mt-3 text-sm text-content-secondary">
            {booking.pet.name} ({booking.pet.species})
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-content-primary">
            <CircleDollarSign className="h-4 w-4 text-content-brand" />
            Financeiro
          </div>
          <p className="mt-3 text-sm text-content-secondary">
            Base {formatCurrency(booking.service.basePrice)}
          </p>
        </Card>
      </div>
    </div>
  );
}
