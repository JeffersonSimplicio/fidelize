import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/customers.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import { DeleteCustomerUseCase } from "@/core/application/use-cases/customers/delete-customer.use-case";

const customerRepository = new CustomerRepositoryDrizzle(db, customers);
export const deleteCustomer = new DeleteCustomerUseCase(customerRepository);