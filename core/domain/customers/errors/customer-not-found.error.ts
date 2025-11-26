import { NotFoundError } from '@/core/domain/shared/errors';

export class CustomerNotFoundError extends NotFoundError {
  constructor() {
    super('Cliente não encontrado.');
  }
}
