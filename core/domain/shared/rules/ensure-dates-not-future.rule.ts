import { LastVisitInFutureError } from "@/core/domain/customers/errors";
import { CreationDateInFutureError } from "@/core/domain/shared/errors"

export function ensureDatesNotInFuture(createdAt: Date, lastVisitAt?: Date) {
  const now = new Date().getTime();
  if (createdAt.getTime() > now) throw new CreationDateInFutureError();
  if (lastVisitAt && lastVisitAt.getTime() > now) throw new LastVisitInFutureError();

}