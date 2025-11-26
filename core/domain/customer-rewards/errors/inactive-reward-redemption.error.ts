import { BaseError } from '@/core/domain/shared/errors/base.error';

export class InactiveRewardRedemptionError extends BaseError {
  constructor() {
    super('Não é possível resgatar uma recompensas desativadas.');
  }
}
