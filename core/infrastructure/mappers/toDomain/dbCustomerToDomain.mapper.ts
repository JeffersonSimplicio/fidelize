import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Customer as CustomerEntity } from '@/core/domain/customers/customer.entity';
import { CustomerSelect } from '@/core/infrastructure/database/drizzle/types';

export class DbCustomerToDomainMapper implements Mapper<CustomerSelect, CustomerEntity> {
  map(input: CustomerSelect): CustomerEntity {
    const customer = new CustomerEntity({
      name: input.name,
      phone: input.phone,
      points: input.points,
      createdAt: input.createdAt,
      lastVisitAt: input.lastVisitAt
    });
    customer.setId(input.id);

    return customer;
  }
}