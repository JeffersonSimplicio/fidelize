import {
  CreateCustomerDto,
  CustomerDto,
} from '@/core/application/dtos/customers';

export interface RegisterCustomer {
  execute(data: CreateCustomerDto): Promise<CustomerDto>;
}
