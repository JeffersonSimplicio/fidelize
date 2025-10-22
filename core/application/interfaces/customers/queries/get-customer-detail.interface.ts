import { CustomerDto } from "@/core/application/dtos/customers";

export interface GetCustomerDetail {
  execute(id: number): Promise<CustomerDto>;
}