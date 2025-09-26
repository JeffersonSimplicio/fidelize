import { CreateCustomerDto } from "@/application/dtos/create-customer.dto";
import { Customer } from "@/domain/customers/customer.entity";

export interface IRegisterCustomer {
  execute(data: CreateCustomerDto): Promise<Customer>;
}