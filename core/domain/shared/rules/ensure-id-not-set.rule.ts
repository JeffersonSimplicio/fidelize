import { IdAlreadyDefinedError } from "@/core/domain/shared/errors";

export function ensureIdNotSet(id?: number) {
  if (id !== undefined) throw new IdAlreadyDefinedError();
}