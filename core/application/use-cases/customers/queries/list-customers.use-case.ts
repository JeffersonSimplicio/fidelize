import { IListCustomers } from "@/core/application/interfaces/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";

export class ListCustomersUseCase implements IListCustomers {
  constructor(private readonly repo: ICustomerRepository) { }

  async execute(): Promise<Customer[]> {
    return await this.repo.findAll();
  }
}