import { DeleteCustomer } from "@/core/application/interfaces/customers";
import { DeleteCustomerUseCase } from "@/core/application/use-cases";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import { DbCustomerToDomainMapper } from "@/core/infrastructure/mappers";
import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";


export function makeDeleteCustomer(): DeleteCustomer {
  const dbCustomerToDomainMapper = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerRepositoryDrizzle({
    dbClient: db,
    customerTable: customers,
    customerToDomainMapper: dbCustomerToDomainMapper
  });
  return new DeleteCustomerUseCase(customerRepo,)
}