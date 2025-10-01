import { Customer } from "@/core/domain/customers/customer.entity";
import { UpdateCustomerDto } from "@/core/application/dtos/update-customer.dto";

export interface IEditCustomerDetail {
  execute(id: number, data: UpdateCustomerDto): Promise<Customer | null>;
}