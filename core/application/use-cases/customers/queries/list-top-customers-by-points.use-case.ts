import { CustomerDto } from "@/core/application/dtos";
import { ListTopCustomersByPoints } from "@/core/application/interfaces/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerQueryRepository } from "@/core/domain/customers/customer.query.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export class ListTopCustomersByPointsUseCase implements ListTopCustomersByPoints {
  private static MIN_LIMIT = 1;

  constructor(
    private readonly repo: CustomerQueryRepository,
    private readonly mapper: Mapper<Customer, CustomerDto>,
  ) { }

  async execute(limit: number = 3): Promise<CustomerDto[]> {
    const effectiveLimit = Math.max(limit, ListTopCustomersByPointsUseCase.MIN_LIMIT);

    const topCustomers = await this.repo.findTopCustomersByPoints(effectiveLimit);

    return topCustomers.map(this.mapper.map);
  }
}