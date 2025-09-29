import { BaseError } from "@/core/domain/shared/errors/base.error";

export class CreationDateInFutureError extends BaseError {
  constructor() {
    super("Data de criação não pode estar no futuro.");
  }
}