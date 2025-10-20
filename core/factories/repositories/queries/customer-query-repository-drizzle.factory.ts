import { CustomerQueryRepository } from "@/core/domain/customers/customer.query.repository.interface";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import { DbCustomerToDomainMapper } from "@/core/infrastructure/mappers";
import { CustomerQueryRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/queries";

export function makeCustomerQueryRepositoryDrizzle(): CustomerQueryRepository {
  const dbCustomerToDomainMapper = new DbCustomerToDomainMapper();
  return new CustomerQueryRepositoryDrizzle({
    dbClient: db,
    customerTable: customers,
    customerToDomainMapper: dbCustomerToDomainMapper
  });
}