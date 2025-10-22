import { BaseError } from "@/core/domain/shared/errors/base.error";

const DEFAULT_NOT_FOUND_MESSAGE = "O item buscado não foi encontrado.";

export class NotFoundError extends BaseError {
  constructor(message?: string) {
    const msg = message ?? DEFAULT_NOT_FOUND_MESSAGE;
    super(msg);
  }
}