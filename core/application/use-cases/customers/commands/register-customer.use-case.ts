import { CreateCustomerDto } from "@/core/application/dtos/customers/create-customer.dto";
import { IRegisterCustomer } from "@/core/application/interfaces/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { ClientAlreadyExistsError } from "@/core/domain/customers/errors/client-already-exists.error";
import { ValidationException } from "@/core/domain/shared/errors/validation-exception.error";
import { IValidation } from "@/core/domain/validation/validation";

export class RegisterCustomerUseCase implements IRegisterCustomer {
  constructor(
    private readonly repo: ICustomerRepository,
    private readonly validator: IValidation<CreateCustomerDto>
  ) { }

  async execute(data: CreateCustomerDto): Promise<Customer> {
    const errors = this.validator.validate(data);
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }

    const existingCustomer = await this.repo.findByPhone(data.phone);
    if (existingCustomer) {
      throw new ClientAlreadyExistsError(data.phone);
    }

    const CustomerCreate = new Customer({
      name: data.name,
      phone: data.phone,
      points: 0,
    })

    const customer = await this.repo.create(CustomerCreate);

    return customer;
  }
}