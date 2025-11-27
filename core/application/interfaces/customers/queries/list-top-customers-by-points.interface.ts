import { CustomerDto } from '@/core/application/dtos';

export interface ListTopCustomersByPoints {
  execute(limit: number): Promise<CustomerDto[]>;
}
