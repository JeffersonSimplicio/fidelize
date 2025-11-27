import { AlreadyExistsError } from '@/core/domain/shared/errors/already-exists.error';

export class ClientAlreadyExistsError extends AlreadyExistsError {
  constructor(identifier?: string) {
    super('Cliente', identifier);
  }
}
