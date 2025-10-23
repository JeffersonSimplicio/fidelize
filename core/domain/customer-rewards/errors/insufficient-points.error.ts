import { BaseError } from "@/core/domain/shared/errors/base.error";

export class InsufficientPointsError extends BaseError {
  constructor(customerName?: string, rewardName?: string) {
    const message = InsufficientPointsError.buildMessage(customerName, rewardName);
    super(message);
  }

  private static buildMessage(customerName?: string, rewardName?: string): string {
    if (customerName && rewardName) {
      return `${customerName} não tem pontos suficientes para resgatar ${rewardName}.`;
    }

    if (customerName && !rewardName) {
      return `${customerName} não tem pontos suficientes para resgatar a recompensa.`;
    }

    if (!customerName && rewardName) {
      return `Não há pontos suficientes para resgatar ${rewardName}.`;
    }

    return `Pontos insuficientes para resgate a recompensa.`;
  }
}
