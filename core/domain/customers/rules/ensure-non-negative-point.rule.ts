import { NegativePointsError } from "@/core/domain/customers/errors";

export function ensureNonNegativePoint(value: number, minimum: number) {
  if (value < minimum) throw new NegativePointsError();
}