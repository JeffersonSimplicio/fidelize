import { EditCustomer } from '@/core/application/interfaces/customers';
import { EditCustomerUseCase } from '@/core/application/use-cases';
import { makeCustomerRepositoryDrizzle } from '@/core/factories/repositories';
import { CustomerEntityToDtoMapper } from '@/core/infrastructure/mappers';
import { editCustomerSchema } from '@/core/infrastructure/validation/zod/schemas/customers';
import { ZodValidation } from '@/core/infrastructure/validation/zod/zod.validation';

export function makeEditCustomer(): EditCustomer {
  const customerRepo = makeCustomerRepositoryDrizzle();
  const zodValidation = new ZodValidation(editCustomerSchema);
  const customerEntityToDtoMapper = new CustomerEntityToDtoMapper();
  return new EditCustomerUseCase({
    customerRepo: customerRepo,
    editCustomerValidator: zodValidation,
    customerToDtoMapper: customerEntityToDtoMapper,
  });
}
