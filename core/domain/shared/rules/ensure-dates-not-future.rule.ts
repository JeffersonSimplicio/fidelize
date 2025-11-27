import { RedeemedInFutureError } from '@/core/domain/customer-rewards/errors';
import { LastVisitInFutureError } from '@/core/domain/customers/errors';
import { CreationDateInFutureError } from '@/core/domain/shared/errors';

export function ensureDatesNotInFuture(param: {
  createdAt?: Date;
  lastVisitAt?: Date;
  redeemedAt?: Date;
}) {
  const now = new Date().getTime();
  if (param.createdAt && param.createdAt.getTime() > now) {
    throw new CreationDateInFutureError();
  }
  if (param.lastVisitAt && param.lastVisitAt.getTime() > now) {
    throw new LastVisitInFutureError();
  }
  if (param.redeemedAt && param.redeemedAt.getTime() > now) {
    throw new RedeemedInFutureError();
  }
}
