import { NegativePointsError } from "@/core/domain/customers/errors";

export function ensureNonNegativePoint(value: number) {
  if (value < 0) throw new NegativePointsError();
}