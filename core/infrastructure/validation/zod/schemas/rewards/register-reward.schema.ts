import { z } from "zod";

export const registerRewardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nome deve ter pelo menos 3(três) letras.")
    .max(100, "Nome deve conter no máximo 100(cem) letras."),

  pointsRequired: z
    .coerce.number()
    .int("Pontos deve ser um valor inteiro.")
    .positive("Pontos necessários deve maior de que 0(zero).")
    .max(1_000_000, "Pontos não pode ultrapassar 1.000.000(um milhão)."),

  description: z
    .string()
    .trim()
    .min(10, "A descrição deve ter pelo menos 10(dez) caracteres.")
    .max(500, "A descrição não pode ultrapassar 500(quinhentos) caracteres.")
})