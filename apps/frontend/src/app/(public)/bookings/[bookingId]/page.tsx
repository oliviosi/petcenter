import { Button } from "@/components/ui/Button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PublicRequestErrorState } from "@/components/PublicRequestErrorState";
import { BookingStatusCard } from "@/components/Status/BookingStatusCard";
import { StatusRefreshButton } from "@/components/Status/StatusRefreshButton";
import { api } from "@/lib/api";
import { getBookingSession } from "@/lib/bookingSession";

interface BookingStatusPageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function BookingStatusPage({
  params,
}: BookingStatusPageProps) {
  const { bookingId } = await params;
  const session = await getBookingSession(bookingId);

  if (!session) {
    return (
      <PageWrapper
        title="Status indisponível"
        description="Não encontramos o token salvo neste navegador para consultar esta reserva."
        actions={<Button href="/petshops" variant="secondary">Ver petshops</Button>}
      >
        <PublicRequestErrorState
          title="Não foi possível recuperar o status desta reserva"
          description="Para acompanhar a solicitação, abra esta página no mesmo navegador usado no envio ou faça uma nova solicitação de reserva."
        />
      </PageWrapper>
    );
  }

  try {
    const booking = await api.checkBookingStatus(bookingId, session.statusToken);

    return (
      <PageWrapper
        title="Acompanhar reserva"
        description="Consulte o andamento da sua solicitação sempre que precisar."
        actions={<StatusRefreshButton />}
      >
        <BookingStatusCard booking={booking} sessionSummary={session} />

        <div className="flex flex-wrap gap-3">
          <Button href="/petshops" variant="secondary">
            Ver outros petshops
          </Button>
          <Button
            href={`/petshops/${session.petshopSlug}/book?serviceId=${booking.serviceId}`}
          >
            Solicitar novo horário
          </Button>
        </div>
      </PageWrapper>
    );
  } catch (error) {
    return (
      <PageWrapper
        title="Não foi possível consultar o status"
        description="Você pode tentar novamente sem perder os dados preservados neste navegador."
        actions={<StatusRefreshButton />}
      >
        <PublicRequestErrorState
          title="Falha ao consultar a reserva"
          description={
            error instanceof Error
              ? error.message
              : "Ocorreu um erro ao consultar o status."
          }
        />
      </PageWrapper>
    );
  }
}
