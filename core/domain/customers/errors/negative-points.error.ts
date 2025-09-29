import { BaseError } from "@/core/domain/shared/errors/base.error";

export class NegativePointsError extends BaseError {
  constructor() {
    super("Pontos não podem ser menores que 0.");
  }
}