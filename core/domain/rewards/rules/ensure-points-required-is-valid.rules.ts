import { InvalidPointsRequiredError } from '@/core/domain/rewards/errors';

export function ensurePointsRequiredIsValid(value: number, minimum: number) {
  if (value < minimum) throw new InvalidPointsRequiredError();
}
