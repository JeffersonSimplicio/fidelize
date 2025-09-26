import { Customer, CustomerCreateProps } from '@/core/domain/customers/customer.entity';

export interface ICustomerRepository {
  create(data: CustomerCreateProps): Promise<Customer>;
  findById(id: number): Promise<Customer | null>;
  findByName(name: string): Promise<Customer | null>;
  findByPhone(phone: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  // update(id: number, data: CustomerUpdateProps): Promise<Customer | null>;
  // delete(id: number): Promise<boolean>;
}