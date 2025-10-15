import { RegisterCustomer } from "@/core/application/interfaces";
import { RegisterCustomerUseCase } from "@/core/application/use-cases";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import {
  CustomerEntityToDtoMapper,
  DbCustomerToDomainMapper
} from "@/core/infrastructure/mappers";
import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";
import { registerCustomerSchema } from "@/core/infrastructure/validation/zod/schemas/customers";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod.validation";


export function makeRegisterCustomer(): RegisterCustomer {
  const dbCustomerToDomainMapper = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerRepositoryDrizzle({
    dbClient: db,
    customerTable: customers,
    customerToDomainMapper: dbCustomerToDomainMapper
  });
  const validator = new ZodValidation(registerCustomerSchema);
  const mapperToDto = new CustomerEntityToDtoMapper();
  return new RegisterCustomerUseCase(customerRepo, validator, mapperToDto);
}