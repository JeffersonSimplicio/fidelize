import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { IEditCustomerDetail } from "@/core/application/interfaces/customers/edit-customer-detail";
import { UpdateCustomerDto } from "@/core/application/dtos/update-customer.dto";

export class EditCustomerDetailUseCase implements IEditCustomerDetail {
  constructor(private readonly repo: ICustomerRepository) { }

  async execute(id: number, data: UpdateCustomerDto): Promise<Customer | null> {
    const customer = await this.repo.findById(id);

    if (!customer) return null;

    const updateData: UpdateCustomerDto = { ...data };

    const now = new Date();
    // Se pontos aumentaram e não veio lastVisitAt, define como now
    if (
      updateData.points !== undefined &&
      updateData.points > customer.points &&
      !updateData.lastVisitAt
    ) {
      updateData.lastVisitAt = now;
    }

    if (updateData.lastVisitAt) {
      // Se lastVisitAt for anterior à criação do cliente, usa a data de criação
      if (updateData.lastVisitAt < customer.createdAt) {
        updateData.lastVisitAt = customer.createdAt;
      }
      // Se lastVisitAt for no futuro, usa a data atual
      else if (updateData.lastVisitAt > now) {
        updateData.lastVisitAt = now;
      }
    }

    return await this.repo.update(id, updateData);
  }
}