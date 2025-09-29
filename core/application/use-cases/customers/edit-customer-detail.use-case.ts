import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { IEditCustomerDetail } from "@/core/application/interfaces/customers/edit-customer-detail";
import { UpdateCustomerDto } from "@/core/application/dtos/update-customer.dto";

export class EditCustomerDetailUseCase implements IEditCustomerDetail {
  constructor(private readonly repo: ICustomerRepository) { }

  async execute(id: number, data: UpdateCustomerDto): Promise<Customer | null> {
    const customer = await this.repo.findById(id);
    if (!customer) return null;

    const previousPoints = customer.points;

    if (data.name !== undefined) customer.name = data.name;
    if (data.phone !== undefined) customer.phone = data.phone;
    if (data.points !== undefined) customer.points = data.points;

    if (
      data.points !== undefined &&
      data.points > previousPoints &&
      data.lastVisitAt === undefined
    ) {
      customer.lastVisitAt = new Date();
    } else if (data.lastVisitAt !== undefined) {
      customer.lastVisitAt = data.lastVisitAt;
    }

    const updatedCustomer = await this.repo.update(customer);

    return updatedCustomer;
  }
}