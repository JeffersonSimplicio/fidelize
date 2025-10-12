import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/write/customer.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import { DbCustomerToDomainMapper } from "@/core/infrastructure/mappers";
import { DeleteCustomerUseCase } from "@/core/application/use-cases";
import { DeleteCustomer } from "@/core/application/interfaces/customers";


export function makeDeleteCustomer(): DeleteCustomer {
  const mapperToDomain = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerRepositoryDrizzle(db, customers, mapperToDomain);
  return new DeleteCustomerUseCase(customerRepo,)
}