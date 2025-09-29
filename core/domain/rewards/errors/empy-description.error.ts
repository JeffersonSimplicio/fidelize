import { BaseError } from "@/core/domain/shared/errors/base.error";

export class EmptyDescriptionError extends BaseError {
  constructor() {
    super("Descrição não pode ser vazio.");
  }
}