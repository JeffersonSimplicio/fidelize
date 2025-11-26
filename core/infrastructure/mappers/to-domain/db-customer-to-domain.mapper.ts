import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { Customer } from '@/core/domain/customers/customer.entity';
import { CustomerSelect } from '@/core/infrastructure/database/drizzle/types';

export class DbCustomerToDomainMapper
  implements Mapper<CustomerSelect, Customer>
{
  map(input: CustomerSelect): Customer {
    const customer = new Customer({
      name: input.name,
      phone: input.phone,
      points: input.points,
      createdAt: input.createdAt,
      lastVisitAt: input.lastVisitAt,
    });
    customer.setId(input.id);

    return customer;
  }
}
