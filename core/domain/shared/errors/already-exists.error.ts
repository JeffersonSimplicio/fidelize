import { BaseError } from '@/core/domain/shared/errors/base.error';

export class AlreadyExistsError extends BaseError {
  constructor(resource: string, identifier?: string) {
    const idText = identifier ? ` com identificador "${identifier}"` : '';
    super(`${resource} já existe${idText}.`);
  }
}
