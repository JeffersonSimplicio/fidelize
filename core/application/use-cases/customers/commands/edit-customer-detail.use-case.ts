import { UpdateCustomerDto } from "@/core/application/dtos/customers/update-customer.dto";
import { IEditCustomerDetail } from "@/core/application/interfaces/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { resolveLastVisit } from "@/core/domain/customers/rules";
import { ValidationException } from "@/core/domain/shared/errors/validation-exception.error";
import { IValidation } from "@/core/domain/validation/validation";

export class EditCustomerDetailUseCase implements IEditCustomerDetail {
  constructor(
    private readonly repo: ICustomerRepository,
    private readonly validator: IValidation<UpdateCustomerDto>
  ) { }

  async execute(id: number, data: UpdateCustomerDto): Promise<Customer | null> {
    const errors = this.validator.validate(data);
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }
  
    const existing = await this.repo.findById(id);
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