import { UseCaseResultHandler } from "@/core/application/interfaces/common";
import { ObjectResult } from "@/core/application/results/object-result";
import { BaseError } from "@/core/domain/shared/errors";

export class UseCaseResultHandlerImpl<I, O> implements UseCaseResultHandler<I, O> {
  constructor(private readonly useCase: { execute(input: I): Promise<O> }) { }

  async execute(input: I): Promise<ObjectResult<O>> {
    try {
      const result = await this.useCase.execute(input);
      return { success: true, data: result };
    } catch (error: any) {
      if (error instanceof BaseError) {
        return { success: false, error: error.message };
      }
      if (error instanceof Error) {
        // Implementar sistema de log
        return { success: false, error: error.message };
      }
      // Implementar sistema de log
      return { success: false, error: "Unexpected error occurred." };
    }
  }
}
