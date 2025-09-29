import { Customer } from '@/core/domain/customers/customer.entity';

export interface ICustomerRepository {
  create(customer: Customer): Promise<Customer>;
  findById(id: number): Promise<Customer | null>;
  findByName(name: string): Promise<Customer[]>;
  findByPhone(phone: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  update(customer: Customer): Promise<Customer | null>;
  delete(id: number): Promise<boolean>;
}