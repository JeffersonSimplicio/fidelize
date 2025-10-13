import { EditCustomer } from "@/core/application/interfaces/customers";
import { EditCustomerUseCase } from "@/core/application/use-cases";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import {
  CustomerEntityToDtoMapper,
  DbCustomerToDomainMapper
} from "@/core/infrastructure/mappers";
import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";
import { editCustomerSchema } from "@/core/infrastructure/validation/zod/schemas/customers";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod.validation";


export function makeEditCustomer(): EditCustomer {
  const mapperToDomain = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerRepositoryDrizzle(db, customers, mapperToDomain);
  const validator = new ZodValidation(editCustomerSchema);
  const mapperToDto = new CustomerEntityToDtoMapper();
  return new EditCustomerUseCase(customerRepo, validator, mapperToDto)
}