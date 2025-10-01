import { UpdateCustomerDto } from "@/core/application/dtos/customers/update-customer.dto";
import { Customer } from "@/core/domain/customers/customer.entity";

export interface IEditCustomerDetail {
  execute(id: number, data: UpdateCustomerDto): Promise<Customer | null>;
}