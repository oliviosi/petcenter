"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  LockKeyhole,
  MessageSquareWarning,
  ShieldAlert,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { BookingFeedbackState } from "@/components/Feedback/BookingFeedbackState";
import { FeedbackRatingField } from "@/components/Feedback/FeedbackRatingField";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/Textarea";
import {
  bookingFeedbackSchema,
  type BookingFeedbackSubmissionValues,
} from "@/lib/validations/bookingFeedback";
import type {
  BookingStatusSessionSummary,
  SubmitBookingFeedbackAction,
  SubmitBookingFeedbackActionError,
} from "@/types";

interface BookingFeedbackFormProps {
  bookingId: string;
  feedbackAccessToken: string;
  sessionSummary: BookingStatusSessionSummary;
  submitFeedbackAction: SubmitBookingFeedbackAction;
}

function getReturnHref(sessionSummary: BookingStatusSessionSummary) {
  return sessionSummary.petshopSlug
    ? `/petshops/${sessionSummary.petshopSlug}`
    : "/petshops";
}

export function BookingFeedbackForm({
  bookingId,
  feedbackAccessToken,
  sessionSummary,
  submitFeedbackAction,
}: BookingFeedbackFormProps) {
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [terminalError, setTerminalError] =
    useState<SubmitBookingFeedbackActionError | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BookingFeedbackSubmissionValues>({
    resolver: zodResolver(bookingFeedbackSchema),
    defaultValues: {
      bookingId,
      feedbackAccessToken,
      comment: "",
    },
  });

  async function onSubmit(values: BookingFeedbackSubmissionValues) {
    setSubmissionError(null);
    setTerminalError(null);

    const result = await submitFeedbackAction(values);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (message) {
            setError(field as keyof BookingFeedbackSubmissionValues, {
              type: "server",
              message,
            });
          }
        }
      }

      if (
        result.code === "invalid-token" ||
        result.code === "already-submitted" ||
        result.code === "ineligible"
      ) {
        setTerminalError(result);
        return;
      }

      setSubmissionError(result.message);
      return;
    }

    setIsSuccess(true);
  }

  const statusHref = `/bookings/${bookingId}`;
  const returnHref = getReturnHref(sessionSummary);

  if (isSuccess) {
    return (
      <BookingFeedbackState
        icon={CheckCircle2}
        tone="success"
        title="Feedback enviado com sucesso"
        description="Recebemos a sua avaliação. Obrigado por compartilhar como foi a experiência com o atendimento."
        detail="Se precisar acompanhar a reserva novamente, você pode voltar ao status público desta solicitação."
        actions={
          <>
            <Button href={statusHref} variant="secondary">
              Voltar para a reserva
            </Button>
            <Button href={returnHref}>Continuar no shell público</Button>
          </>
        }
      />
    );
  }

  if (terminalError?.code === "already-submitted") {
    return (
      <BookingFeedbackState
        icon={MessageSquareWarning}
        tone="warning"
        title="Feedback já enviado"
        description="Já existe uma avaliação registrada para esta reserva, então não é possível enviar um novo feedback."
        detail={terminalError.message}
        actions={
          <>
            <Button href={statusHref} variant="secondary">
              Voltar para a reserva
            </Button>
            <Button href={returnHref}>Continuar no shell público</Button>
          </>
        }
      />
    );
  }

  if (terminalError?.code === "invalid-token") {
    return (
      <BookingFeedbackState
        icon={ShieldAlert}
        tone="danger"
        title="Link de feedback inválido"
        description="Não foi possível validar este acesso de feedback neste navegador."
        detail={terminalError.message}
        actions={
          <>
            <Button href={statusHref} variant="secondary">
              Voltar para a reserva
            </Button>
            <Button href="/petshops">Ver petshops</Button>
          </>
        }
      />
    );
  }

  if (terminalError?.code === "ineligible") {
    return (
      <BookingFeedbackState
        icon={LockKeyhole}
        tone="neutral"
        title="Feedback indisponível"
        description="Esta reserva não pode mais receber feedback neste momento."
        detail={terminalError.message}
        actions={
          <>
            <Button href={statusHref} variant="secondary">
              Voltar para a reserva
            </Button>
            <Button href={returnHref}>Continuar no shell público</Button>
          </>
        }
      />
    );
  }

  return (
    <Card className="p-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-content-secondary">
          Reserva de {sessionSummary.petName}
        </p>
        <h2 className="text-2xl font-semibold text-content-primary">
          Conte como foi o atendimento
        </h2>
        <p className="max-w-2xl text-sm text-content-secondary">
          Sua avaliação ajuda outras pessoas e orienta melhorias no atendimento
          do petshop.
        </p>
        <div className="rounded-2xl bg-surface-muted p-4 text-sm text-content-secondary">
          <p>{sessionSummary.petshopName}</p>
          <p>{sessionSummary.serviceName}</p>
          <p>{sessionSummary.professionalName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <input type="hidden" {...register("bookingId")} />
        <input type="hidden" {...register("feedbackAccessToken")} />

        <Controller
          name="professionalRating"
          control={control}
          render={({ field }) => (
            <FeedbackRatingField
              name={field.name}
              label="Nota para o profissional"
              hint="Escolha uma nota de 1 a 5 para o atendimento realizado."
              value={field.value}
              error={errors.professionalRating?.message}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="petshopRating"
          control={control}
          render={({ field }) => (
            <FeedbackRatingField
              name={field.name}
              label="Nota para o petshop"
              hint="Avalie a experiência geral com o petshop e a organização do atendimento."
              value={field.value}
              error={errors.petshopRating?.message}
              onChange={field.onChange}
            />
          )}
        />

        <FormField
          label="Comentário (opcional)"
          hint="Se quiser, compartilhe um detalhe extra sobre a experiência."
          error={errors.comment?.message}
        >
          <Textarea
            {...register("comment")}
            placeholder="Conte o que mais gostou ou o que pode melhorar."
            maxLength={500}
          />
        </FormField>

        {submissionError ? (
          <div className="rounded-2xl bg-surface-danger-soft p-4 text-sm text-content-danger">
            {submissionError}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={isSubmitting}>
            Enviar feedback
          </Button>
          <Button href={statusHref} variant="secondary">
            Voltar para a reserva
          </Button>
        </div>

        <div className="flex items-start gap-2 rounded-2xl bg-surface-muted p-4 text-sm text-content-secondary">
          <MessageSquareWarning className="mt-0.5 h-4 w-4 text-content-brand" />
          <p>
            O feedback fica vinculado a esta reserva e pode ser enviado uma vez
            por navegador com o token salvo neste fluxo público.
          </p>
        </div>
      </form>
    </Card>
  );
}
