import { Customer } from '@/core/domain/customers/customer.entity';

export interface CustomerRepository {
  create(customer: Customer): Promise<Customer>;
  getById(id: number): Promise<Customer>;
  findByPhone(phone: string): Promise<Customer | null>;
  update(customer: Customer): Promise<Customer>;
  delete(id: number): Promise<void>;
}
