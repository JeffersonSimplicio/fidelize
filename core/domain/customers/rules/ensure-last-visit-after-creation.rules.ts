import { LastVisitBeforeCreationError } from "@/core/domain/customers/errors";

export function ensureLastVisitAfterCreation(lastVisitAt: Date, createdAt: Date) {
  if (lastVisitAt.getTime() < createdAt.getTime()) {
    throw new LastVisitBeforeCreationError();
  }
}