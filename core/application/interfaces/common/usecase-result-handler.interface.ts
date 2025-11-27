import { ObjectResult } from '@/core/application/results/object-result';

export interface UseCaseResultHandler<I, O> {
  execute(input: I): Promise<ObjectResult<O>>;
}
