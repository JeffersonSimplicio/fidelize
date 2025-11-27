import { BaseError } from '@/core/domain/shared/errors';

export class InvalidPointsRequiredError extends BaseError {
  private static readonly BASE_MESSAGE =
    'A quantidade de pontos necessária para uma recompensa deve ser maior que';

  constructor(points: number = 0, pointsInWords: string = 'zero') {
    const message =
      points === 0
        ? `${InvalidPointsRequiredError.BASE_MESSAGE} ${points} (${pointsInWords}).`
        : `${InvalidPointsRequiredError.BASE_MESSAGE} ${points}.`;

    super(message);
  }
}
