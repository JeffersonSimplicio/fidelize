import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { IGetCustomerDetail } from "@/core/application/interfaces/customers/get-customer-detail";

export class GetCustomerDetailUseCase implements IGetCustomerDetail {
  constructor(private readonly repo: ICustomerRepository) { }

  async execute(id: number): Promise<Customer | null> {
    return await this.repo.findById(id);
  }
}