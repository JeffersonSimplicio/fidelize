import { Customer } from '@/core/domain/customers/customer.entity';

export interface CustomerQueryRepository {
  findByName(name: string): Promise<Customer[]>;
  findAll(): Promise<Customer[]>;
}