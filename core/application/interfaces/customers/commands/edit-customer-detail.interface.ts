import { UpdateCustomerDto, CustomerDto } from "@/core/application/dtos/customers";

export interface EditCustomerDetail {
  execute(id: number, data: UpdateCustomerDto): Promise<CustomerDto | null>;
}