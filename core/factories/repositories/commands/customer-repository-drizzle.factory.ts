import { CustomerRepository } from '@/core/domain/customers/customer.repository.interface';
import { db } from '@/core/infrastructure/database/drizzle/db';
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import { DbCustomerToDomainMapper } from '@/core/infrastructure/mappers';
import { CustomerRepositoryDrizzle } from '@/core/infrastructure/repositories/drizzle/commands';

export function makeCustomerRepositoryDrizzle(): CustomerRepository {
  const dbCustomerToDomainMapper = new DbCustomerToDomainMapper();
  return new CustomerRepositoryDrizzle({
    dbClient: db,
    customerTable: customers,
    customerToDomainMapper: dbCustomerToDomainMapper,
  });
}
