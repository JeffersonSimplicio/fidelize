import { Customer as CustomerEntity } from '@/core/domain/customers/customer.entity';
import { CustomerSelect } from '@/core/infrastructure/database/drizzle/types';

export function mapDbCustomerToDomain(dbCustomer: CustomerSelect): CustomerEntity {
  const customer = new CustomerEntity({
    name: dbCustomer.name,
    phone: dbCustomer.phone,
    points: dbCustomer.points,
    createdAt: dbCustomer.createdAt,
    lastVisitAt: dbCustomer.lastVisitAt
  });
  customer.setId(dbCustomer.id);

  return customer;
}
