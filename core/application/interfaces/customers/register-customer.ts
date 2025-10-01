import { CreateCustomerDto } from "@/core/application/dtos/customers/create-customer.dto";
import { Customer } from "@/core/domain/customers/customer.entity";

export interface IRegisterCustomer {
  execute(data: CreateCustomerDto): Promise<Customer>;
}