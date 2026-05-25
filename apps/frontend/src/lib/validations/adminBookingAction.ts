import { z } from "zod";

const confirmationSchema = z.boolean().refine((value) => value, {
  message: "Confirme a ação antes de continuar.",
});

export const completeAdminBookingSchema = z.object({
  bookingId: z.string().uuid("Reserva inválida."),
  finalChargedPrice: z
    .string()
    .trim()
    .min(1, "Preço final é obrigatório.")
    .refine((value) => !Number.isNaN(Number(value.replace(",", "."))), {
      message: "Informe um preço final válido.",
    })
    .refine((value) => Number(value.replace(",", ".")) >= 0, {
      message: "Preço final deve ser maior ou igual a zero.",
    })
    .refine((value) => {
      const normalizedValue = Number(value.replace(",", "."));
      return Number(normalizedValue.toFixed(2)) === normalizedValue;
    }, {
      message: "Preço final deve ter no máximo 2 casas decimais.",
    }),
  confirm: confirmationSchema,
});

export const cancelAdminBookingSchema = z.object({
  bookingId: z.string().uuid("Reserva inválida."),
  reason: z
    .string()
    .trim()
    .min(1, "Motivo do cancelamento é obrigatório.")
    .max(500, "Motivo do cancelamento deve ter no máximo 500 caracteres."),
  confirm: confirmationSchema,
});

export const noShowAdminBookingSchema = z.object({
  bookingId: z.string().uuid("Reserva inválida."),
  reason: z
    .string()
    .trim()
    .min(1, "Motivo do não comparecimento é obrigatório.")
    .max(500, "Motivo do não comparecimento deve ter no máximo 500 caracteres."),
  confirm: confirmationSchema,
});

export type CompleteAdminBookingValues = z.input<typeof completeAdminBookingSchema>;
export type CancelAdminBookingValues = z.infer<typeof cancelAdminBookingSchema>;
export type NoShowAdminBookingValues = z.infer<typeof noShowAdminBookingSchema>;
