import { ValidationError } from '@/core/domain/validation/validation.interface';

import { BaseError } from './base.error';

export class ValidationException extends BaseError {
  public readonly errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    const friendlyMessage = ValidationException.formatErrors(errors);
    super(friendlyMessage);

    this.errors = errors;
  }

  private static formatErrors(errors: ValidationError[]): string {
    const grouped = errors.reduce<Record<string, string[]>>((acc, err) => {
      if (!acc[err.field]) {
        acc[err.field] = [];
      }
      acc[err.field].push(err.message);
      return acc;
    }, {});

    const problems = Object.entries(grouped)
      .map(([field, messages]) => {
        const formattedMessages = messages
          .map((msg) => `  - ${msg}`)
          .join('\n');
        return `${field}:\n${formattedMessages}`;
      })
      .join('\n\n');

    return `Foram encontrados problemas nos dados enviados:\n\n${problems}`;
  }
}
