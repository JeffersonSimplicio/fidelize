import { ListTopCustomersByPoints } from "@/core/application/interfaces/customers";
import { ListTopCustomersByPointsUseCase } from "@/core/application/use-cases/customers";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import {
  CustomerEntityToDtoMapper,
  DbCustomerToDomainMapper
} from "@/core/infrastructure/mappers";
import { CustomerQueryRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/queries";

export function makeListTopCustomersByPoints(): ListTopCustomersByPoints {
  const dbCustomerToDomainMapper = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerQueryRepositoryDrizzle({
    dbClient: db,
    customerTable: customers,
    customerToDomainMapper: dbCustomerToDomainMapper
  });
  const mapperToDto = new CustomerEntityToDtoMapper();
  return new ListTopCustomersByPointsUseCase(customerRepo, mapperToDto);
}