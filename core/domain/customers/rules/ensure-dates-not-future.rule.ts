import { LastVisitInFutureError, CreationInFutureError } from "@/core/domain/customers/errors";

export function ensureDatesNotInFuture(createdAt: Date, lastVisitAt: Date) {
  const now = new Date().getTime();
  if (createdAt.getTime() > now) throw new CreationInFutureError();
  if (lastVisitAt.getTime() > now) throw new LastVisitInFutureError();
}