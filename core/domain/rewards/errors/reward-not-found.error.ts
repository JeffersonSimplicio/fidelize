import { NotFoundError } from "@/core/domain/shared/errors"
export class RewardNotFoundError extends NotFoundError {
  constructor() {
    super("A recompensa buscada não foi encontrada.");
  }
}