import { Customer as DomainCustomer } from '@/domain/customers/customer.entity';
import { CustomerSelect } from '@/infrastructure/database/drizzle/types';

export function mapDbCustomerToDomain(dbCustomer: CustomerSelect): DomainCustomer {
  return {
    id: dbCustomer.id,
    name: dbCustomer.name,
    phone: dbCustomer.phone,
    points: dbCustomer.points,
    lastVisitAt: dbCustomer.lastVisitAt instanceof Date
      ? dbCustomer.lastVisitAt
      : new Date(dbCustomer.lastVisitAt),
    createdAt: dbCustomer.createdAt instanceof Date
      ? dbCustomer.createdAt
      : new Date(dbCustomer.createdAt),
  };
}
