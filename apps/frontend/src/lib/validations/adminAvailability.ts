import { z } from "zod";

const timeFieldSchema = z
  .string()
  .trim()
  .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Informe um horário válido.");

export const adminAvailabilityFieldsSchema = z
  .object({
    weekday: z
      .string()
      .trim()
      .refine((value) => /^\d+$/.test(value), {
        message: "Selecione um dia da semana válido.",
      })
      .refine((value) => Number(value) >= 0 && Number(value) <= 6, {
        message: "Dia da semana deve estar entre domingo e sábado.",
      }),
    startTime: timeFieldSchema,
    endTime: timeFieldSchema,
  })
  .refine(
    (value) => {
      const startTime = value.startTime.length === 5 ? `${value.startTime}:00` : value.startTime;
      const endTime = value.endTime.length === 5 ? `${value.endTime}:00` : value.endTime;

      return endTime > startTime;
    },
    {
      message: "Hora de fim deve ser posterior à hora de início.",
      path: ["endTime"],
    },
  );

export const createAdminAvailabilitySchema = adminAvailabilityFieldsSchema.safeExtend({
  professionalId: z.string().uuid("Profissional inválido."),
});

export const updateAdminAvailabilitySchema = adminAvailabilityFieldsSchema.safeExtend({
  professionalId: z.string().uuid("Profissional inválido."),
  availabilityId: z.string().uuid("Janela de disponibilidade inválida."),
});

export const deleteAdminAvailabilitySchema = z.object({
  professionalId: z.string().uuid("Profissional inválido."),
  availabilityId: z.string().uuid("Janela de disponibilidade inválida."),
});

export type AdminAvailabilityFieldsValues = z.infer<typeof adminAvailabilityFieldsSchema>;
export type CreateAdminAvailabilityValues = z.infer<typeof createAdminAvailabilitySchema>;
export type UpdateAdminAvailabilityValues = z.infer<typeof updateAdminAvailabilitySchema>;
export type DeleteAdminAvailabilityValues = z.infer<typeof deleteAdminAvailabilitySchema>;
