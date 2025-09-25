import { Customer } from '../customer.entity';

export type CreateCustomerDto = Pick<Customer, 'name' | 'phone'>;