import { DeleteCustomer } from "@/core/application/interfaces/customers";
import { DeleteCustomerUseCase } from "@/core/application/use-cases";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import { DbCustomerToDomainMapper } from "@/core/infrastructure/mappers";
import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";


export function makeDeleteCustomer(): DeleteCustomer {
  const mapperToDomain = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerRepositoryDrizzle(db, customers, mapperToDomain);
  return new DeleteCustomerUseCase(customerRepo,)
}