import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Customer as CustomerEntity } from '@/core/domain/customers/customer.entity';
import { CustomerDto } from "@/core/application/dtos/customers";

export class CustomerEntityToDtoMapper implements Mapper<
  CustomerEntity,
  CustomerDto
> {
  map(input: CustomerEntity): CustomerDto {
    return {
      id: input.id!,
      name: input.name,
      phone: input.phone,
      points: input.points,
      createAt: input.createdAt.toISOString(),
      lastVisitAt: input.lastVisitAt.toISOString(),
    }
  }
}