import { BookingListSkeleton } from "@/components/AdminBookings/BookingListSkeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function AdminBookingsLoading() {
  return (
    <PageWrapper
      title="Fila de reservas"
      description="Carregando a operação autenticada da empresa."
    >
      <BookingListSkeleton />
    </PageWrapper>
  );
}
