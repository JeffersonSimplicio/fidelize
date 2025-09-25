import { DbCustomer } from '@/database/schema/customers';
import { Customer as DomainCustomer } from '@/domain/customers/customer.entity';

export function mapDbCustomerToDomain(dbCustomer: DbCustomer): DomainCustomer {
  return {
    id: dbCustomer.id,
    name: dbCustomer.name,
    phone: dbCustomer.phone,
    points: dbCustomer.points,
    lastVisitAt: new Date(dbCustomer.lastVisitAt),
    createdAt: new Date(dbCustomer.createdAt),
  };
}
