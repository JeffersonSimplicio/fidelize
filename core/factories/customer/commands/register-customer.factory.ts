import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/write/customer.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import {
  CustomerEntityToDtoMapper,
  DbCustomerToDomainMapper
} from "@/core/infrastructure/mappers";
import { registerCustomerSchema } from "@/core/infrastructure/validation/zod/schemas";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod.validation";
import { RegisterCustomerUseCase } from "@/core/application/use-cases";
import { RegisterCustomer } from "@/core/application/interfaces";


export function makeRegisterCustomer(): RegisterCustomer {
  const mapperToDomain = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerRepositoryDrizzle(db, customers, mapperToDomain);
  const validator = new ZodValidation(registerCustomerSchema);
  const mapperToDto = new CustomerEntityToDtoMapper();
  return new RegisterCustomerUseCase(customerRepo, validator, mapperToDto);
}