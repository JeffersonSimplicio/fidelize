import { EditCustomerUseCase } from "@/core/application/use-cases/customers";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { Validation } from "@/core/domain/validation/validation.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { UpdateCustomerDto, CustomerDto } from "@/core/application/dtos/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { ValidationException } from "@/core/domain/shared/errors/validation-exception.error";

describe("EditCustomerUseCase", () => {
  let useCase: EditCustomerUseCase;

  let customerRepo: jest.Mocked<CustomerRepository>;
  let editCustomerValidator: jest.Mocked<Validation<UpdateCustomerDto>>;
  let customerToDtoMapper: jest.Mocked<Mapper<Customer, CustomerDto>>;

  const existingCreatedAt = new Date("2024-01-01T10:00:00.000Z");
  const existingLastVisit = new Date("2024-06-01T12:00:00.000Z");

  const existingCustomer = new Customer({
    name: "Alice Original",
    phone: "5511999999999",
    points: 10,
    createdAt: existingCreatedAt,
    lastVisitAt: existingLastVisit,
  });
  existingCustomer.setId(123);

  const mappedDto: CustomerDto = {
    id: 123,
    name: "Alice Updated",
    phone: "5511988888888",
    points: 15,
    createdAt: existingCreatedAt.toISOString(),
    lastVisitAt: new Date().toISOString(),
  };

  beforeEach(() => {
    customerRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      findByPhone: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    editCustomerValidator = {
      validate: jest.fn(),
    };

    customerToDtoMapper = {
      map: jest.fn(),
    };

    useCase = new EditCustomerUseCase({
      customerRepo,
      editCustomerValidator,
      customerToDtoMapper,
    });
  });

  it("should throw ValidationException when validator returns errors", async () => {
    editCustomerValidator.validate.mockReturnValue([
      { field: "phone", message: "Phone is invalid" },
    ]);

    const data: UpdateCustomerDto = { phone: "bad" };

    await expect(useCase.execute(123, data)).rejects.toBeInstanceOf(ValidationException);

    expect(editCustomerValidator.validate).toHaveBeenCalledWith(data);
    expect(customerRepo.getById).not.toHaveBeenCalled();
    expect(customerRepo.update).not.toHaveBeenCalled();
  });

  it("should fetch existing customer, update nothing (no changes) and return mapped DTO", async () => {
    editCustomerValidator.validate.mockReturnValue([]);
    customerRepo.getById.mockResolvedValue(existingCustomer);
    customerRepo.update.mockImplementation(async (cust) => cust);
    customerToDtoMapper.map.mockReturnValue(mappedDto);

    const result = await useCase.execute(existingCustomer.id!, {});

    expect(editCustomerValidator.validate).toHaveBeenCalledWith({});
    expect(customerRepo.getById).toHaveBeenCalledWith(existingCustomer.id);
    expect(customerRepo.update).toHaveBeenCalled();
    expect(customerToDtoMapper.map).toHaveBeenCalled();
    expect(result).toEqual(mappedDto);
  });

  it("should update name, phone and points when provided", async () => {
    editCustomerValidator.validate.mockReturnValue([]);
    customerRepo.getById.mockResolvedValue(existingCustomer);

    customerRepo.update.mockImplementation(async (c) => c);

    customerToDtoMapper.map.mockReturnValue(mappedDto);

    const updateDto: UpdateCustomerDto = {
      name: "Alice Updated",
      phone: "5511988888888",
      points: 15,
    };

    const result = await useCase.execute(existingCustomer.id!, updateDto);

    const updatedArg = (customerRepo.update.mock.calls[0][0] as Customer);

    expect(updatedArg.name).toBe(updateDto.name);
    expect(updatedArg.phone).toBe(updateDto.phone);
    expect(updatedArg.points).toBe(updateDto.points);

    expect(updatedArg.createdAt.getTime()).toBe(existingCreatedAt.getTime());

    expect(updatedArg.id).toBe(existingCustomer.id);

    expect(result).toEqual(mappedDto);
  });

  it("should use provided lastVisitAt when data.lastVisitAt is provided", async () => {
    editCustomerValidator.validate.mockReturnValue([]);
    customerRepo.getById.mockResolvedValue(existingCustomer);
    customerRepo.update.mockImplementation(async (c) => c);

    customerToDtoMapper.map.mockReturnValue(mappedDto);

    const providedLastVisit = new Date("2025-02-02T08:00:00.000Z");

    const updateDto: UpdateCustomerDto = {
      lastVisitAt: providedLastVisit,
      points: existingCustomer.points,
    };

    await useCase.execute(existingCustomer.id!, updateDto);

    const updatedArg = customerRepo.update.mock.calls[0][0] as Customer;

    expect(updatedArg.lastVisitAt.getTime()).toBe(providedLastVisit.getTime());
  });

  it("should update lastVisitAt to now when points increased and no lastVisit provided", async () => {
    editCustomerValidator.validate.mockReturnValue([]);
    customerRepo.getById.mockResolvedValue(existingCustomer);
    customerRepo.update.mockImplementation(async (c) => c);
    customerToDtoMapper.map.mockReturnValue(mappedDto);

    jest.useFakeTimers();
    const fakeNow = new Date("2025-03-03T09:30:00.000Z");
    jest.setSystemTime(fakeNow);

    const updateDto: UpdateCustomerDto = {
      points: existingCustomer.points + 5,
    };

    await useCase.execute(existingCustomer.id!, updateDto);

    const updatedArg = customerRepo.update.mock.calls[0][0] as Customer;

    expect(updatedArg.lastVisitAt.getTime()).toBe(fakeNow.getTime());
    expect(updatedArg.lastVisitAt.getTime()).toBeGreaterThan(existingLastVisit.getTime());

    jest.useRealTimers();
  });

  it("should keep lastVisitAt unchanged when points not increased and no lastVisit provided", async () => {
    editCustomerValidator.validate.mockReturnValue([]);
    customerRepo.getById.mockResolvedValue(existingCustomer);
    customerRepo.update.mockImplementation(async (c) => c);
    customerToDtoMapper.map.mockReturnValue(mappedDto);

    const updateDto: UpdateCustomerDto = {
      points: existingCustomer.points,
    };

    await useCase.execute(existingCustomer.id!, updateDto);

    const updatedArg = customerRepo.update.mock.calls[0][0] as Customer;

    expect(updatedArg.lastVisitAt.getTime()).toBe(existingLastVisit.getTime());
  });

  it("should propagate repository.update errors", async () => {
    editCustomerValidator.validate.mockReturnValue([]);
    customerRepo.getById.mockResolvedValue(existingCustomer);
    customerRepo.update.mockRejectedValue(new Error("DB update failed"));

    const updateDto: UpdateCustomerDto = { name: "New Name" };

    await expect(useCase.execute(existingCustomer.id!, updateDto)).rejects.toThrow("DB update failed");
  });

  it("should propagate mapper.map errors", async () => {
    editCustomerValidator.validate.mockReturnValue([]);
    customerRepo.getById.mockResolvedValue(existingCustomer);
    customerRepo.update.mockImplementation(async (c) => c);
    customerToDtoMapper.map.mockImplementation(() => { throw new Error("Mapper broken"); });

    const updateDto: UpdateCustomerDto = { name: "New Name" };

    await expect(useCase.execute(existingCustomer.id!, updateDto)).rejects.toThrow("Mapper broken");
  });
});
