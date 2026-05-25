import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z
    .string()
    .min(1, "Senha é obrigatória.")
    .max(200, "Senha deve ter no máximo 200 caracteres."),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
