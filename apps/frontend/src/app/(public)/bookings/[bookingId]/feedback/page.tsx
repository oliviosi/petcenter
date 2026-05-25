import {
  CheckCircle2,
  Clock3,
  RefreshCcw,
  ShieldAlert,
  SmartphoneNfc,
} from "lucide-react";
import { BookingFeedbackForm } from "@/components/Feedback/BookingFeedbackForm";
import { BookingFeedbackState } from "@/components/Feedback/BookingFeedbackState";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import {
  isAlreadySubmittedFeedbackReason,
  isInvalidFeedbackTokenError,
  isNotCompletedFeedbackReason,
} from "@/lib/bookingFeedback";
import { getBookingSession } from "@/lib/bookingSession";
import { submitBookingFeedbackAction } from "./actions";

interface BookingFeedbackPageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function BookingFeedbackPage({
  params,
}: BookingFeedbackPageProps) {
  const { bookingId } = await params;
  const session = await getBookingSession(bookingId);
  const statusHref = `/bookings/${bookingId}`;

  if (!session?.feedbackAccessToken) {
    return (
      <PageWrapper
        title="Feedback indisponível"
        description="Este navegador não tem os dados necessários para continuar com a avaliação desta reserva."
      >
        <BookingFeedbackState
          icon={SmartphoneNfc}
          title="Continue no mesmo navegador da reserva"
          description="O acesso ao feedback fica salvo junto com a reserva criada neste fluxo público. Se a solicitação foi enviada em outro navegador ou dispositivo, abra o acompanhamento por lá."
          tone="neutral"
          actions={
            <>
              <Button href={statusHref} variant="secondary">
                Voltar para a reserva
              </Button>
              <Button href="/petshops">Ver petshops</Button>
            </>
          }
        />
      </PageWrapper>
    );
  }

  try {
    const eligibility = await api.checkBookingFeedbackEligibility(
      bookingId,
      session.feedbackAccessToken,
    );

    if (eligibility.canSubmit) {
      return (
        <PageWrapper
          title="Avaliar atendimento"
          description="Antes de enviar, confira as notas para o profissional e para o petshop."
        >
          <BookingFeedbackForm
            bookingId={bookingId}
            feedbackAccessToken={session.feedbackAccessToken}
            sessionSummary={session}
            submitFeedbackAction={submitBookingFeedbackAction}
          />
        </PageWrapper>
      );
    }

    if (isAlreadySubmittedFeedbackReason(eligibility.reason)) {
      return (
        <PageWrapper
          title="Feedback já enviado"
          description="Esta reserva já possui uma avaliação registrada no fluxo público."
        >
          <BookingFeedbackState
            icon={CheckCircle2}
            tone="success"
            title="Já recebemos a sua avaliação"
            description="Não é necessário enviar um novo feedback para esta reserva."
            detail={eligibility.reason ?? undefined}
            actions={
              <>
                <Button href={statusHref} variant="secondary">
                  Voltar para a reserva
                </Button>
                <Button href="/petshops">Continuar no shell público</Button>
              </>
            }
          />
        </PageWrapper>
      );
    }

    return (
      <PageWrapper
        title="Feedback indisponível"
        description="Ainda não foi possível abrir a avaliação desta reserva."
      >
        <BookingFeedbackState
          icon={Clock3}
          tone="neutral"
          title="A avaliação ainda não pode ser enviada"
          description={
            isNotCompletedFeedbackReason(eligibility.reason)
              ? "Assim que o atendimento for concluído, você poderá voltar aqui para registrar a sua opinião."
              : "No momento, esta reserva não está disponível para feedback neste fluxo público."
          }
          detail={eligibility.reason ?? undefined}
          actions={
            <>
              <Button href={statusHref} variant="secondary">
                Voltar para a reserva
              </Button>
              <Button href="/petshops">Continuar no shell público</Button>
            </>
          }
        />
      </PageWrapper>
    );
  } catch (error) {
    if (isInvalidFeedbackTokenError(error)) {
      return (
        <PageWrapper
          title="Link de feedback inválido"
          description="Não foi possível validar o acesso desta avaliação."
        >
          <BookingFeedbackState
            icon={ShieldAlert}
            tone="danger"
            title="O link de feedback não é mais válido"
            description="Abra o acompanhamento da reserva no mesmo navegador usado no envio original ou inicie uma nova reserva quando precisar."
            detail={error.message}
            actions={
              <>
                <Button href={statusHref} variant="secondary">
                  Voltar para a reserva
                </Button>
                <Button href="/petshops">Ver petshops</Button>
              </>
            }
          />
        </PageWrapper>
      );
    }

    return (
      <PageWrapper
        title="Não foi possível carregar o feedback"
        description="Você pode tentar novamente sem perder o contexto salvo neste navegador."
      >
        <BookingFeedbackState
          icon={RefreshCcw}
          tone="warning"
          title="Falha ao validar a elegibilidade"
          description="Ocorreu um erro ao consultar se esta reserva pode receber feedback agora."
          detail={
            error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado ao carregar esta etapa."
          }
          actions={
            <>
              <Button href={`/bookings/${bookingId}/feedback`}>
                Tentar novamente
              </Button>
              <Button href={statusHref} variant="secondary">
                Voltar para a reserva
              </Button>
            </>
          }
        />
      </PageWrapper>
    );
  }
}
