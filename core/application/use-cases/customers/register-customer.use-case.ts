import { CreateCustomerDto } from "@/core/application/dtos/create-customer.dto";
import { IRegisterCustomer } from "@/core/application/interfaces/customers/register-customer";
import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { ClientAlreadyExistsError } from "@/core/domain/customers/errors/client-already-exists.error"

export class RegisterCustomerUseCase implements IRegisterCustomer {
  constructor(private readonly repo: ICustomerRepository) { }

  async execute(data: CreateCustomerDto): Promise<Customer> {
    const existingCustomer = await this.repo.findByPhone(data.phone);
    if (existingCustomer) {
      throw new ClientAlreadyExistsError(data.phone);
    }

    const CustomerCreate = new Customer({
      name: data.name,
      phone: data.phone,
      points: 0,
    })

    console.log("No use case: ", CustomerCreate);
    

    const customer = await this.repo.create(CustomerCreate);

    return customer;
  }
}