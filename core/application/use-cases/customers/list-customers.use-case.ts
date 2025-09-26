import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { IListCustomers } from "@/core/application/interfaces/customers/list-customers";

export class ListCustomersUseCase implements IListCustomers {
  constructor(private readonly repo: ICustomerRepository) { }

  async execute(): Promise<Customer[]> {
    return this.repo.findAll();
  }
}