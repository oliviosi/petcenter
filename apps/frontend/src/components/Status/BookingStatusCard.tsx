import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDateTimeRange, formatDateTimeValue } from "@/lib/format";
import type { BookingStatusSessionSummary, PublicBookingStatus } from "@/types";

const statusConfig = {
  requested: {
    badgeTone: "warning" as const,
    title: "Solicitação recebida",
    description:
      "Sua solicitação foi enviada e aguarda análise do petshop. A confirmação acontece de forma assíncrona.",
  },
  confirmed: {
    badgeTone: "success" as const,
    title: "Reserva confirmada",
    description:
      "O petshop confirmou o horário solicitado. Confira os detalhes abaixo para se organizar.",
  },
  rejected: {
    badgeTone: "danger" as const,
    title: "Solicitação recusada",
    description:
      "O petshop não conseguiu seguir com esta solicitação. Veja o motivo informado e tente outro horário.",
  },
  cancelled: {
    badgeTone: "neutral" as const,
    title: "Reserva cancelada",
    description:
      "Esta reserva foi cancelada. Caso ainda precise do atendimento, você pode iniciar uma nova solicitação.",
  },
  completed: {
    badgeTone: "brand" as const,
    title: "Atendimento concluído",
    description:
      "O atendimento foi concluído. Se precisar de um novo horário, você pode iniciar outra solicitação.",
  },
  "no-show": {
    badgeTone: "danger" as const,
    title: "Atendimento marcado como não comparecimento",
    description:
      "O petshop registrou que o atendimento não ocorreu por ausência no horário previsto.",
  },
} satisfies Record<
  PublicBookingStatus["state"],
  {
    badgeTone: "brand" | "success" | "warning" | "danger" | "neutral";
    title: string;
    description: string;
  }
>;

interface BookingStatusCardProps {
  booking: PublicBookingStatus;
  sessionSummary?: BookingStatusSessionSummary | null;
}

export function BookingStatusCard({
  booking,
  sessionSummary,
}: BookingStatusCardProps) {
  const config = statusConfig[booking.state];

  return (
    <Card className="flex flex-col gap-6 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Badge tone={config.badgeTone}>{config.title}</Badge>
          <h2 className="text-2xl font-semibold text-content-primary">
            {sessionSummary?.petName
              ? `Acompanhamento da reserva de ${sessionSummary.petName}`
              : "Acompanhamento da reserva"}
          </h2>
          <p className="max-w-3xl text-sm text-content-secondary">
            {config.description}
          </p>
        </div>
        <div className="rounded-2xl bg-surface-muted px-4 py-3 text-sm text-content-secondary">
          Solicitada em {formatDateTimeValue(booking.requestedAt)}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-surface-muted p-5">
          <p className="text-sm font-medium text-content-secondary">Horário</p>
          <p className="mt-2 text-base font-semibold text-content-primary">
            {formatDateTimeRange(booking.slotStart, booking.slotEnd)}
          </p>
        </div>

        <div className="rounded-2xl bg-surface-muted p-5">
          <p className="text-sm font-medium text-content-secondary">Contexto salvo no navegador</p>
          <div className="mt-2 space-y-1 text-sm text-content-secondary">
            {sessionSummary?.petshopName ? <p>{sessionSummary.petshopName}</p> : null}
            {sessionSummary?.serviceName ? <p>{sessionSummary.serviceName}</p> : null}
            {sessionSummary?.professionalName ? <p>{sessionSummary.professionalName}</p> : null}
            {sessionSummary?.ownerContact ? <p>{sessionSummary.ownerContact}</p> : null}
            {!sessionSummary?.petshopName &&
            !sessionSummary?.serviceName &&
            !sessionSummary?.professionalName &&
            !sessionSummary?.ownerContact ? (
              <p>Os detalhes adicionais ficam disponíveis após uma solicitação feita neste navegador.</p>
            ) : null}
          </div>
        </div>
      </div>

      {booking.rejection ? (
        <div className="rounded-2xl bg-surface-danger-soft p-5">
          <p className="text-sm font-medium text-content-danger">
            Motivo da recusa
          </p>
          <p className="mt-2 text-sm text-content-secondary">
            {booking.rejection.reason}
          </p>
          <p className="mt-2 text-xs text-content-muted">
            Registrado em {formatDateTimeValue(booking.rejection.rejectedAt)}
          </p>
        </div>
      ) : null}

      {booking.confirmedAt ? (
        <p className="text-sm text-content-secondary">
          Confirmada em {formatDateTimeValue(booking.confirmedAt)}.
        </p>
      ) : null}
      {booking.cancellation ? (
        <p className="text-sm text-content-secondary">
          Cancelada em {formatDateTimeValue(booking.cancellation.cancelledAt)}.
        </p>
      ) : null}
      {booking.completion ? (
        <p className="text-sm text-content-secondary">
          Concluída em {formatDateTimeValue(booking.completion.completedAt)}.
        </p>
      ) : null}
      {booking.noShow ? (
        <p className="text-sm text-content-secondary">
          Não comparecimento registrado em{" "}
          {formatDateTimeValue(booking.noShow.noShowAt)}.
        </p>
      ) : null}
    </Card>
  );
}
