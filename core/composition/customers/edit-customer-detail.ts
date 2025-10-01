import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/customers.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import { EditCustomerDetailUseCase } from "@/core/application/use-cases/customers/edit-customer-detail.use-case";

const customerRepository = new CustomerRepositoryDrizzle(db, customers);
export const editCustomerDetail = new EditCustomerDetailUseCase(customerRepository);