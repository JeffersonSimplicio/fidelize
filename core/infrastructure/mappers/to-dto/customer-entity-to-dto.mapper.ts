import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { Customer } from '@/core/domain/customers/customer.entity';
import { CustomerDto } from '@/core/application/dtos/customers';

export class CustomerEntityToDtoMapper
  implements Mapper<Customer, CustomerDto>
{
  map(input: Customer): CustomerDto {
    return {
      id: input.id!,
      name: input.name,
      phone: input.phone,
      points: input.points,
      createdAt: input.createdAt.toISOString(),
      lastVisitAt: input.lastVisitAt.toISOString(),
    };
  }
}
