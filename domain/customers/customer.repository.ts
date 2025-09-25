import { Customer } from './customer.entity';
import { CreateCustomerDto,  } from './dtos/create-customer.dto';
// import { UpdateCustomerDto } from './dtos/update-customer.dto';

export interface ICustomerRepository {
  create(data: CreateCustomerDto): Promise<Customer>;
  findById(id: number): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  // update(id: number, data: UpdateCustomerDto): Promise<Customer | null>;
  // delete(id: number): Promise<boolean>;
}