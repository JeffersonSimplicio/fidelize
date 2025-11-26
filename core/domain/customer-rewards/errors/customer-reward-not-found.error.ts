import { NotFoundError } from '@/core/domain/shared/errors';

export class CustomerRewardNotFoundError extends NotFoundError {
  constructor() {
    super('Resgate de recompensa não encontrado.');
  }
}
