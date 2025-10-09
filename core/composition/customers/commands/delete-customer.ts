import { DeleteCustomerUseCase } from "@/core/application/use-cases/customers";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/customers.repository";

const customerRepository = new CustomerRepositoryDrizzle(db, customers);
export const deleteCustomer = new DeleteCustomerUseCase(customerRepository);