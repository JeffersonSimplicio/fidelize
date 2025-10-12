import { UpdateCustomerDto, CustomerDto } from "@/core/application/dtos/customers";

export interface EditCustomer {
  execute(id: number, data: UpdateCustomerDto): Promise<CustomerDto | null>;
}