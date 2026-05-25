import { ApiRequestError } from "@/lib/api";

export const invalidFeedbackTokenMessage = "Token de feedback inválido.";
export const duplicateFeedbackReason =
  "Feedback já enviado para esta reserva.";
export const notCompletedFeedbackReason =
  "A reserva ainda não foi concluída.";
export const notEligibleFeedbackMessage =
  "A reserva informada ainda não está elegível para feedback.";

export function isInvalidFeedbackTokenError(
  error: unknown,
): error is ApiRequestError {
  return (
    error instanceof ApiRequestError &&
    error.message === invalidFeedbackTokenMessage
  );
}

export function isAlreadySubmittedFeedbackError(
  error: unknown,
): error is ApiRequestError {
  return (
    error instanceof ApiRequestError &&
    error.message.startsWith("Feedback já enviado para a reserva")
  );
}

export function isNotEligibleFeedbackError(
  error: unknown,
): error is ApiRequestError {
  return (
    error instanceof ApiRequestError &&
    error.message === notEligibleFeedbackMessage
  );
}

export function isAlreadySubmittedFeedbackReason(reason: string | null) {
  return reason === duplicateFeedbackReason;
}

export function isNotCompletedFeedbackReason(reason: string | null) {
  return reason === notCompletedFeedbackReason;
}
