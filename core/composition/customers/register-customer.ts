import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/customers.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import { RegisterCustomerUseCase } from "@/core/application/use-cases/customers/register-customer.use-case";

const customerRepository = new CustomerRepositoryDrizzle(db, customers);
export const registerCustomer = new RegisterCustomerUseCase(customerRepository);