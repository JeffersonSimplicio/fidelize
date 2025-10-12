import { RegisterCustomerUseCase } from "@/core/application/use-cases/customers";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/customers.repository";
import { registerCustomerSchema } from "@/core/infrastructure/validation/zod/schemas";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod.validation";

const validator = new ZodValidation(registerCustomerSchema);
const customerRepository = new CustomerRepositoryDrizzle(db, customers);
export const registerCustomer = new RegisterCustomerUseCase(
  customerRepository,
  validator
);