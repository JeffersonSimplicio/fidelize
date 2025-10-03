import { z } from "zod";
import { brazilAreaCodesByState } from "@/core/constants/brazil-area-codes"

export const editCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nome deve ter pelo menos 3(três) letras.")
    .max(50, "Nome deve conter no máximo 50(cinquenta) letras.")
    .optional(),

  phone: z
    .coerce.string()
    .trim()
    .length(11, "Telefone deve conter 11(onze) dígitos.")
    .regex(/^\d+$/, "Telefone deve conter apenas números.")
    .refine((phone) => {
      const ddd = phone.slice(0, 2);
      return brazilAreaCodesByState.some((state) => state.ddds.includes(ddd));
    }, {
      message: "DDD inválido.",
    })
    .optional(),

  points: z
    .coerce.number()
    .int("Pontos deve ser um número inteiro.")
    .nonnegative("Pontos deve ser maior ou igual a 0(zero).")
    .max(1_000_000, "Pontos não pode ultrapassar 1.000.000(um milhão).")
    .optional(),

  lastVisitAt: z
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: "Data inválida.",
    })
    .refine((date) => date <= new Date(), {
      message: "Data da última visita não pode ser no futuro.",
    })
    .optional(),
});
