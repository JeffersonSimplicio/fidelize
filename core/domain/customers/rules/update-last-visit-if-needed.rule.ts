import { Customer } from '@/core/domain/customers/customer.entity'
import { UpdateCustomerDto } from "@/core/application/dtos/update-customer.dto";

export function updateLastVisitIfNeeded(customer: Customer, data: UpdateCustomerDto): void {
  const previousPoints = customer.points;

  if (
    data.points !== undefined
    && data.points > previousPoints
    && data.lastVisitAt === undefined
  ) {
    customer.lastVisitAt = new Date();
  } else if (data.lastVisitAt !== undefined) {
    customer.lastVisitAt = data.lastVisitAt;
  }
}
