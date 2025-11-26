import { GetCustomerDetailUseCase } from '@/core/application/use-cases/customers';
import { CustomerRepository } from '@/core/domain/customers/customer.repository.interface';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { Customer } from '@/core/domain/customers/customer.entity';
import { CustomerDto } from '@/core/application/dtos/customers';

describe('GetCustomerDetailUseCase', () => {
  let customerRepo: jest.Mocked<CustomerRepository>;
  let customerToDtoMapper: jest.Mocked<Mapper<Customer, CustomerDto>>;
  let useCase: GetCustomerDetailUseCase;

  beforeEach(() => {
    customerRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      findByPhone: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    customerToDtoMapper = {
      map: jest.fn(),
    };

    useCase = new GetCustomerDetailUseCase({
      customerRepo,
      customerToDtoMapper,
    });
  });

  it('should fetch customer by id and return mapped DTO (happy path)', async () => {
    const createdAt = new Date('2024-01-01T00:00:00.000Z');
    const lastVisitAt = new Date('2024-06-01T12:00:00.000Z');

    const customer = new Customer({
      name: 'Bob Example',
      phone: '5511999999999',
      points: 20,
      createdAt,
      lastVisitAt,
    });
    customer.setId(42);

    const expectedDto: CustomerDto = {
      id: 42,
      name: 'Bob Example',
      phone: '5511999999999',
      points: 20,
      createdAt: createdAt.toISOString(),
      lastVisitAt: lastVisitAt.toISOString(),
    };

    customerRepo.getById.mockResolvedValue(customer);
    customerToDtoMapper.map.mockReturnValue(expectedDto);

    const result = await useCase.execute(42);

    expect(customerRepo.getById).toHaveBeenCalledWith(42);
    expect(customerRepo.getById).toHaveBeenCalledTimes(1);

    expect(customerToDtoMapper.map).toHaveBeenCalledWith(customer);
    expect(customerToDtoMapper.map).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expectedDto);
  });

  it('should propagate error when repository.getById throws', async () => {
    customerRepo.getById.mockRejectedValue(new Error('Customer not found'));

    await expect(useCase.execute(999)).rejects.toThrow('Customer not found');

    expect(customerRepo.getById).toHaveBeenCalledWith(999);
    expect(customerToDtoMapper.map).not.toHaveBeenCalled();
  });

  it('should propagate error when mapper.map throws', async () => {
    const customer = new Customer({
      name: 'Charlie',
      phone: '5511888888888',
      points: 5,
    });
    customer.setId(7);

    customerRepo.getById.mockResolvedValue(customer);
    customerToDtoMapper.map.mockImplementation(() => {
      throw new Error('Mapper failure');
    });

    await expect(useCase.execute(7)).rejects.toThrow('Mapper failure');

    expect(customerRepo.getById).toHaveBeenCalledWith(7);
    expect(customerToDtoMapper.map).toHaveBeenCalledWith(customer);
  });

  it('should not call unrelated repository methods', async () => {
    const customer = new Customer({
      name: 'Daisy',
      phone: '5511777777777',
      points: 0,
    });
    customer.setId(55);

    customerRepo.getById.mockResolvedValue(customer);
    customerToDtoMapper.map.mockReturnValue({
      id: 55,
      name: 'Daisy',
      phone: '5511777777777',
      points: 0,
      createdAt: customer.createdAt.toISOString(),
      lastVisitAt: customer.lastVisitAt.toISOString(),
    });

    await useCase.execute(55);

    expect(customerRepo.getById).toHaveBeenCalledTimes(1);
    expect(customerRepo.create).not.toHaveBeenCalled();
    expect(customerRepo.findByPhone).not.toHaveBeenCalled();
    expect(customerRepo.update).not.toHaveBeenCalled();
    expect(customerRepo.delete).not.toHaveBeenCalled();
  });
});
