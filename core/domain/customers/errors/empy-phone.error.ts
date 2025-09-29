import { BaseError } from "@/core/domain/shared/errors/base.error";

export class EmptyPhoneError extends BaseError {
  constructor() {
    super("Telefone não pode ser vazio.");
  }
}