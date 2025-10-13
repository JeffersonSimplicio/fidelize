import { ListCustomers } from "@/core/application/interfaces/customers";
import { ListCustomersUseCase } from "@/core/application/use-cases/customers";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import {
  CustomerEntityToDtoMapper,
  DbCustomerToDomainMapper
} from "@/core/infrastructure/mappers";
import { CustomerQueryRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/queries";

export function makeListCustomers(): ListCustomers {
  const mapperToDomain = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerQueryRepositoryDrizzle(
    db,
    customers,
    mapperToDomain
  );
  const mapperToDto = new CustomerEntityToDtoMapper();
  return new ListCustomersUseCase(customerRepo, mapperToDto);
}