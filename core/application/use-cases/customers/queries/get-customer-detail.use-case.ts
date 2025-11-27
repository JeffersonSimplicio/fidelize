import { GetCustomerDetail } from '@/core/application/interfaces/customers';
import { Customer } from '@/core/domain/customers/customer.entity';
import { CustomerRepository } from '@/core/domain/customers/customer.repository.interface';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { CustomerDto } from '@/core/application/dtos/customers';

export interface GetCustomerDetailDep {
  customerRepo: CustomerRepository;
  customerToDtoMapper: Mapper<Customer, CustomerDto>;
}

export class GetCustomerDetailUseCase implements GetCustomerDetail {
  private readonly customerRepo: CustomerRepository;
  private readonly customerToDtoMapper: Mapper<Customer, CustomerDto>;

  constructor(deps: GetCustomerDetailDep) {
    this.customerRepo = deps.customerRepo;
    this.customerToDtoMapper = deps.customerToDtoMapper;
  }

  async execute(id: number): Promise<CustomerDto> {
    const customer = await this.customerRepo.getById(id);
    return this.customerToDtoMapper.map(customer);
  }
}
