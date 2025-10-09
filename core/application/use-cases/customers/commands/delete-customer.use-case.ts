import { IDeleteCustomer } from "@/core/application/interfaces/customers";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";

export class DeleteCustomerUseCase implements IDeleteCustomer {
  constructor(private readonly repo: ICustomerRepository) { }

  async execute(id: number): Promise<boolean> {
    return await this.repo.delete(id);
  }
}