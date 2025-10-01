import { ZodSchema } from "zod";
import { IValidation, ValidationError } from "@/core/domain/validation/validation";
import { validationFieldLabels } from "@/core/domain/validation/validation-field-labels";

export class ZodValidation<T> implements IValidation<T> {
  constructor(private readonly schema: ZodSchema<T>) { }

  validate(input: T): ValidationError[] {
    const result = this.schema.safeParse(input);
    if (result.success) return [];

    return result.error.errors.map((err) => {
      const field = err.path.join(".");
      return {
        field: validationFieldLabels[field] ?? field,
        message: err.message,
      };
    });
  }
}
