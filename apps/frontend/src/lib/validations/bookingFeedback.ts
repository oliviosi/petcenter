import { z } from "zod";

export const bookingFeedbackSchema = z.object({
  bookingId: z.string().uuid("Reserva inválida."),
  feedbackAccessToken: z.string().min(1, "Token de feedback inválido."),
  professionalRating: z
    .number({
      error: "Avalie o atendimento do profissional.",
    })
    .min(1, "Avalie o atendimento do profissional.")
    .max(5, "Escolha uma nota entre 1 e 5."),
  petshopRating: z
    .number({
      error: "Avalie a experiência com o petshop.",
    })
    .min(1, "Avalie a experiência com o petshop.")
    .max(5, "Escolha uma nota entre 1 e 5."),
  comment: z
    .string()
    .trim()
    .max(500, "O comentário deve ter no máximo 500 caracteres.")
    .optional()
    .or(z.literal("")),
});

export type BookingFeedbackSubmissionValues = z.infer<
  typeof bookingFeedbackSchema
>;
