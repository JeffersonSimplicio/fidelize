import { DeleteCustomer } from '@/core/application/interfaces/customers';
import { CustomerRepository } from '@/core/domain/customers/customer.repository.interface';

export interface DeleteCustomerDep {
  customerRepo: CustomerRepository;
}

export class DeleteCustomerUseCase implements DeleteCustomer {
  private readonly customerRepo: CustomerRepository;

  constructor(deps: DeleteCustomerDep) {
    this.customerRepo = deps.customerRepo;
  }

  async execute(id: number): Promise<void> {
    await this.customerRepo.getById(id);
    await this.customerRepo.delete(id);
  }
}
