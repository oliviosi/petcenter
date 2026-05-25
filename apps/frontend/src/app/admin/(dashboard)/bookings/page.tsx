import { redirect } from "next/navigation";
import { BookingFilters } from "@/components/AdminBookings/BookingFilters";
import { BookingList } from "@/components/AdminBookings/BookingList";
import { DashboardErrorState } from "@/components/AdminBookings/DashboardErrorState";
import { Button } from "@/components/ui/Button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { isDefaultAdminBookingWindow } from "@/lib/adminBooking";
import { ApiRequestError, api } from "@/lib/api";
import { formatISODate } from "@/lib/date";
import { getAdminLoginPath, requireAdminSession } from "@/lib/adminSession";
import type { AdminBookingFilters, AdminBookingProfessional } from "@/types";

interface AdminBookingsPageProps {
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
  const state = toSingleValue(searchParams.state);
  const startDate = toSingleValue(searchParams.startDate);
  const endDate = toSingleValue(searchParams.endDate);
  const professionalId = toSingleValue(searchParams.professionalId);
  const hasCustomFilters = Boolean(state || startDate || endDate || professionalId);

  return {
    filters: {
      state: state as AdminBookingFilters["state"],
      startDate: hasCustomFilters
        ? isIsoDate(startDate)
          ? startDate
          : ""
        : formatISODate(new Date()),
      endDate: isIsoDate(endDate) ? endDate : "",
      professionalId: isGuid(professionalId) ? professionalId : "",
    } satisfies AdminBookingFilters,
    hasCustomFilters,
  };
}

function getProfessionalOptions(professionals: AdminBookingProfessional[]) {
  const seen = new Set<string>();

  return professionals.filter((professional) => {
    if (seen.has(professional.id)) {
      return false;
    }

    seen.add(professional.id);
    return true;
  });
}

export default async function AdminBookingsPage({
  searchParams,
}: AdminBookingsPageProps) {
  const session = await requireAdminSession();
  const resolvedSearchParams = await searchParams;
  const { filters } = buildFilters(resolvedSearchParams);
  const isDefaultWindow = isDefaultAdminBookingWindow(filters);

  try {
    const [bookings, bookingsForOptions] = await Promise.all([
      api.listAdminBookings(filters, session.token),
      api.listAdminBookings({}, session.token),
    ]);
    const professionalOptions = getProfessionalOptions(
      bookingsForOptions.map((booking) => booking.professional),
    );

    return (
      <PageWrapper
        title="Fila de reservas"
        description="Acompanhe a operação do dia, aplique filtros e abra os detalhes antes de registrar qualquer ajuste."
        actions={
          <Button href="/admin/bookings" variant="secondary">
            Fila padrão
          </Button>
        }
      >
        <BookingFilters
          filters={filters}
          professionals={professionalOptions}
          isDefaultWindow={isDefaultWindow}
        />
        <BookingList
          bookings={bookings}
          filters={filters}
          isDefaultWindow={isDefaultWindow}
        />
      </PageWrapper>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      redirect(getAdminLoginPath("session"));
    }

    return (
      <PageWrapper
        title="Fila de reservas"
        description="Acompanhe a operação do dia, aplique filtros e abra os detalhes antes de registrar qualquer ajuste."
      >
        <DashboardErrorState
          title="Não foi possível carregar a fila agora"
          description={
            error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado ao consultar as reservas."
          }
          actionHref="/admin/bookings"
        />
      </PageWrapper>
    );
  }
}
