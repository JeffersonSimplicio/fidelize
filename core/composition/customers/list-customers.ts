import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/customers.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import { ListCustomersUseCase } from "@/core/application/use-cases/customers/list-customers.use-case";

const customerRepository = new CustomerRepositoryDrizzle(db, customers);
export const listCustomers = new ListCustomersUseCase(customerRepository);