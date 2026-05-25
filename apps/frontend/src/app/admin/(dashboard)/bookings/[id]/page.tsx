import { notFound, redirect } from "next/navigation";
import { BookingActionsPanel } from "@/components/AdminBookings/BookingActionsPanel";
import { BookingDetailView } from "@/components/AdminBookings/BookingDetailView";
import { DashboardErrorState } from "@/components/AdminBookings/DashboardErrorState";
import { Button } from "@/components/ui/Button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { getUpdatedBookingMessage } from "@/lib/adminBooking";
import { ApiRequestError, api } from "@/lib/api";
import { getAdminLoginPath, requireAdminSession } from "@/lib/adminSession";
import { formatDateTimeRange } from "@/lib/format";
import {
  submitCancelBookingAction,
  submitCompleteBookingAction,
  submitNoShowBookingAction,
} from "./actions";

interface AdminBookingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function AdminBookingDetailPage({
  params,
  searchParams,
}: AdminBookingDetailPageProps) {
  const session = await requireAdminSession();
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const successMessage = getUpdatedBookingMessage(
    toSingleValue(resolvedSearchParams.updated),
  );

  try {
    const booking = await api.getAdminBookingById(id, session.token);

    return (
      <PageWrapper
        title={`Reserva de ${booking.pet.name}`}
        description={formatDateTimeRange(booking.slotStart, booking.slotEnd)}
        actions={
          <Button href="/admin/bookings" variant="secondary">
            Voltar para a fila
          </Button>
        }
      >
        <BookingDetailView
          booking={booking}
          successMessage={successMessage}
          actions={
            <BookingActionsPanel
              bookingId={booking.id}
              state={booking.state}
              completeBookingAction={submitCompleteBookingAction}
              cancelBookingAction={submitCancelBookingAction}
              noShowBookingAction={submitNoShowBookingAction}
            />
          }
        />
      </PageWrapper>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      redirect(getAdminLoginPath("session"));
    }

    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }

    return (
      <PageWrapper
        title="Detalhes da reserva"
        description="Acompanhe o contexto operacional completo antes de registrar qualquer ação."
        actions={
          <Button href="/admin/bookings" variant="secondary">
            Voltar para a fila
          </Button>
        }
      >
        <DashboardErrorState
          title="Não foi possível carregar a reserva"
          description={
            error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado ao abrir os detalhes da reserva."
          }
          actionHref="/admin/bookings"
        />
      </PageWrapper>
    );
  }
}
