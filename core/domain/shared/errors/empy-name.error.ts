import { BaseError } from "@/core/domain/shared/errors/base.error";

export class EmptyNameError extends BaseError {
  constructor() {
    super("Nome não pode ser vazio.");
  }
}