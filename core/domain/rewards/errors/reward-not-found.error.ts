import { NotFoundError } from '@/core/domain/shared/errors';
export class RewardNotFoundError extends NotFoundError {
  constructor() {
    super('Recompensa não encontrada.');
  }
}
