import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CircleDollarSign,
  Phone,
  UserRound,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { BookingStateBadge } from "@/components/AdminBookings/BookingStateBadge";
import { getTerminalSummary } from "@/lib/adminBooking";
import { formatCurrency, formatDateTimeRange } from "@/lib/format";
import type { AdminBookingFilters, AdminBookingListItem } from "@/types";

interface BookingListProps {
  bookings: AdminBookingListItem[];
  filters: AdminBookingFilters;
  isDefaultWindow: boolean;
}

export function BookingList({
  bookings,
  filters,
  isDefaultWindow,
}: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title={isDefaultWindow ? "Nenhuma reserva prevista" : "Nenhuma reserva encontrada"}
        description={
          isDefaultWindow
            ? "Ainda não há reservas de hoje em diante para esta operação. Ajuste o período ou confira novamente mais tarde."
            : "Os filtros atuais não retornaram reservas nesta empresa. Ajuste o período, o estado ou o profissional."
        }
        action={
          filters.state || filters.startDate || filters.endDate || filters.professionalId ? (
            <Button href="/admin/bookings" variant="secondary">
              Voltar para a fila padrão
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <ul className="grid gap-4">
      {bookings.map((booking) => {
        const terminalSummary = getTerminalSummary(booking);

        return (
          <li key={booking.id}>
            <Link href={`/admin/bookings/${booking.id}`} className="block">
              <Card className="p-6 transition hover:border-stroke-strong hover:shadow-card">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <BookingStateBadge state={booking.state} />
                        <span className="text-xs text-content-muted">
                          Reserva {booking.id.slice(0, 8)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-content-primary">
                          {booking.pet.name} • {booking.service.name}
                        </h2>
                        <p className="text-sm text-content-secondary">
                          {formatDateTimeRange(booking.slotStart, booking.slotEnd)}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-2 text-sm font-medium text-content-brand">
                      Ver detalhes
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="grid gap-4 border-t border-stroke-soft pt-5 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-content-muted">
                        <UserRound className="h-4 w-4" />
                        Profissional
                      </div>
                      <p className="text-sm font-medium text-content-primary">
                        {booking.professional.name}
                      </p>
                      <p className="text-sm text-content-secondary">
                        {booking.professional.specialty || "Especialidade não informada"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-content-muted">
                        <Phone className="h-4 w-4" />
                        Tutor
                      </div>
                      <p className="text-sm font-medium text-content-primary">
                        {booking.ownerContact}
                      </p>
                      <p className="text-sm text-content-secondary">
                        {booking.pet.species}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-content-muted">
                        <CircleDollarSign className="h-4 w-4" />
                        Serviço
                      </div>
                      <p className="text-sm font-medium text-content-primary">
                        {booking.service.name}
                      </p>
                      <p className="text-sm text-content-secondary">
                        Base {formatCurrency(booking.service.basePrice)}
                      </p>
                    </div>
                  </div>

                  {terminalSummary ? (
                    <div className="rounded-2xl bg-surface-muted px-4 py-3">
                      <p className="text-sm font-medium text-content-primary">
                        {terminalSummary.title}
                      </p>
                      <p className="mt-1 text-sm text-content-secondary">
                        {terminalSummary.description}
                      </p>
                    </div>
                  ) : null}
                </div>
              </Card>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
