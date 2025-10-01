import { BaseError } from "@/core/domain/shared/errors/base.error";

export class IdAlreadyDefinedError extends BaseError {
  constructor() {
    super("Id já está definido.");
  }
}