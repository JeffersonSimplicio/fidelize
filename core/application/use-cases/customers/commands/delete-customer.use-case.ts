import { DeleteCustomer } from "@/core/application/interfaces/customers";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";

export class DeleteCustomerUseCase implements DeleteCustomer {
  constructor(private readonly customerRepo: CustomerRepository) { }

  async execute(id: number): Promise<void> {
    await this.customerRepo.delete(id);
  }
}