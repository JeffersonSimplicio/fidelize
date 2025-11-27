import { CustomerDto } from '@/core/application/dtos';
import { ListTopCustomersByPoints } from '@/core/application/interfaces/customers';
import { Customer } from '@/core/domain/customers/customer.entity';
import { CustomerQueryRepository } from '@/core/domain/customers/customer.query.repository.interface';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';

export interface ListTopCustomersByPointsDep {
  customerQueryRepo: CustomerQueryRepository;
  customerToDtoMapper: Mapper<Customer, CustomerDto>;
}

export class ListTopCustomersByPointsUseCase
  implements ListTopCustomersByPoints
{
  private static MIN_LIMIT = 1;
  private readonly customerQueryRepo: CustomerQueryRepository;
  private readonly customerToDtoMapper: Mapper<Customer, CustomerDto>;

  constructor(deps: ListTopCustomersByPointsDep) {
    this.customerQueryRepo = deps.customerQueryRepo;
    this.customerToDtoMapper = deps.customerToDtoMapper;
  }

  async execute(limit: number = 3): Promise<CustomerDto[]> {
    const effectiveLimit = Math.max(
      limit,
      ListTopCustomersByPointsUseCase.MIN_LIMIT,
    );

    const topCustomers =
      await this.customerQueryRepo.findTopCustomersByPoints(effectiveLimit);

    return topCustomers.map((c) => this.customerToDtoMapper.map(c));
  }
}
