import { BaseError } from "@/core/domain/shared/errors/base.error";

export class LastVisitBeforeCreationError extends BaseError {
  constructor() {
    super("Última visita não pode ser antes da criação.");
  }
}