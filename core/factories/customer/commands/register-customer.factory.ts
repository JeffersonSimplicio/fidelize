import { RegisterCustomer } from "@/core/application/interfaces";
import { RegisterCustomerUseCase } from "@/core/application/use-cases";
import { makeCustomerRepositoryDrizzle } from "@/core/factories/repositories";
import { CustomerEntityToDtoMapper } from "@/core/infrastructure/mappers";
import { registerCustomerSchema } from "@/core/infrastructure/validation/zod/schemas/customers";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod.validation";


export function makeRegisterCustomer(): RegisterCustomer {
  const customerRepo = makeCustomerRepositoryDrizzle();
  const validator = new ZodValidation(registerCustomerSchema);
  const mapperToDto = new CustomerEntityToDtoMapper();
  return new RegisterCustomerUseCase(customerRepo, validator, mapperToDto);
}