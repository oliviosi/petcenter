"use server";

import { ApiRequestError, api } from "@/lib/api";
import {
  bookingFeedbackSchema,
  type BookingFeedbackSubmissionValues,
} from "@/lib/validations/bookingFeedback";
import {
  isAlreadySubmittedFeedbackError,
  isInvalidFeedbackTokenError,
  isNotEligibleFeedbackError,
} from "@/lib/bookingFeedback";
import type { SubmitBookingFeedbackActionResult } from "@/types";

export async function submitBookingFeedbackAction(
  values: BookingFeedbackSubmissionValues,
): Promise<SubmitBookingFeedbackActionResult> {
  const parsedValues = bookingFeedbackSchema.safeParse(values);

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return {
      success: false,
      code: "validation",
      message: "Revise os dados informados antes de enviar o feedback.",
      fieldErrors: Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [
          field,
          messages?.[0] ?? undefined,
        ]),
      ),
    };
  }

  try {
    const feedback = await api.submitBookingFeedback(parsedValues.data.bookingId, {
      feedbackAccessToken: parsedValues.data.feedbackAccessToken,
      professionalRating: parsedValues.data.professionalRating,
      petshopRating: parsedValues.data.petshopRating,
      comment: parsedValues.data.comment?.trim() || undefined,
    });

    return {
      success: true,
      feedback,
    };
  } catch (error) {
    if (isInvalidFeedbackTokenError(error)) {
      return {
        success: false,
        code: "invalid-token",
        message: error.message,
      };
    }

    if (isAlreadySubmittedFeedbackError(error)) {
      return {
        success: false,
        code: "already-submitted",
        message: error.message,
      };
    }

    if (isNotEligibleFeedbackError(error)) {
      return {
        success: false,
        code: "ineligible",
        message: error.message,
      };
    }

    if (error instanceof ApiRequestError) {
      return {
        success: false,
        code: "unexpected",
        message: error.message,
      };
    }

    return {
      success: false,
      code: "unexpected",
      message: "Não foi possível enviar o feedback agora. Tente novamente.",
    };
  }
}
