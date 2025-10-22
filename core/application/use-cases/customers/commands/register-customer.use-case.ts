import { CustomerDto, CreateCustomerDto } from "@/core/application/dtos/customers";
import { RegisterCustomer } from "@/core/application/interfaces/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { ClientAlreadyExistsError } from "@/core/domain/customers/errors/client-already-exists.error";
import { ValidationException } from "@/core/domain/shared/errors/validation-exception.error";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Validation } from "@/core/domain/validation/validation.interface";

export interface RegisterCustomerDep {
  customerRepo: CustomerRepository,
  createCustomerValidator: Validation<CreateCustomerDto>,
  customerToDtoMapper: Mapper<Customer, CustomerDto>,
}

export class RegisterCustomerUseCase implements RegisterCustomer {
  private readonly customerRepo: CustomerRepository;
  private readonly createCustomerValidator: Validation<CreateCustomerDto>;
  private readonly customerToDtoMapper: Mapper<Customer, CustomerDto>;

  constructor(deps: RegisterCustomerDep) {
    this.customerRepo = deps.customerRepo;
    this.createCustomerValidator = deps.createCustomerValidator;
    this.customerToDtoMapper = deps.customerToDtoMapper;
  }

  async execute(data: CreateCustomerDto): Promise<CustomerDto> {
    const errors = this.createCustomerValidator.validate(data);
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

    return this.customerToDtoMapper.map(customer);
  }
}