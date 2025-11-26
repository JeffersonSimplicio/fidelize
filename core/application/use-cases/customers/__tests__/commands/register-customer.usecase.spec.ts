import {
  CustomerDto,
  CreateCustomerDto,
} from '@/core/application/dtos/customers';
import { RegisterCustomerUseCase } from '@/core/application/use-cases/customers';
import { Customer } from '@/core/domain/customers/customer.entity';
import { CustomerRepository } from '@/core/domain/customers/customer.repository.interface';
import { ClientAlreadyExistsError } from '@/core/domain/customers/errors/client-already-exists.error';
import { ValidationException } from '@/core/domain/shared/errors/validation-exception.error';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { Validation } from '@/core/domain/validation/validation.interface';

describe('RegisterCustomerUseCase', () => {
  let useCase: RegisterCustomerUseCase;

  let customerRepo: jest.Mocked<CustomerRepository>;
  let createCustomerValidator: jest.Mocked<Validation<CreateCustomerDto>>;
  let customerToDtoMapper: jest.Mocked<Mapper<Customer, CustomerDto>>;

  const validInput: CreateCustomerDto = {
    name: 'John Doe',
    phone: '55999999999',
  };

  const mockCustomerEntity = new Customer({
    name: validInput.name,
    phone: validInput.phone,
    points: 0,
  });

  const mockOutputDto: CustomerDto = {
    id: 1,
    name: validInput.name,
    phone: validInput.phone,
    points: 0,
    createdAt: new Date().toISOString(),
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

    createCustomerValidator = {
      validate: jest.fn(),
    };

    customerToDtoMapper = {
      map: jest.fn(),
    };

    useCase = new RegisterCustomerUseCase({
      customerRepo,
      createCustomerValidator,
      customerToDtoMapper,
    });
  });

  it('should throw ValidationException when validator returns errors', async () => {
    createCustomerValidator.validate.mockReturnValue([
      { field: 'phone', message: 'Phone is invalid' },
    ]);

    await expect(useCase.execute(validInput)).rejects.toBeInstanceOf(
      ValidationException,
    );

    expect(createCustomerValidator.validate).toHaveBeenCalledWith(validInput);
    expect(customerRepo.findByPhone).not.toHaveBeenCalled();
  });

  it('should throw ClientAlreadyExistsError if customer already exists', async () => {
    createCustomerValidator.validate.mockReturnValue([]);
    customerRepo.findByPhone.mockResolvedValue(mockCustomerEntity);

    await expect(useCase.execute(validInput)).rejects.toBeInstanceOf(
      ClientAlreadyExistsError,
    );

    expect(customerRepo.findByPhone).toHaveBeenCalledWith(validInput.phone);
    expect(customerRepo.create).not.toHaveBeenCalled();
  });

  it('should create a customer and return a mapped DTO', async () => {
    createCustomerValidator.validate.mockReturnValue([]);
    customerRepo.findByPhone.mockResolvedValue(null);
    customerRepo.create.mockResolvedValue(mockCustomerEntity);
    customerToDtoMapper.map.mockReturnValue(mockOutputDto);

    const result = await useCase.execute(validInput);

    expect(createCustomerValidator.validate).toHaveBeenCalledWith(validInput);
    expect(customerRepo.findByPhone).toHaveBeenCalledWith(validInput.phone);
    expect(customerRepo.create).toHaveBeenCalled();
    expect(customerToDtoMapper.map).toHaveBeenCalledWith(mockCustomerEntity);

    expect(result).toEqual(mockOutputDto);
  });

  it('should construct a Customer entity with initial points = 0', async () => {
    createCustomerValidator.validate.mockReturnValue([]);
    customerRepo.findByPhone.mockResolvedValue(null);

    const createSpy = jest
      .spyOn(customerRepo, 'create')
      .mockResolvedValue(mockCustomerEntity);

    customerToDtoMapper.map.mockReturnValue(mockOutputDto);

    await useCase.execute(validInput);

    const createdEntity = createSpy.mock.calls[0][0];

    expect(createdEntity).toBeInstanceOf(Customer);
    expect(createdEntity.name).toBe(validInput.name);
    expect(createdEntity.phone).toBe(validInput.phone);
    expect(createdEntity.points).toBe(0);
  });

  it('should throw if repository.create throws', async () => {
    createCustomerValidator.validate.mockReturnValue([]);
    customerRepo.findByPhone.mockResolvedValue(null);
    customerRepo.create.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(validInput)).rejects.toThrow('Database error');
  });

  it('should throw if mapper.map throws', async () => {
    createCustomerValidator.validate.mockReturnValue([]);
    customerRepo.findByPhone.mockResolvedValue(null);
    customerRepo.create.mockResolvedValue(mockCustomerEntity);

    customerToDtoMapper.map.mockImplementation(() => {
      throw new Error('Mapper failure');
    });

    await expect(useCase.execute(validInput)).rejects.toThrow('Mapper failure');
  });
});
