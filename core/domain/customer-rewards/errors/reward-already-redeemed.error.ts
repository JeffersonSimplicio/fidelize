import { BaseError } from '@/core/domain/shared/errors/base.error';

export class RewardAlreadyRedeemedError extends BaseError {
  constructor(customerName?: string, rewardName?: string) {
    super(RewardAlreadyRedeemedError.buildMessage(customerName, rewardName));
  }

  private static buildMessage(
    customerName?: string,
    rewardName?: string,
  ): string {
    if (customerName && rewardName) {
      return `${customerName} já resgatou ${rewardName}.`;
    }

    if (customerName && !rewardName) {
      return `${customerName} já resgatou esta recompensa.`;
    }

    if (!customerName && rewardName) {
      return `A recompensa (${rewardName}), já foi resgatada.`;
    }

    return `Recompensa já resgatada.`;
  }
}
