import { UpdateCustomerDto, CustomerDto } from "@/core/application/dtos/customers";
import { EditCustomer } from "@/core/application/interfaces/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { resolveLastVisit } from "@/core/domain/customers/rules";
import { ValidationException } from "@/core/domain/shared/errors/validation-exception.error";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Validation } from "@/core/domain/validation/validation.interface";

export interface EditCustomerDep {
  customerRepo: CustomerRepository,
  editCustomerValidator: Validation<UpdateCustomerDto>,
  customerToDtoMapper: Mapper<Customer, CustomerDto>,
}

export class EditCustomerUseCase implements EditCustomer {
  private readonly customerRepo: CustomerRepository;
  private readonly editCustomerValidator: Validation<UpdateCustomerDto>;
  private readonly customerToDtoMapper: Mapper<Customer, CustomerDto>;

  constructor(deps: EditCustomerDep) {
    this.customerRepo = deps.customerRepo;
    this.editCustomerValidator = deps.editCustomerValidator
    this.customerToDtoMapper = deps.customerToDtoMapper
  }

  async execute(id: number, data: UpdateCustomerDto): Promise<CustomerDto> {
    const errors = this.editCustomerValidator.validate(data);
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }

    const existing = await this.customerRepo.getById(id);

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

    const customer = await this.customerRepo.update(updatedCustomer);

    return this.customerToDtoMapper.map(customer);
  }
}