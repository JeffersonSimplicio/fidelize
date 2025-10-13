import { CustomerDto } from "@/core/application/dtos/customers";
import { ListCustomers } from "@/core/application/interfaces/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerQueryRepository } from "@/core/domain/customers/customer.query.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export class ListCustomersUseCase implements ListCustomers {
  constructor(
    private readonly repo: CustomerQueryRepository,
    private readonly mapper: Mapper<Customer, CustomerDto>,
  ) { }

  async execute(): Promise<CustomerDto[]> {
    const allCustomers = await this.repo.findAll();
    return allCustomers.map(this.mapper.map);
  }
}