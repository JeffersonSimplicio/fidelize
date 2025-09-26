import { CreateCustomerDto } from "@/application/dtos/create-customer.dto";
import { IRegisterCustomer } from "@/application/interfaces/customers/register-customer.";
import { Customer } from "@/domain/customers/customer.entity";
import { ClientAlreadyExistsError } from "@/domain/customers/errors/client-already-exists.error";
import { ICustomerRepository } from "@/domain/customers/customer.repository";

export class RegisterCustomerUseCase implements IRegisterCustomer {
  constructor(private readonly repo: ICustomerRepository) { }

  async execute(data: CreateCustomerDto): Promise<Customer> {
    const existingCustomer = await this.repo.findByPhone(data.phone);
    if (existingCustomer) {
      throw new ClientAlreadyExistsError(data.phone);
    }

    const now = new Date();
    const CustomerCreate = {
      name: data.name,
      phone: data.phone,
      points: 0,
      lastVisitAt: now,
      createdAt: now,
    }

    const customer = await this.repo.create(CustomerCreate);

    return customer;
  }
}