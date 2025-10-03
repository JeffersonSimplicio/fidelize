import { BaseError } from "@/core/domain/shared/errors/base.error";

export class RedeemedInFutureError extends BaseError {
  constructor() {
    super("Data do resgate não pode estar no futuro.");
  }
} 