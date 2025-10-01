import { Customer } from "@/core/domain/customers/customer.entity";

export interface IListCustomers {
  execute(): Promise<Customer[]>;
}