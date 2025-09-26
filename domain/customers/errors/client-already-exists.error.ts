import { AlreadyExistsError } from "@/domain/shared/errors/already-exists.error";

export class ClientAlreadyExistsError extends AlreadyExistsError {
  constructor(identifier?: string) {
    super("Cliente", identifier);
  }
}
