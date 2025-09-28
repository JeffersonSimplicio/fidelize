import { CreateCustomerDto } from "@/core/application/dtos/create-customer.dto";
import { Customer } from "@/core/domain/customers/customer.entity";

export interface IRegisterCustomer {
  execute(data: CreateCustomerDto): Promise<Customer>;
}