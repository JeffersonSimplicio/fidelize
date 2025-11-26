import { BaseError } from '@/core/domain/shared/errors/base.error';

export class LastVisitInFutureError extends BaseError {
  constructor() {
    super('Última visita não pode estar no futuro.');
  }
}
