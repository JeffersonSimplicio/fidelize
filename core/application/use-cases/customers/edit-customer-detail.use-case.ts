import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { IEditCustomerDetail } from "@/core/application/interfaces/customers/edit-customer-detail";
import { UpdateCustomerDto } from "@/core/application/dtos/update-customer.dto";
import { updateLastVisitIfNeeded } from "@/core/domain/customers/rules/update-last-visit-if-needed.rule";

export class EditCustomerDetailUseCase implements IEditCustomerDetail {
  constructor(private readonly repo: ICustomerRepository) { }

  async execute(id: number, data: UpdateCustomerDto): Promise<Customer | null> {
    const customer = await this.repo.findById(id);
    if (!customer) return null;

    if (data.name !== undefined) customer.name = data.name;
    if (data.phone !== undefined) customer.phone = data.phone;
    if (data.points !== undefined) customer.points = data.points;

    updateLastVisitIfNeeded(customer, data)

    const updatedCustomer = await this.repo.update(customer);

    return updatedCustomer;
  }
}