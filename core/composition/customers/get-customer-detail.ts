import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/customers.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import { GetCustomerDetailUseCase } from "@/core/application/use-cases/customers/get-customer-detail.use-case";

const customerRepository = new CustomerRepositoryDrizzle(db, customers);
export const getCustomerDetail = new GetCustomerDetailUseCase(customerRepository);