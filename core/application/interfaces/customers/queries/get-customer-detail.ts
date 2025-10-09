import { Customer } from "@/core/domain/customers/customer.entity";

export interface IGetCustomerDetail {
  execute(id: number): Promise<Customer | null>;
}