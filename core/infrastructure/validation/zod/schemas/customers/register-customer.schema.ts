import { z } from "zod";
import { brazilAreaCodesByState } from "@/core/constants/brazil-area-codes"

export const registerCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nome deve ter pelo menos 3(três) letras.")
    .max(50, "Nome deve conter no máximo 50(cinquenta) letras."),

  phone: z
    .coerce.string()
    .trim()
    .regex(/^\d+$/, "Telefone deve conter apenas números.")
    .length(11, "Telefone deve conter 11(onze) dígitos.")
    .refine((phone) => {
      const ddd = phone.slice(0, 2);
      return brazilAreaCodesByState.some((state) => state.ddds.includes(ddd));
    }, {
      message: "DDD inválido.",
    }),
});
