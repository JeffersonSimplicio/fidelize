import { ZodSchema } from 'zod';

import { validationFieldLabels } from '@/core/domain/validation/validation-field-labels';
import {
  Validation,
  ValidationError,
} from '@/core/domain/validation/validation.interface';

export class ZodValidation<T> implements Validation<T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  validate(input: T): ValidationError[] {
    const result = this.schema.safeParse(input);
    if (result.success) return [];

    return result.error.errors.map((err) => {
      const field = err.path.join('.');
      return {
        field: validationFieldLabels[field] ?? field,
        message: err.message,
      };
    });
  }
}
