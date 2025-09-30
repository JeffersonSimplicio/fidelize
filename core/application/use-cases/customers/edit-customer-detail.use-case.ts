import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { IEditCustomerDetail } from "@/core/application/interfaces/customers/edit-customer-detail";
import { UpdateCustomerDto } from "@/core/application/dtos/update-customer.dto";
import { resolveLastVisit } from "@/core/domain/customers/rules";

export class EditCustomerDetailUseCase implements IEditCustomerDetail {
  constructor(private readonly repo: ICustomerRepository) { }

  async execute(id: number, data: UpdateCustomerDto): Promise<Customer | null> {const existing = await this.repo.findById(id);
    if (!existing) return null;

    const newName = data.name ?? existing.name;
    const newPhone = data.phone ?? existing.phone;
    const newPoints = data.points ?? existing.points;

    const newLastVisitAt = resolveLastVisit(
      existing.points,
      data.points,
      existing.lastVisitAt,
      data.lastVisitAt
    );

    const updatedCustomer = new Customer({
      name: newName,
      phone: newPhone,
      points: newPoints,
      createdAt: existing.createdAt,
      lastVisitAt: newLastVisitAt,
    });

    updatedCustomer.setId(existing.id!);

    return await this.repo.update(updatedCustomer);
  }
}