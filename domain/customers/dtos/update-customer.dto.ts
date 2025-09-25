import { Customer } from '../customer.entity';
export type UpdateCustomerDto = Partial<Omit<Customer, 'id' | 'createdAt'>>;