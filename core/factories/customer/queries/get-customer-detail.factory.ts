import { GetCustomerDetail } from "@/core/application/interfaces/customers";
import { GetCustomerDetailUseCase } from "@/core/application/use-cases/customers";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import {
  CustomerEntityToDtoMapper,
  DbCustomerToDomainMapper
} from "@/core/infrastructure/mappers";
import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";

export function makeGetCustomerDetail(): GetCustomerDetail {
  const mapperToDomain = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerRepositoryDrizzle(db, customers, mapperToDomain);
  const mapperToDto = new CustomerEntityToDtoMapper();
  return new GetCustomerDetailUseCase(customerRepo, mapperToDto);
}