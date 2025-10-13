import { GetCustomerDetail } from "@/core/application/interfaces/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { CustomerDto } from "@/core/application/dtos/customers";

export class GetCustomerDetailUseCase implements GetCustomerDetail {
  constructor(
    private readonly repo: CustomerRepository,
    private readonly mapper: Mapper<Customer, CustomerDto>,
  ) { }

  async execute(id: number): Promise<CustomerDto> {
    const customer = await this.repo.getById(id);
    return this.mapper.map(customer);
  }
}