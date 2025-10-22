import { CustomerDto } from "@/core/application/dtos/customers";
import { ListCustomers } from "@/core/application/interfaces/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerQueryRepository } from "@/core/domain/customers/customer.query.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export interface ListCustomersDep {
  customerQueryRepo: CustomerQueryRepository,
  customerToDtoMapper: Mapper<Customer, CustomerDto>,
}

export class ListCustomersUseCase implements ListCustomers {
  private readonly customerQueryRepo: CustomerQueryRepository;
  private readonly customerToDtoMapper: Mapper<Customer, CustomerDto>;

  constructor(deps: ListCustomersDep) {
    this.customerQueryRepo = deps.customerQueryRepo;
    this.customerToDtoMapper = deps.customerToDtoMapper
  }

  async execute(): Promise<CustomerDto[]> {
    const allCustomers = await this.customerQueryRepo.findAll();
    return allCustomers.map(this.customerToDtoMapper.map);
  }
}