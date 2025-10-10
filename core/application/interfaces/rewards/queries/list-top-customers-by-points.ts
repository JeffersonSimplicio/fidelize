import { Customer } from "@/core/domain/customers/customer.entity";

export interface IListTopCustomersByPoints {
  execute(limit: number): Promise<Customer[]>;
}