import { CustomerDto } from "@/core/application/dtos/customers";

export interface ListCustomers {
  execute(): Promise<CustomerDto[]>;
}