import { BookingDetailSkeleton } from "@/components/AdminBookings/BookingDetailSkeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function AdminBookingDetailLoading() {
  return (
    <PageWrapper
      title="Detalhes da reserva"
      description="Carregando o contexto operacional completo."
    >
      <BookingDetailSkeleton />
    </PageWrapper>
  );
}
