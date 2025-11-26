import { ListCustomersUseCase } from '@/core/application/use-cases/customers';
import { CustomerQueryRepository } from '@/core/domain/customers/customer.query.repository.interface';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { Customer } from '@/core/domain/customers/customer.entity';
import { CustomerDto } from '@/core/application/dtos/customers';

describe('ListCustomersUseCase', () => {
  let customerQueryRepo: jest.Mocked<CustomerQueryRepository>;
  let customerToDtoMapper: jest.Mocked<Mapper<Customer, CustomerDto>>;
  let useCase: ListCustomersUseCase;

  beforeEach(() => {
    customerQueryRepo = {
      findAll: jest.fn(),
      findByName: jest.fn(),
      findTopCustomersByPoints: jest.fn(),
    };

    customerToDtoMapper = {
      map: jest.fn(),
    };

    useCase = new ListCustomersUseCase({
      customerQueryRepo,
      customerToDtoMapper,
    });
  });

  it('should return a list of mapped customer DTOs (happy path)', async () => {
    const customer1 = new Customer({
      name: 'Alice',
      phone: '11111111111',
      points: 10,
    });
    customer1.setId(1);

    const customer2 = new Customer({
      name: 'Bob',
      phone: '22222222222',
      points: 20,
    });
    customer2.setId(2);

    const customers = [customer1, customer2];

    const dto1: CustomerDto = {
      id: 1,
      name: 'Alice',
      phone: '11111111111',
      points: 10,
      createdAt: customer1.createdAt.toISOString(),
      lastVisitAt: customer1.lastVisitAt.toISOString(),
    };

    const dto2: CustomerDto = {
      id: 2,
      name: 'Bob',
      phone: '22222222222',
      points: 20,
      createdAt: customer2.createdAt.toISOString(),
      lastVisitAt: customer2.lastVisitAt.toISOString(),
    };

    customerQueryRepo.findAll.mockResolvedValue(customers);
    customerToDtoMapper.map.mockImplementation((c) => {
      if (c.id === 1) return dto1;
      return dto2;
    });

    const result = await useCase.execute();

    expect(customerQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(customerToDtoMapper.map).toHaveBeenCalledTimes(2);
    expect(customerToDtoMapper.map).toHaveBeenNthCalledWith(1, customer1);
    expect(customerToDtoMapper.map).toHaveBeenNthCalledWith(2, customer2);
    expect(result).toEqual([dto1, dto2]);
  });

  it('should return an empty array if repository returns no customers', async () => {
    customerQueryRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(customerQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(customerToDtoMapper.map).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should propagate errors thrown by repository.findAll', async () => {
    customerQueryRepo.findAll.mockRejectedValue(new Error('Database failure'));

    await expect(useCase.execute()).rejects.toThrow('Database failure');

    expect(customerQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(customerToDtoMapper.map).not.toHaveBeenCalled();
  });

  it('should propagate errors thrown by the mapper', async () => {
    const customer = new Customer({
      name: 'Charlie',
      phone: '33333333333',
      points: 5,
    });
    customer.setId(3);

    customerQueryRepo.findAll.mockResolvedValue([customer]);

    customerToDtoMapper.map.mockImplementation(() => {
      throw new Error('Mapper error');
    });

    await expect(useCase.execute()).rejects.toThrow('Mapper error');

    expect(customerQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(customerToDtoMapper.map).toHaveBeenCalledWith(customer);
  });

  it('should not call unrelated repository methods', async () => {
    const customer = new Customer({
      name: 'Daisy',
      phone: '44444444444',
      points: 0,
    });
    customer.setId(4);

    const dto: CustomerDto = {
      id: 4,
      name: 'Daisy',
      phone: '44444444444',
      points: 0,
      createdAt: customer.createdAt.toISOString(),
      lastVisitAt: customer.lastVisitAt.toISOString(),
    };

    customerQueryRepo.findAll.mockResolvedValue([customer]);
    customerToDtoMapper.map.mockReturnValue(dto);

    await useCase.execute();

    expect(customerQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(customerQueryRepo.findByName).not.toHaveBeenCalled();
    expect(customerQueryRepo.findTopCustomersByPoints).not.toHaveBeenCalled();
  });
});
