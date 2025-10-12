import { CustomerDto, CreateCustomerDto } from "@/core/application/dtos/customers";
import { RegisterCustomer } from "@/core/application/interfaces/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { ClientAlreadyExistsError } from "@/core/domain/customers/errors/client-already-exists.error";
import { ValidationException } from "@/core/domain/shared/errors/validation-exception.error";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Validation } from "@/core/domain/validation/validation.interface";

export class RegisterCustomerUseCase implements RegisterCustomer {
  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly validator: Validation<CreateCustomerDto>,
    private readonly mapper: Mapper<Customer, CustomerDto>,
  ) { }

  async execute(data: CreateCustomerDto): Promise<CustomerDto> {
    const errors = this.validator.validate(data);
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }

    const existingCustomer = await this.customerRepo.findByPhone(data.phone);
    if (existingCustomer) {
      throw new ClientAlreadyExistsError(data.phone);
    }

    const CustomerCreate = new Customer({
      name: data.name,
      phone: data.phone,
      points: 0,
    })

    const customer = await this.customerRepo.create(CustomerCreate);

    return this.mapper.map(customer);
  }
}